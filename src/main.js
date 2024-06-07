import { createApp } from 'vue'
import App from './App.vue'

// Importing the Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

// import the fontawesome core 
import { library } from '@fortawesome/fontawesome-svg-core'

// import font awesome icon component 
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// import specific icons 
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

library.add(fas, far, fab)

createApp(App)
.component('font-awesome-icon', FontAwesomeIcon)
.mount('#app')
