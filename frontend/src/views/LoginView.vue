<script setup lang="ts">
import { ref } from "vue";
import { login } from "../services/api";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";


const email = ref("");
const password = ref("");
const router = useRouter();
const auth = useAuthStore();


const handleLogin = async () => {
  try {
    
    const data = await login(email.value, password.value);
    auth.setToken(data.access_token);
    router.push("/");

  } catch (err) {
    alert(err instanceof Error ? err.message : "Login failed");
  }
};
</script>

<template>
  <h1>Login</h1>

  <input v-model="email" placeholder="Email" />
  <br />

  <input v-model="password" type="password" placeholder="Password" />
  <br />

  <button @click="handleLogin">Login</button>
</template>