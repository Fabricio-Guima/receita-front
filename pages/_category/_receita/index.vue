<template>
  <v-container>
    {{ userFavorites }}
    {{ receitaLiked }}
    <h1>{{ receita.name }}</h1>
    <h5>{{ receita.category.name }}</h5>

    <v-card class="mt-3">
      <v-card-title>
        <v-icon>mdi-information</v-icon>
        Informações</v-card-title
      >
      <v-card-text class="black--text">
        <v-row>
          <v-col cols="6">
            <v-chip color="primary" outlined>
              <v-icon left>mdi-account-group</v-icon>
              Serviços: {{ receita.servings }}
            </v-chip>
            <v-chip color="primary" outlined>
              <v-icon left>mdi-clock</v-icon>
              Tempo: {{ formatedTime }}
            </v-chip>
            <v-chip color="primary" outlined>
              <v-icon left>mdi-account-edit</v-icon>
              Autor: {{ receita.autor.username }}
            </v-chip>
            <v-divider class="my-3"></v-divider>

            <h4 class="body-1">Descrição</h4>
            <div v-html="receita.description"></div>
          </v-col>
          <v-col cols="6">
            <v-img :src="receita.image" max-height="500"></v-img>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-btn icon v-if="$auth.loggedIn" large @click="toggleLiked">
          <v-icon :color="receitaLiked ? 'error' : 'grey'" large
            >mdi-heart</v-icon
          >
        </v-btn>
        <v-icon v-else class="mr-3">mdi-heart</v-icon>
        <span class="overline">{{ receita.likes }}</span>
      </v-card-actions>
    </v-card>

    <div class="mt-3">
      <v-row>
        <v-col cols="5">
          <v-card>
            <v-card-title>
              <v-icon class="mr-3">mdi-fridge</v-icon>Ingredientes
            </v-card-title>
            <v-list>
              <v-list-item
                v-for="(ingredient, index) in receita.ingredients"
                :key="index"
                >{{ ingredient }}</v-list-item
              >
            </v-list>
          </v-card>
        </v-col>

        <v-col cols="7">
          <v-card>
            <v-card-title>
              <v-icon class="mr-3">mdi-stove</v-icon>Etapas
            </v-card-title>
            <v-list>
              <v-timeline dense>
                <v-timeline-item
                  v-for="(step, index) in receita.steps"
                  :key="index"
                  color="secondary"
                  small
                  >{{ step }}
                </v-timeline-item>
              </v-timeline>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <div class="mt-3">
      <app-ui-back-btn> </app-ui-back-btn>
    </div>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      likedReceita: false
    };
  },
  async asyncData({ app, route }) {
    const client = app.apolloProvider.defaultClient;
    const id = route.params.receita;

    const query = {
      query: require("../../../graphql/receita.gql"),
      variables: { id: id }
    };
    let receita = {};
    await client
      .query(query)
      .then(response => {
        receita = response.data.receita;
      })
      .catch(e => {
        console.log(e);
      });

    return { receita };
  },
  computed: {
    formatedTime() {
      let hours = Math.floor(this.receita.duration / 60);
      let minutes = this.receita.duration % 60;
      let total = ("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2);

      return total;
    },
    userFavorites() {
      return this.$store.getters["user/favorites"];
    },
    receitaLiked() {
      let liked = false;

      if (this.userFavorites) {
        const id = this.receita.id;
        liked = this.userFavorites.some(item => item.id === id);
      }

      this.likedReceita = liked;
      return liked;
    }
  },
  methods: {
    toggleLiked() {
      this.likedReceita = !this.likedReceita;
      if (this.likedReceita) {
        this.likeReceita();
      } else {
        this.unlikeReceita();
      }
    },
    likeReceita() {
      this.$store.commit("user/addReceita", this.receita);
      let userFav = this.$store.getters["user/favoritesGQL"];
      const variables = {
        id: this.receita.id,
        idUser: this.$auth.user.id,
        favorites: userFav
      };
      this.$apollo
        .query({
          query: require("../../../graphql/getLikes.gql"),
          variables: { id: this.receita.id }
        })
        .then(response => {
          let likes = response.data.receita.likes + 1;
          this.receita.likes = likes;
          variables.likes = likes;
          this.$apollo.mutate({
            context: {
              headers: {
                authorization: this.$auth.strategy.token.get()
              }
            },
            mutation: require("../../../graphql/updateLikes.gql"),
            variables: variables
          });
        });
    },
    unlikeReceita() {
      this.$store.commit("user/removeReceita", this.receita.id);

      let userFav = this.$store.getters["user/favoritesGQL"];
      const variables = {
        id: this.receita.id,
        idUser: this.$auth.user.id,
        favorites: userFav
      };
      this.$apollo
        .query({
          query: require("../../../graphql/getLikes.gql"),
          variables: { id: this.receita.id }
        })
        .then(response => {
          let likes = response.data.receita.likes - 1;
          this.receita.likes = likes;
          variables.likes = likes;
          this.$apollo.mutate({
            context: {
              headers: {
                authorization: this.$auth.strategy.token.get()
              }
            },
            mutation: require("../../../graphql/updateLikes.gql"),
            variables: variables
          });
        });
    }
  },
  async mounted() {
    if (this.$auth.loggedIn && this.$store.getters["user/favorites"] == null) {
      console.log("call favorites");
      await this.$store.dispatch("user/getFavorites");
    }
  }
};
</script>

<style></style>
