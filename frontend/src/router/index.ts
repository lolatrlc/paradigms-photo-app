import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import GalleryView from "../views/GalleryView.vue";
import PublicGalleryView from "../views/PublicGalleryView.vue";
import DashboardView from "../views/DashboardView.vue";
import RegisterView from "../views/RegisterView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: HomeView },
    { path: "/login", component: LoginView },
    { path: "/upload", component: UploadView },
    { path: "/gallery", component: GalleryView },
    { path: "/public", component: PublicGalleryView },
    { path: "/dashboard", component: DashboardView,},
    { path: "/register", component: RegisterView },
  ]
})

import UploadView from "../views/UploadView.vue";



export default router