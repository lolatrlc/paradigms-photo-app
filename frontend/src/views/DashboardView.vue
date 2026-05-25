<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "../services/api";

const metrics = ref({
  totalPhotos: 0,
  totalUsers: 0,
  freeUsers: 0,
  proUsers: 0,
  uploadsToday: 0,
});

const loading = ref(true);

const fetchMetrics = async () => {
  try {
    const res = await api.get("/metrics");

    metrics.value = res.data;
  } catch (err) {
    console.error(err);
    alert("Failed to load metrics");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchMetrics();
});
</script>

<template>
  <h1>Dashboard</h1>

  <p v-if="loading">Loading metrics...</p>

  <div v-else class="stats">

    <div class="card">
      <h2>Total Photos</h2>
      <p>{{ metrics.totalPhotos }}</p>
    </div>

    <div class="card">
      <h2>Total Users</h2>
      <p>{{ metrics.totalUsers }}</p>
    </div>

    <div class="card">
    <h2>FREE Users</h2>
    <p>{{ metrics.freeUsers }}</p>
    </div>

    <div class="card">
    <h2>PRO Users</h2>
    <p>{{ metrics.proUsers }}</p>
    </div>

    <div class="card">
    <h2>Uploads Today</h2>
    <p>{{ metrics.uploadsToday }}</p>
    </div>

  </div>
</template>

<style scoped>
.stats {
  display: flex;
  gap: 20px;
}

.card {
  border: 1px solid #ccc;
  padding: 20px;
  width: 200px;
  text-align: center;
}
</style>