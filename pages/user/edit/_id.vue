<template>
  <v-container>
    <h2>Editar receita</h2>
    <v-divider class="my-5"> </v-divider>
    <div v-if="receita">
      <app-forms-receita :receita="receita"></app-forms-receita>
    </div>
  </v-container>
</template>

<script>
export default {
  middleware: "auth",
  async asyncData({ app, route }) {
    const client = app.apolloProvider.defaultClient;
    const id = route.params.id;
    const query = {
      query: require("../../../graphql/receita.gql"),
      variables: { id: id }
    };
    let receita = null;
    await client.query(query).then(response => {
      receita = response.data.receita;
    });
    return { receita };
  }
};
</script>

<style></style>
