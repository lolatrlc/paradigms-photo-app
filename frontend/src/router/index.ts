import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import GalleryView from "../views/GalleryView.vue";
import PublicGalleryView from "../views/PublicGalleryView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: HomeView },
    { path: "/login", component: LoginView },
    { path: "/upload", component: UploadView },
    { path: "/gallery", component: GalleryView },
    { path: "/public", component: PublicGalleryView },
  ]
})

import UploadView from "../views/UploadView.vue";



export default router