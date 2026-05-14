import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
  faCircleCheck, faTriangleExclamation, faEye, faEyeSlash, faArrowRightToBracket, faMicrochip, 
  faLightbulb, faLock, faWifi, faGear, faTableCellsLarge, faBuilding, faBell, faMagnifyingGlass, 
  faUser, faTemperatureHigh, faDroplet, faXmark, faBars, faLocationDot, faPlus,
  faSearch, faFilePdf, faChartLine, faClipboardList, faFilter, faEllipsisV,
  faExclamationCircle, faInfoCircle, faWind, faThermometerHalf, faTint, faBolt,
  faDotCircle, faChevronLeft, faChevronRight, faHeadset, faPhoneAlt,
  faHouse, faSignal, faChartColumn, faCreditCard, faAddressCard
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faCircleCheck, faTriangleExclamation, faEye, faEyeSlash, faArrowRightToBracket, faMicrochip, 
  faLightbulb, faLock, faWifi, faGear, faTableCellsLarge, faBuilding, faBell, faMagnifyingGlass, 
  faUser, faTemperatureHigh, faDroplet, faXmark, faBars, faLocationDot, faPlus,
  faSearch, faFilePdf, faChartLine, faClipboardList, faFilter, faEllipsisV,
  faExclamationCircle, faInfoCircle, faWind, faThermometerHalf, faTint, faBolt,
  faDotCircle, faChevronLeft, faChevronRight, faHeadset, faPhoneAlt,
  faHouse, faSignal, faChartColumn, faCreditCard, faAddressCard
)

import './style.css'

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(createPinia())
app.use(router)
app.mount('#app')