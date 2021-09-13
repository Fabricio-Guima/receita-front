<template>
  <v-container>
    <h2>Criar nova receita</h2>
    <v-divider class="my-5"> </v-divider>

    <app-forms-receita></app-forms-receita>
  </v-container>
</template>

<script>
export default {
  middleware: "auth"
};
</script>

<style></style>
