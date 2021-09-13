<template>
  <v-container>
    <h1 class="secondary--text">
      Receitas favoritas
      <v-icon large class="secondary--text">
        mdi-heart
      </v-icon>
    </h1>
    <p class="secondary--text">Minhas receitas favoritas</p>

    <v-row>
      <v-col cols="4" v-for="(favorite, index) in favorites" :key="index">
        <app-ui-nav-card-receita :receita="favorite"> </app-ui-nav-card-receita>
      </v-col>
    </v-row>
    <div class="mt-3">
      <v-alert type="info" v-if="favorites.length == 0">
        <p>Não há receitas favoritas : (</p>
      </v-alert>
    </div>

    <div class="mt-3">
      <app-ui-back-btn label="Voltar a receitas"> </app-ui-back-btn>
    </div>
  </v-container>
</template>

<script>
export default {
  middlewares: "auth",
  name: "Favorites",
  async asyncData({ app, store }) {
    let client = app.apolloProvider.defaultClient;
    let id = app.$auth.user.id;
    let query = {
      context: {
        headers: {
          authorization: app.$auth.strategy.token.get()
        }
      },
      query: require("../../graphql/userFavorites.gql"),
      fetchPolicy: "no-cache",
      variables: { id: id }
    };
    let favorites = null;
    await client
      .query(query)
      .then(response => {
        favorites = response.data.user.favorites;
        store.commit("user/setFavorites", favorites);
      })
      .catch(e => {
        console.log(e);
      });
    return { favorites };
  }
};
</script>

<style></style>
