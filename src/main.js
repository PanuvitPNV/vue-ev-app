import { createApp } from 'vue'
import App from './App.vue'

// Importing the Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

// import font awesome icon component 
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// import the fontawesome core 
import { library } from '@fortawesome/fontawesome-svg-core'

// import specific icons 
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import VueCookies from 'vue-cookies'

library.add(fas, far, fab)

createApp(App)
.use(VueCookies, { expireTimes: '30d' })
.component('font-awesome-icon', FontAwesomeIcon)
.mount('#app')
