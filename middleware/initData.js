export default function({ store }) {
  console.log("olá");
  if (store.state.categories.length == 0) {
    store.dispatch("nuxtServerInit");
  }
}
