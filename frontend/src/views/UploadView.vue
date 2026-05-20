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
  <h1>Upload Photo</h1>

  <input type="file" @change="handleFileChange" />
  <br /><br />

  <input v-model="title" placeholder="Title" />
  <br /><br />

  <input v-model="description" placeholder="Description" />
  <br /><br />

  <input v-model="hashtags" placeholder="hashtags (comma separated)" />
  <br /><br />

  <button @click="handleUpload">Upload</button>
</template>