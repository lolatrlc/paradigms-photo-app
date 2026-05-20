<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const logout = () => {
  localStorage.removeItem("token");
  router.push("/login");
};
</script>

<template>
  <nav class="navbar">
    <router-link to="/">Gallery</router-link>
    <router-link to="/upload">Upload</router-link>
    <router-link to="/login">Login</router-link>

    <button @click="logout">
      Logout
    </button>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  gap: 10px;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}
</style>