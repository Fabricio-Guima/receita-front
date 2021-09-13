<<template>
  <v-card>
    <v-card-title class="title secondary white--text">
      <v-icon class="mr-3">mdi-account-plus</v-icon>
      Cadastrar-se
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-form @submit.prevent="onsubmit" ref="form">
          <v-text-field
            dense
            outlined
            label="Nome"
            v-model="userInfo.username"
            :rules="[rules.required]"
          ></v-text-field>
          <v-text-field
            dense
            outlined
            label="E-mail"
            v-model="userInfo.email"
            :rules="[rules.required, rules.email]"
          ></v-text-field>
          <v-text-field
            dense
            outlined
            label="Senha"
            v-model="userInfo.password"
            :rules="[rules.required, rules.min]"
            counter
            :type="show ? 'text' : 'password'"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="show = !show"
          ></v-text-field>
          <v-text-field
            dense
            outlined
            label="Confirmar Senha"
            v-model="userInfo.repassword"
            :rules="[rules.required, rules.min, rules.match]"
            counter
            :type="show2 ? 'text' : 'password'"
            :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="show2 = !show2"
          ></v-text-field>
          <div class="d-flex justify-space-between">
            <v-btn color="secondary" small type="submit">Registrar-se</v-btn>
            <v-btn color="secondary" small outlined @click="close()"
              >Cancelar</v-btn
            >
          </div>
        </v-form>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      show: false,
      show2: false,
      rules: {
        required: value => !!value || "campo obrigatório",
        min: v => (v || "").length >= 8 || "Mínimo de 8 caracteres",
        email: v => /.+@/.test(v) || "Formato inválido de e-mail",
        match: () =>
          this.userInfo.password === this.userInfo.repassword ||
          "Senhas estão diferentes"
      },
      userInfo: {
        username: "",
        email: "",
        password: "",
        repassword: ""
      }
    };
  },
  methods: {
    close() {
      this.$emit("close", false);
      this.$refs.form.reset();
    },
    onsubmit() {
      if (this.$refs.form.validate()) {
        this.userInfo.identifier = this.userInfo.username;
        this.$apollo
          .mutate({
            mutation: require("../../graphql/register.gql"),
            variables: this.userInfo
          })
          .then(response => {
            this.$auth.loginWith("local", { data: this.userInfo }).then(() => {
              this.$emit("close", false);
              const msg = `Bem vindo, ${this.$auth.user.username}`;
              this.$refs.form.reset();
              this.$store.dispatch("snackbar/setSnack", {
                text: msg,
                color: "success"
              });
            });
          });
      }
    }
  }
};
</script>

<style></style>
