<script setup
        lang="ts">
import DocumentsTable from './components/DocumentsTable.vue';
import CategoriesTable from './components/CategoriesTable.vue';
import MenuTable from './components/MenuTable.vue';

let view = new URLSearchParams(window.location.search).get('view');
let currentComponent = DocumentsTable
if (view === 'categories') {
  currentComponent = CategoriesTable
} else if(view=='menu'){
  currentComponent=MenuTable
} 
else {
  currentComponent = DocumentsTable
}
</script>
<template>
  <div id="app">
    <main class="container mx-auto">
      <component :is="currentComponent"/>
    </main>
  </div>
</template>
<style>
</style>
