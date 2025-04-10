<script setup>
import { RouterLink, RouterView } from "vue-router";
import Header from "@/components/Header.vue";
import { onMounted, reactive } from "vue";
import { useUserStore } from "./stores/userStore";

const userStore = useUserStore();
onMounted(() => {
  let storedId = localStorage.getItem("userId");
  if (storedId) {
    userStore.fetchUser(storedId).catch((error) => {
      userStore.logout();
    });
  } else {
    return;
  }
});
</script>

<template>
  <Header></Header>
  <RouterView />
</template>

<style lang="scss">
@use "@/assets/main.scss";
</style>
