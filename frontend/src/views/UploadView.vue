<script setup lang="ts">
import { ref } from "vue";
import api from "../services/api";

const file = ref<File | null>(null);
const title = ref("");
const description = ref("");
const hashtags = ref("");

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;

  const fileList = target.files;
  if (!fileList || fileList.length === 0) return;

  file.value = fileList.item(0)!;
};

const handleUpload = async () => {
  if (!file.value) {
    alert("Please select a file");
    return;
  }

  try {
    const formData = new FormData();

    formData.append("file", file.value);
    formData.append("title", title.value);
    formData.append("description", description.value);
    formData.append("hashtags", hashtags.value);

    const res = await api.post("/photos/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("UPLOAD SUCCESS:", res.data);
    alert("Photo uploaded !");
  } catch (err) {
    console.error(err);
    alert("Upload failed");
  }
};
</script>

<template>
  <div class="upload-page">

    <div class="upload-card">

      <h1>Upload Photo</h1>

      <input
        type="file"
        @change="handleFileChange"
      />

      <input
        v-model="title"
        placeholder="Title"
      />

      <input
        v-model="description"
        placeholder="Description"
      />

      <input
        v-model="hashtags"
        placeholder="hashtags (comma separated)"
      />

      <button @click="handleUpload">
        Upload
      </button>

    </div>

  </div>
</template>

<style scoped>

.upload-page {
  display: flex;
  justify-content: center;
  align-items: center;

  min-height: 80vh;
}

.upload-card {
  width: 100%;
  max-width: 500px;

  display: flex;
  flex-direction: column;
  gap: 18px;

  padding: 40px;

  background: white;

  border-radius: 20px;

  box-shadow:
    0 10px 30px rgba(0,0,0,0.08);
}

h1 {
  text-align: center;
  margin-bottom: 10px;
}

input {
  padding: 14px;

  border-radius: 10px;
  border: 1px solid #ddd;

  font-size: 14px;
}

button {
  padding: 14px;

  border: none;
  border-radius: 10px;

  background: black;
  color: white;

  font-size: 15px;
  font-weight: 600;

  cursor: pointer;

  transition: opacity 0.2s ease;
}

button:hover {
  opacity: 0.8;
}

</style>