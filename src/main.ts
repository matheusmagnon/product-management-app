import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
import Aura from '@primevue/themes/aura'

import App from './App.vue'
import './assets/css/variables.css'
import router from './router'

import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import { VueQueryPlugin } from '@tanstack/vue-query'
import Tooltip from 'primevue/tooltip'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Toast from 'primevue/toast'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Tag from 'primevue/tag'
import ProgressSpinner from 'primevue/progressspinner'
import Card from 'primevue/card'
import ContextMenu from 'primevue/contextmenu'
import Dropdown from 'primevue/dropdown'

const app = createApp(App)

// Configurar tema Aura no modo claro
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: false, // 🔆 força o modo claro
      cssLayer: {
        name: 'primevue',
        order: 'primevue, theme',
      },
      // Aqui você pode customizar variáveis do tema:
      // https://www.primefaces.org/primevue/theming/#aura
      variables: {
        // TabView highlight claro
        'highlight-background': '#ffffff',
        'highlight-text-color': '#3b82f6',
        'primary-color': '#3b82f6',
        'primary-color-text': '#ffffff',
      },
    },
  },
})

app.use(createPinia())
app.use(router)
app.use(ConfirmationService)
app.use(ToastService)
app.use(VueQueryPlugin)
app.directive('tooltip', Tooltip)

// Componentes globais
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('Button', Button)
app.component('Dialog', Dialog)
app.component('InputText', InputText)
app.component('Textarea', Textarea)
app.component('Toast', Toast)
app.component('TabView', TabView)
app.component('TabPanel', TabPanel)
app.component('Tag', Tag)
app.component('ProgressSpinner', ProgressSpinner)
app.component('Card', Card)
app.component('ContextMenu', ContextMenu)
app.component('Dropdown', Dropdown)

app.mount('#app')
