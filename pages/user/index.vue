<template>
  <v-container>
    <h2>Bem vindo, {{ $auth.user.username }}</h2>
    <v-divider class="my-5"> </v-divider>
    <v-btn color="primary" small class="my-3" to="user/newReceita"
      >Criar receita</v-btn
    >
    <h3>Lista de receitas</h3>
    <div v-if="receitas && receitas.length > 0">
      <app-ui-list-receitas :receitas="receitas"> </app-ui-list-receitas>
    </div>
    <div v-else>
      Carregando...
    </div>
  </v-container>
</template>

<script>
export default {
  middleware: "auth",
  async asyncData({ app }) {
    let client = app.apolloProvider.defaultClient;
    let id = app.$auth.user.id;
    let query = {
      query: require("../../graphql/userReceitas.gql"),
      variables: { id: id }
    };
    let receitas = null;
    await client.query(query).then(response => {
      receitas = response.data.receitas;
    });

    return { receitas };
  }
};
</script>

<style></style>
