import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/DocumentsTable.vue';
import Categories from '../components/CategoriesTable.vue';
import Menu from '../components/MenuTable.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/categories',
    name: 'Categories',
    component: Categories
  },
  {
    path: '/menu',
    name: 'Menu',
    component: Menu
  },
  // Catch-all route for undefined paths, redirecting to Home
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
