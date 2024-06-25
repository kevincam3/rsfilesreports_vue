<template>
    <div>
      <header class="bg-gray-800 text-white">
        <div class="container mx-auto flex justify-between items-center p-4">
          <div class="text-lg font-bold">
            <router-link to="/" class="hover:text-gray-400">RSFiles Reports</router-link>
          </div>
          <nav class="hidden md:flex space-x-6">
            <router-link to="/" class="hover:text-gray-400">Documents</router-link>
            <router-link to="/categories" class="hover:text-gray-400">Categories</router-link>
            
          </nav>
          <div class="md:hidden">
            <button @click="toggleMenu" class="focus:outline-none">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
        <div v-if="isMenuOpen" class="md:hidden bg-gray-700">
          <nav class="flex flex-col space-y-2 p-4">
            <router-link to="/" class="hover:text-gray-400" @click="toggleMenu">Home</router-link>
            <router-link to="/categories" class="hover:text-gray-400" @click="toggleMenu">Categories</router-link>
            
          </nav>
        </div>
      </header>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const isMenuOpen = ref(false);
  
  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
  };
  </script>
  
  <style scoped>
    .container {
      max-width: 1200px;
    }
  </style>
  