import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import { vue3Debounce } from 'vue-debounce'
import DynamicFields from './components/form/DynamicFields.vue'
import Toaster from "@meforma/vue-toaster";
import axios from 'axios'
import VueAxios from 'vue-axios'
import i18n from './locales/i18n'

loadFonts()
createApp(App)
  .use(createPinia())
  .use(router)
  .component('dynamic-fields',DynamicFields)
  .use(vuetify)
  .use(VueAxios, axios)
  .use(i18n)
  .use(Toaster,{
    position: "bottom",
    duration: "3000",
  })
  .directive('debounce', vue3Debounce({ listenTo: ['update', 'keyup','change'] }))
  .mount('#app')
