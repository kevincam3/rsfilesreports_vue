import { createApp } from 'vue';
import App from './App.vue';

// Import PrimeVue
import PrimeVue from 'primevue/config';
import Lara from 'primevue/themes/lara';

// Import tailwindcss
import './assets/tailwind.css';

const app = createApp(App);

app.use(PrimeVue, {
  theme: {
    preset: Lara,
    options: {
      cssLayer: {
        name: 'primevue',
        order: 'tailwind-base, primevue, tailwind-utilities',
      },
      darkModeSelector: '.light-mode',
    },
  },
});

app.mount('#app');
