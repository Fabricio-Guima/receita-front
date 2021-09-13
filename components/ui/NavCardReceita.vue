<template>
  <div>
    <v-card
      :to="{
        name: 'category-receita',
        params: { category: receita.category.slug, receita: receita.id }
      }"
    >
      <v-img :src="receita.image || ''" height="170"></v-img>

      <v-card-text>
        <v-row>
          <v-col cols="7">
            <h3>{{ receita.name }}</h3>
            {{ receita.autor.username }}
          </v-col>
          <v-col cols="5" class="d-flex justify-end">
            <div>
              <v-icon>
                mdi-heart
              </v-icon>
              <span>
                {{ receita.likes }}
              </span>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "NavCard",
  props: {
    receita: {
      type: Object,
      required: true
    }
  }
};
</script>

<style></style>
