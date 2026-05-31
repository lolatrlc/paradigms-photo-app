<script setup lang="ts">
import { ref } from "vue";
import { register } from "../services/api";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");

const role = ref("USER");
const packageType = ref("FREE");

const router = useRouter();

const handleRegister = async () => {
  try {
    await register(
      email.value,
      password.value,
      role.value,
      packageType.value
    );

    alert("Account created successfully");

    router.push("/login");

  } catch (err) {
    alert(
      err instanceof Error
        ? err.message
        : "Registration failed"
    );
  }
};
</script>

<template>
  <div class="register-page">

    <div class="register-card">

      <h1>Register</h1>

      <input
        v-model="email"
        placeholder="Email"
      />

      <input
        v-model="password"
        type="password"
        placeholder="Password"
      />

      <select v-model="packageType">
        <option value="FREE">FREE</option>
        <option value="PRO">PRO</option>
      </select>

      <button @click="handleRegister">
        Create account
      </button>

    </div>

  </div>
</template>

<style scoped>

.register-page {
  min-height: 80vh;

  display: flex;
  justify-content: center;
  align-items: center;
}

.register-card {
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

input,
select {
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