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
  <div class="login-page">

    <div class="login-card">

      <h1>Login</h1>

      <input
        v-model="email"
        placeholder="Email"
      />

      <input
        v-model="password"
        type="password"
        placeholder="Password"
      />

      <button @click="handleLogin">
        Login
      </button>

    </div>

  </div>
</template>

<style scoped>

.login-page {
  min-height: 80vh;

  display: flex;
  justify-content: center;
  align-items: center;
}

.login-card {
  width: 400px;

  display: flex;
  flex-direction: column;
  gap: 20px;

  padding: 40px;

  background: white;

  border-radius: 20px;

  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
}

h1 {
  text-align: center;
}

input {
  padding: 14px;

  border-radius: 10px;
  border: 1px solid #ddd;

  font-size: 15px;
}

button {
  padding: 14px;

  border: none;
  border-radius: 10px;

  background: black;
  color: white;

  cursor: pointer;

  font-size: 15px;
}

button:hover {
  opacity: 0.9;
}

</style>