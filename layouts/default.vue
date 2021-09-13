<template>
  <v-app>
    <v-navigation-drawer
      app
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      color="grey lighten-4"
    >
      <v-list color="primary--text">
        <v-list-item to="/">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item>
            Início
          </v-list-item>
        </v-list-item>
        <v-list-item
          v-for="(link, index) in links"
          :key="index"
          :to="{ name: 'category', params: { category: link.slug } }"
        >
          <v-list-item-icon>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              {{ link.name }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item to="/user/favorites" v-if="$auth.loggedIn">
          <v-list-item-icon>
            <v-icon>mdi-heart</v-icon>
          </v-list-item-icon>
          <v-list-item>
            Favoritas
          </v-list-item>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      app
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      color="grey lighten-4 flat"
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu v-model="search" :close-on-content-click="false" offset-y>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" color="primary" icon>
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title>Buscar receita {{ findReceita }}</v-card-title>
          <v-card-text>
            <v-text-field
              outlined
              label="Nome da receita"
              dense
              v-model="findReceita"
              @input="searchReceitas()"
            ></v-text-field>
            <v-list v-if="findReceita.length != 0">
              <v-list-item
                v-for="(receita, index) in receitas"
                :key="index"
                @click="seeReceita(receita.category.slug, receita.id)"
              >
                {{ receita.name }}</v-list-item
              >
            </v-list>
          </v-card-text>
        </v-card>
      </v-menu>

      <div v-if="$auth.loggedIn">
        {{ $auth.user.username }}
        <v-btn text color="primary" @click="logout">Sair</v-btn>

        <v-menu v-model="loginMenu" :close-on-content-click="false" offset-y>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" icon>
              <v-avatar class="secondary">
                <span class="white--text headline">
                  {{ $auth.user.username[0] }}
                </span>
              </v-avatar>
            </v-btn>
          </template>
          <v-card>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ $auth.user.username }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ $auth.user.email }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn to="/user" small>Admin</v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
            <v-card-actions>
              <v-btn text color="primary" @click="loginMenu = false" small
                >Fechar</v-btn
              >
              <v-btn color="primary" @click="logout" small>Sair</v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </div>
      <div v-else>
        <v-btn
          text
          color="primary"
          @click="
            dialog = true;
            type = 'app-forms-login';
          "
          >Login</v-btn
        >
        <v-btn
          text
          color="primary"
          @click="
            dialog = true;
            type = 'app-forms-register';
          "
          >Cadastro</v-btn
        >
      </div>
    </v-app-bar>
    <v-main class="grey lighten-4">
      <nuxt />

      <v-snackbar
        v-for="(snack, index) in snacks.filter(s => s.showing)"
        :key="index"
        v-model="snack.showing"
        :color="snack.color"
        :timeout="snack.timeout"
        :style="`bottom:${index * 60 + 8}px`"
        right
        >{{ snack.text }}
        <v-btn slot="action" small icon @click="snack.showing = false">
          <v-icon small>mdi-close</v-icon>
        </v-btn></v-snackbar
      >
    </v-main>

    <v-dialog v-model="dialog" max-width="600">
      <component :is="type" @close="dialog = $event"></component>
    </v-dialog>
    <v-footer paddless
      ><v-row justify="center" no-gutters>
        <v-btn color="primary" small icon><v-icon>mdi-facebook</v-icon></v-btn>
        <v-btn color="primary" small icon><v-icon>mdi-instagram</v-icon></v-btn>
        <v-btn color="primary" small icon><v-icon>mdi-twitter</v-icon></v-btn>

        <v-col class="text-center primary--text" cols="12">
          &copy; {{ new Date().getFullYear() }} - Vovó</v-col
        >
      </v-row></v-footer
    >
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "default",
  data() {
    return {
      drawer: false,
      title: "Receitas da Vovó",
      search: "",
      findReceita: "",
      dialog: false,
      type: "app-form-login",
      snack: false,
      loginMenu: false
    };
  },
  computed: {
    ...mapGetters({
      link: "readCategories",
      receitas: "readLoadedReceitas",
      snacks: "snackbar/readSnacksbars"
    }),
    links() {
      return this.$store.getters.readCategories;
    },
    filteredReceitas() {
      return this.receitas.filter(item => {
        return item.name.toLowerCase().match(this.findReceita.toLowerCase());
      });
    }
  },
  methods: {
    seeReceita(category, receita) {
      this.$router.push({
        name: "category-receita",
        params: { category, receita }
      });
      this.search = false;
      this.findReceita = "";
    },
    searchReceitas() {
      this.$store.dispatch("searchReceitas", this.findReceita);
    },
    logout() {
      this.$auth.logout();
      this.loginMenu = false;
      this.$store.commit("user/resetFav");
    }
  }
};
</script>
