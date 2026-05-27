<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const logout = () => {
  localStorage.removeItem("token");
  router.push("/login");
};
</script>

<template>
  <div class="home">

    <section class="hero">
      <h1>Welcome to PhotoApp</h1>

      <p>
        Upload, manage and share your photos easily.
      </p>

      <div class="hero-actions">
        <button @click="router.push('/upload')">
          Upload Photo
        </button>

        <button class="secondary" @click="router.push('/gallery')">
          Open Gallery
        </button>
      </div>
    </section>

    <section class="features">

      <div class="feature-card">
        <h2>Upload Photos</h2>

        <p>
          Add your favorite pictures with titles,
          descriptions and hashtags.
        </p>
      </div>

      <div class="feature-card">
        <h2>Manage Gallery</h2>

        <p>
          Edit, delete and download your photos anytime.
        </p>
      </div>

      <div class="feature-card">
        <h2>Track Metrics</h2>

        <p>
          Monitor uploads and user activity from the dashboard.
        </p>
      </div>

    </section>

    <div class="logout-container">
      <button class="logout-btn" @click="logout">
        Logout
      </button>
    </div>

  </div>
</template>

<style scoped>

.home {
  display: flex;
  flex-direction: column;
  gap: 60px;
}

.hero {
  text-align: center;

  padding: 80px 20px;

  background:
    linear-gradient(to right, #f8f8f8, #ececec);

  border-radius: 24px;
}

.hero h1 {
  font-size: 52px;
  margin-bottom: 20px;
}

.hero p {
  font-size: 18px;
  color: #666;

  margin-bottom: 35px;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 20px;

  flex-wrap: wrap;
}

.hero-actions button {
  padding: 14px 28px;

  border: none;
  border-radius: 12px;

  font-size: 16px;
  font-weight: 600;

  cursor: pointer;

  transition: transform 0.2s ease;
}

.hero-actions button:hover {
  transform: translateY(-3px);
}

.hero-actions button:first-child {
  background: black;
  color: white;
}

.secondary {
  background: white;
  border: 1px solid #dcdcdc;
}

.features {
  display: grid;

  grid-template-columns:
    repeat(auto-fit, minmax(250px, 1fr));

  gap: 25px;
}

.feature-card {
  background: white;

  padding: 30px;

  border-radius: 20px;

  box-shadow:
    0 10px 30px rgba(0,0,0,0.08);

  transition: transform 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-card h2 {
  margin-bottom: 15px;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

.logout-container {
  display: flex;
  justify-content: center;
}

.logout-btn {
  padding: 12px 24px;

  border: none;
  border-radius: 10px;

  background: #ff4d4d;
  color: white;

  font-size: 15px;
  font-weight: 600;

  cursor: pointer;
}

</style>