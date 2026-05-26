<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "../services/api";

type Photo = {
  id: number;
  title: string;
  url: string;
  description?: string;
  hashtags: string[];
  createdAt: string;

  author: {
    email: string;
  };
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

        <div class="card-content">
          <h3>{{ photo.title }}</h3>

          <p class="description">
            {{ photo.description }}
          </p>

          <div class="hashtags">
            <span
              v-for="tag in photo.hashtags"
              :key="tag"
              class="tag"
            >
              #{{ tag }}
            </span>
          </div>

          <div class="meta">
            By {{ photo.author.email }}
          </div>

        <p>
          <strong>Author:</strong>
          {{ photo.author.email }}
        </p>

        <p>
          <strong>Uploaded:</strong>
          {{ new Date(photo.createdAt).toLocaleString() }}
        </p>

        <p>
          <strong>Hashtags:</strong>
          {{ photo.hashtags.join(", ") }}
        </p>

      </div>

      <div class="actions">

      <button class="edit-btn" @click="startEdit(photo)">
        Edit
      </button>

      <button class="delete-btn" @click="deletePhoto(photo.id)">
        Delete
      </button>

      </div>

      </div>

    </div>
  </div>
</template>

<style scoped>

h1 {
  margin-bottom: 20px;
}

.search-bar {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  align-items: center;
  flex-wrap: wrap;
}

.search-bar input {
  width: 250px;

  padding: 12px;
  border-radius: 10px;
  border: 1px solid #dcdcdc;

  font-size: 14px;
}

.search-bar button {
  height: 44px;
}
.search-bar button {
  padding: 10px 15px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: black;
  color: white;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
}

.card {
  border: 1px solid #e5e5e5;
  border-radius: 16px;
  overflow: hidden;
  background: white;
  box-shadow: 0 5px 15px rgba(0,0,0,0.08);

  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-5px);
}

img {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.card-content {
  padding: 15px;
}

h3 {
  margin-bottom: 10px;
}

.description {
  color: #666;
  margin-bottom: 10px;
}

.hashtags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
}

.tag {
  background: #f2f2f2;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.meta {
  font-size: 13px;
  color: #888;
  margin-bottom: 15px;
}

.actions {
  display: flex;
  gap: 10px;
}

.actions button {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.edit-btn {
  background: #ececec;
}

.delete-btn {
  background: #ff4d4d;
  color: white;
}

</style>