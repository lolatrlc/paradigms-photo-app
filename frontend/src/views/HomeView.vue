<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    router.push("/login");
  }
});

const logout = () => {
  localStorage.removeItem("token");
  router.push("/login");
};

const goToUpload = () => {
  router.push("/upload");
};

</script>

<template>
  <h1>Home</h1>
  <p>Welcome</p>

  <button @click="goToUpload">Upload Photo</button>

  <button @click="router.push('/gallery')">My Photos</button>

  <button @click="logout">Logout</button>


</template>