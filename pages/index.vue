<template>
  <v-container>
    <v-row>
      <v-col
        cols="12"
        sm="4"
        md="3"
        v-for="(category, index) in categories"
        :key="index"
      >
        <app-ui-nav-card :category="category"></app-ui-nav-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// import { categories, category } from "@/graphql/queries.js";

export default {
  name: "Index",
  middleware: "initData",
  data() {
    return {
      // query: categories
    };
  },
  computed: {
    categories() {
      return this.$store.getters.readCategories;
    }
  }
  // async fetch() {
  //   const client = this.$apollo.getClient();
  //   const query = {
  //     query: require("../graphql/categories.gql")
  //   };

  //   await client.query(query).then(response => {
  //     this.categories = response.data.categories;
  //   });
  // }

  // async asyncData(context) {
  //   const client = context.app.apolloProvider.defaultClient;
  //   const query = {
  //     query: require("../graphql/categories.gql")
  //   };
  //   let categories = [];
  //   await client.query(query).then(response => {
  //     categories = response.data.categories;
  //   });

  //   return { categories };
  // }
  // apollo: {
  //   categories: {
  //     query: categories
  //   }
  // }
};
</script>
