<template>
  <v-container>
    <h1 class="secondary--text">
      {{ category.name }}
      <v-icon large class="secondary--text">
        {{ category.icon }}
      </v-icon>
    </h1>
    <p class="secondary--text">{{ category.description }}</p>

    <v-row>
      <v-col cols="4" v-for="(receita, index) in receitas" :key="index">
        <app-ui-nav-card-receita :receita="receita"> </app-ui-nav-card-receita>
      </v-col>
    </v-row>
    <div class="mt-3">
      <v-alert type="info" v-if="receitas.length == 0">
        <p>Não há receitas criadas para esta categoria : (</p>
      </v-alert>
    </div>

    <div class="mt-3">
      <app-ui-back-btn label="Voltar a receitas"> </app-ui-back-btn>
    </div>
  </v-container>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    category() {
      const slug = this.$route.params.category;
      return this.$store.getters.readCategories.find(
        category => category.slug == slug
      );
    }
  },
  async asyncData({ app, route }) {
    const slug = route.params.category;
    const client = app.apolloProvider.defaultClient;
    const query = {
      query: require("../../graphql/receitas.gql"),
      variables: { slug: slug }
    };
    let receitas = [];
    await client
      .query(query)
      .then(response => {
        console.log(response.data.receitas);
        receitas = response.data.receitas;
      })
      .catch(err => {
        console.log(err);
      });

    return { receitas };
  }
};
</script>

<style></style>
