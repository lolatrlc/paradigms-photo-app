<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "../services/api";

const metrics = ref({
  totalPhotos: 0,
  totalUsers: 0,
  freeUsers: 0,
  proUsers: 0,
  uploadsToday: 0,
  mostUsedHashtag: "",
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
  <div class="dashboard">

    <h1>Dashboard</h1>

    <p v-if="loading">
      Loading metrics...
    </p>

    <div v-else class="stats-grid">

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

      <div class="card">
        <h2>Top Hashtag</h2>
        <p>
          #{{ metrics.mostUsedHashtag }}
        </p>
      </div>

    </div>

  </div>
</template>

<style scoped>
.dashboard h1 {
  margin-bottom: 30px;
}

.stats-grid {
  display: grid;

  grid-template-columns:
    repeat(auto-fit, minmax(220px, 1fr));

  gap: 25px;
}

.card {
  background: white;

  padding: 30px;

  border-radius: 20px;

  box-shadow:
    0 10px 30px rgba(0,0,0,0.08);

  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.card h2 {
  font-size: 18px;
  margin-bottom: 15px;
  color: #555;
}

.card p {
  font-size: 32px;
  font-weight: bold;
}
</style>