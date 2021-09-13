export const strict = false;

export const state = () => ({
  counter: 0,
  categories: [],
  loadedReceitas: []
});

export const getters = {
  readCategories(state) {
    return state.categories;
  },
  readCounter(state) {
    return state.counter;
  },
  readLoadedReceitas(state) {
    return state.loadedReceitas;
  }
};

export const mutations = {
  addCategories(state, payload) {
    state.categories = payload;
  },

  addLoadedReceitas(state, payload) {
    state.loadedReceitas = payload;
  },

  increment(state) {
    state.counter++;
  }
};

export const actions = {
  async nuxtServerInit({ commit }) {
    console.log("oi nuxt server");
    // return new Promise((resolve, reject) => {
    const client = this.app.apolloProvider.defaultClient;
    const query = {
      query: require("../graphql/categories.gql")
    };

    await client
      .query(query)
      .then(response => {
        commit("addCategories", response.data.categories);
        // commit("addLoadedReceitas", response.data.receitas);
        //   resolve();
      })
      .catch(error => {
        console.log(error);
        //   reject();
      });
    // });
  },
  searchReceitas({ commit }, payload) {
    console.log("findreceita: ", payload);
    const client = this.app.apolloProvider.defaultClient;
    const query = {
      query: require("../graphql/searchReceitas.gql"),
      variables: { terms: payload }
    };
    client
      .query(query)
      .then(response => {
        console.log(response);
        commit("addLoadedReceitas", response.data.receitas);
      })
      .catch(e => {
        console.log(e);
      });
  },
  increment(context) {
    context.commit("increment");
  }
};
