<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "../services/api";

type Photo = {
  id: number;
  title: string;
  url: string;
  description?: string;
  hashtags: string[];
  author?: {
    email: string;
  };
};

const photos = ref<Photo[]>([]);
const loading = ref(true);

const fetchPhotos = async () => {
  try {
    const res = await api.get("/photos/public");
    photos.value = res.data;
  } catch (err) {
    console.error(err);
    alert("Failed to load public photos");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchPhotos();
});
</script>

<template>
  <h1>Public Gallery</h1>

  <p v-if="loading">Loading...</p>

  <div v-else class="grid">
    <div v-for="photo in photos" :key="photo.id" class="card">
      <img :src="'http://localhost:3000/' + photo.url" />

      <h3>{{ photo.title }}</h3>

      <p>{{ photo.description }}</p>

      <p>
        Author:
        {{ photo.author?.email }}
      </p>

      <p>
        Hashtags:
        {{ photo.hashtags.join(", ") }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.card {
  border: 1px solid #ccc;
  padding: 10px;
}

img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
</style>