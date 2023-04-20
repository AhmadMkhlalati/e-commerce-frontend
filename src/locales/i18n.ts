import { createI18n } from 'vue-i18n'
import en from './en'
import ar from './ar'


const i18n = createI18n({
    locale:'en',
    messages: {
      en,
      ar
    }
  });

  export default i18n;