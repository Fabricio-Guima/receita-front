<template>
  <v-card>
    <v-card-title>
      <v-icon class="mr-3">mdi-account-key</v-icon>
      Iniciar sessão
    </v-card-title>
    <v-card-text>
      <v-form @submit.prevent="onsubmit()">
        <v-text-field
          dense
          outlined
          label="Nome"
          v-model="userInfo.identifier"
        ></v-text-field>
        <v-text-field
          dense
          outlined
          label="Senha"
          v-model="userInfo.password"
          :type="show ? 'text' : 'password'"
          :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="show = !show"
        ></v-text-field>

        <div class="d-flex justify-space-between">
          <v-btn color="primary" small type="submit">Entrar</v-btn>
          <v-btn color="primary" small outlined @click="close()"
            >Cancelar</v-btn
          >
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      show: false,
      userInfo: {
        identifier: "fabricioguimaraes55@gmail.com",
        password: "789456Ff@"
      }
    };
  },
  methods: {
    close() {
      this.$emit("close", false);
    },
    async onsubmit() {
      await this.$auth
        .loginWith("local", { data: this.userInfo })
        .then(() => {
          console.log("Auth: ", this.$auth);
          this.$emit("close", false);
          this.userInfo.identifier = "";
          this.userInfo.password = "";
          const msg = `Bem vindo, ${this.$auth.user.username}`;
          this.$store.dispatch("snackbar/setSnack", {
            text: msg,
            color: "success"
          });
        })
        .catch(e => {
          this.$store.dispatch("snackbar/setSnack", {
            text: "E-mail ou senha inválidos",
            color: "error"
          });
        });
    }
  }
};
</script>

<style></style>
