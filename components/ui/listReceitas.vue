<template>
  <div v-if="receitas && receitas.length > 0">
    <v-list>
      <v-list-item-group>
        <template v-for="(receita, index) in receitas">
          <v-list-item two-line :key="index">
            <v-list-item-content>
              <v-list-item-title>{{ receita.name }}</v-list-item-title>
              <v-list-item-subtitle v-if="receita.category">
                {{ receita.category.name || " " }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-row align="center" justify="center">
                <v-btn
                  icon
                  :to="{ name: 'user-edit-id', params: { id: receita.id } }"
                >
                  <v-icon>mdi-pencil</v-icon></v-btn
                >
                <app-ui-delete-item
                  @choice="deleteItem($event, receita.id)"
                ></app-ui-delete-item>
              </v-row>
            </v-list-item-action>
          </v-list-item>
        </template>
      </v-list-item-group>
    </v-list>
  </div>
  <div v-else>
    Não receitas disponíveis
  </div>
</template>

<script>
export default {
  name: "ListReceitas",
  props: {
    receitas: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    deleteItem(choice, id) {
      console.log(choice);
      if (choice) {
        this.$apollo
          .mutate({
            context: {
              headers: {
                authorization: this.$auth.strategy.token.get()
              }
            },
            mutation: require("../../graphql/deleteReceita.gql"),
            variables: { id: id }
          })
          .then(response => {
            console.log("Receita deletada");
            const myReceita = this.receitas.find(item => item.id == id);
            const index = this.receitas.indexOf(myReceita);
            this.receitas.splice(index, 1);
          });
      }
    }
  }
};
</script>

<style></style>
