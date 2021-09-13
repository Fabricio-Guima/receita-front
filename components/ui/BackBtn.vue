<template>
  <div>
    <v-btn small color="primary" @click="back">{{ label }}</v-btn>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: "Voltar"
    }
  },

  methods: {
    back() {
      this.$router.go(-1);
    }
  }
};
</script>

<style></style>
