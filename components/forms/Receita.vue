<template>
  <v-container>
    <v-card max-width="800" class="mx-auto">
      <v-card-title class="heading"> Minha receita </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="onsubmit()">
          <v-text-field
            dense
            label="Name"
            outlined
            v-model="receita.name"
          ></v-text-field>
          <v-row>
            <v-col cols="4">
              <v-text-field
                dense
                label="Duration"
                outlined
                v-model="receita.duration"
                type="number"
              ></v-text-field
            ></v-col>
            <v-col cols="4">
              <v-text-field
                dense
                label="Quantidade de pratos"
                outlined
                v-model="receita.servings"
                type="number"
              ></v-text-field
            ></v-col>
            <v-col cols="4"
              ><v-select
                dense
                outlined
                v-model="receita.category"
                label="Categoria"
                :items="categories"
                item-text="name"
                item-value="id"
              >
              </v-select
            ></v-col>
          </v-row>

          <v-text-field
            dense
            label="Image"
            outlined
            v-model="receita.image"
          ></v-text-field>

          <v-textarea
            dense
            label="Description"
            outlined
            v-model="receita.description"
          >
          </v-textarea>

          <div v-for="(ingredient, index) in receita.ingredients" :key="index">
            <v-text-field
              dense
              :label="`Ingredient ${index + 1}`"
              outlined
              v-model="receita.ingredients[index]"
            ></v-text-field>
          </div>

          <v-btn class="primary mb-5" small @click="addItem('ingredients')"
            >Adicionar ingrediente</v-btn
          >
          <div>
            <div v-for="(ingredient, index) in receita.steps" :key="index">
              <v-textarea
                dense
                :label="`Step ${index + 1}`"
                outlined
                v-model="receita.steps[index]"
              ></v-textarea>
            </div>

            <v-btn class="primary" small @click="addItem('steps')"
              >Adicionar steps</v-btn
            >
          </div>

          <v-btn type="submit" class="secondary my-5" small
            >{{ hasId ? "Atualizar" : "Criar" }}
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "Receita",
  props: {
    receita: {
      type: Object,
      default: () => ({
        name: "",
        duration: 0,
        servings: 0,
        image: "",
        description: "",
        ingredients: [""],
        steps: [""],
        category: 1
      })
    }
  },
  computed: {
    categories() {
      return this.$store.getters.readCategories;
    },
    hasId() {
      return this.receita.hasOwnProperty("id");
    },

    formatedTime() {
      let hours = Math.floor(this.receita.duration / 60);
      let minutes = this.receita.duration % 60;
      let total = ("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2);

      return total;
    }
  },

  methods: {
    addItem(item) {
      if (this.receita[item] == null) {
        this.receita[item] = [];
      }
      this.receita[item].push("");
    },
    async onsubmit() {
      const id = this.$auth.user.id;
      this.receita.autor = id;
      this.receita.duration = Number(this.receita.duration);
      this.receita.servings = Number(this.receita.servings);
      const token = this.$auth.strategy.token.get();
      const mutation = this.hasId ? "updateReceita" : "createReceita";

      if (typeof this.receita.category === "object") {
        this.receita.category = this.receita.category.id;
      }
      await this.$apollo
        .mutate({
          context: {
            headers: {
              authorization: token
            }
          },
          mutation: require("../../graphql/" + mutation + ".gql"),
          variables: this.receita,
          update: (cache, myreceita) => {
            if (mutation == "createReceita") {
              const data = cache.readQuery({
                query: require("../../graphql/userReceitas.gql"),
                variables: { id }
              });
              data.receitas.push(myreceita.data[mutation].receita);
              cache.writeQuery({
                query: require("../../graphql/userReceitas.gql"),
                variables: { id },
                data
              });
            }

            console.log(data);
          }
        })
        .then(response => {
          console.log(response.data);
          this.$router.push({ name: "user" });
          this.$store.dispatch("snackbar/setSnack", {
            text: "Receita criada com sucesso",
            color: "info"
          });
        })
        .catch(e => {
          console.log(e);
          this.$store.dispatch("snackbar/setSnack", {
            text: "Erro ao criar receita",
            color: "error"
          });
        });
    }
  }
};
</script>

<style></style>
