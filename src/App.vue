<script setup>
import { RouterLink, RouterView, useRoute } from "vue-router";
import Header from "@/components/Header.vue";
import { onMounted } from "vue";
import { useUserStore } from "./stores/userStore";

const userStore = useUserStore();
const route = useRoute();

onMounted(() => {
  let storedId = localStorage.getItem("userId");
  if (storedId) {
    userStore.fetchUser(storedId).catch(() => {
      userStore.logout();
    });
  }
});
</script>

<template>
  <Header v-if="route.path !== '/' && route.path !== '/signup'" />
  <RouterView />
</template>

<style lang="scss">
@use "@/assets/main.scss";
</style>
