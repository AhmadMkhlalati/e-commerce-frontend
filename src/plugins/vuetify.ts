// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Vuetify
import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
// const myCustomLightTheme = {
//   dark: false,
// }

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#938989',
          secondary: '#938989',
        },
      },
   
 
    },
    variations: {
      colors: ['primary', 'secondary'],
      lighten: 1,
      darken: 2,
    },
  
  }
})
