<script setup lang="ts">
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

const logout = () => {
  auth.logout();
  router.push("/login");
};
</script>

<template>
  <nav class="navbar">

    <div class="logo">
      PhotoApp
    </div>

    <div class="links">

      <router-link to="/">
        Home
      </router-link>

      <router-link to="/gallery">
        Gallery
      </router-link>

      <router-link to="/upload">
        Upload
      </router-link>

      <router-link to="/dashboard">
        Dashboard
      </router-link>

      <router-link to="/register">
        Register
      </router-link>

      <button @click="logout">
        Logout
      </button>

    </div>
  </nav>
</template>

<style scoped>

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 18px 40px;

  background: white;
  border-bottom: 1px solid #e5e5e5;

  z-index: 1000;
}

.logo {
  font-size: 22px;
  font-weight: bold;
}

.links {
  display: flex;
  align-items: center;
  gap: 20px;
}

a {
  text-decoration: none;
  color: black;
  font-weight: 500;

  transition: opacity 0.2s ease;
}

a:hover {
  opacity: 0.6;
}

.router-link-active {
  font-weight: bold;
}

button {
  padding: 10px 15px;

  border: none;
  border-radius: 8px;

  cursor: pointer;

  background: #ff4d4d;
  color: white;
}

</style>