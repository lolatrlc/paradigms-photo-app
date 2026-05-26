<script setup lang="ts">
import Navbar from "./components/Navbar.vue";
</script>

<template>
  <div class="layout">

    <Navbar />

    <main class="content">
      <router-view />
    </main>

  </div>
</template>

<style>

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: #f7f7f7;
  font-family: Arial, Helvetica, sans-serif;
}

.layout {
  min-height: 100vh;
}

.content {
  padding: 100px 40px 40px 40px;
  max-width: 1400px;
  margin: 0 auto;
}

</style>