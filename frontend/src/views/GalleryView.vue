<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "../services/api";

type Photo = {
  id: number;
  title: string;
  url: string;
  description?: string;
  hashtags: string[];
};

const photos = ref<Photo[]>([]);
const loading = ref(true);
const searchAuthor = ref("");
const searchHashtag = ref("");
const editingPhotoId = ref<number | null>(null);

const editTitle = ref("");
const editDescription = ref("");
const editHashtags = ref("");
const startEdit = (photo: Photo) => {
  editingPhotoId.value = photo.id;

  editTitle.value = photo.title;
  editDescription.value = photo.description || "";
  editHashtags.value = photo.hashtags.join(",");
};

const fetchPhotos = async () => {
  try {
    const res = await api.get("/photos", {
    params: {
      author: searchAuthor.value || undefined,
      hashtag: searchHashtag.value || undefined,
    },
  });
    photos.value = res.data;
  } catch (err) {
    console.error(err);
    alert("Failed to load photos");
  } finally {
    loading.value = false;
  }
};

const deletePhoto = async (id: number) => {
  try {
    await api.delete(`/photos/${id}`);

    // mettre à jour UI sans recharger page
    photos.value = photos.value.filter((p) => p.id !== id);
  } catch (err) {
    console.error(err);
    alert("Delete failed");
  }
};

const saveEdit = async (id: number) => {
  try {
    const res = await api.patch(`/photos/${id}`, {
      title: editTitle.value,
      description: editDescription.value,
      hashtags: editHashtags.value,
    });

    // mise à jour UI locale
    const index = photos.value.findIndex((p) => p.id === id);

    if (index !== -1) {
      photos.value[index] = res.data;
    }

    editingPhotoId.value = null;

  } catch (err) {
    console.error(err);
    alert("Update failed");
  }
};

onMounted(() => {
  fetchPhotos();
});



</script>

<template>
  <h1>My Photos</h1>

  <p v-if="loading">Loading...</p>

  <div class="search-bar">
    <input
      v-model="searchAuthor"
      placeholder="Search by author"
    />

    <input
      v-model="searchHashtag"
      placeholder="Search by hashtag"
    />

    <button @click="fetchPhotos">
      Search
    </button>
  </div>

  <div class="grid">
    <div v-for="photo in photos" :key="photo.id" class="card">

      <img :src="'http://localhost:3000/' + photo.url" />

      <div v-if="editingPhotoId === photo.id">

        <input v-model="editTitle" />
        <br /><br />

        <input v-model="editDescription" />
        <br /><br />

        <input v-model="editHashtags" />
        <br /><br />

        <button @click="saveEdit(photo.id)">
          Save
        </button>

      </div>

      <div v-else>

        <h3>{{ photo.title }}</h3>
        <p>{{ photo.description }}</p>

      </div>

      <button @click="startEdit(photo)">
        Edit
      </button>

      <button @click="deletePhoto(photo.id)">
        Delete
      </button>

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

.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
</style>