export const state = () => ({
  favorites: null
});

export const getters = {
  favorites(state) {
    return state.favorites;
  },
  favoritesGQL(state) {
    let favorites = [];
    if (Array.isArray(state.favorites)) {
      favorites = state.favorites.map(item => item.id);
    }
    return favorites;
  }
};

export const mutations = {
  setFavorites(state, payload) {
    return (state.favorites = payload);
  },
  addReceita(state, payload) {
    state.favorites.push(payload);
  },
  removeReceita(state, id) {
    const myReceita = state.favorites.find(item => item.id == id);
    const index = state.favorites.indexOf(myReceita);
    state.favorites.splice(index, 1);
  },
  resetFav(state) {
    state.favorites = null;
  }
};

export const actions = {
  async getFavorites({ commit }) {
    let client = this.app.apolloProvider.defaultClient;
    let id = this.$auth.user.id;
    const query = {
      context: {
        headers: {
          authorization: this.$auth.strategy.token.get()
        }
      },
      query: require("../graphql/userFavorites.gql"),
      fetchPolicy: "no-cache",
      variables: { id: id }
    };

    await client
      .query(query)
      .then(response => {
        commit("setFavorites", response.data.user.favorites);
      })
      .catch(e => console.log(e));
  }
};
