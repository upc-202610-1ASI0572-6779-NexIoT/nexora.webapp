import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { createI18n } from './shared/presentation/i18n'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
  faCircleCheck, faTriangleExclamation, faEye, faEyeSlash, faArrowRightToBracket, faMicrochip, 
  faLightbulb, faLock, faWifi, faGear, faTableCellsLarge, faBuilding, faBell, faMagnifyingGlass, 
  faUser, faTemperatureHigh, faDroplet, faXmark, faBars, faLocationDot, faPlus,
  faSearch, faFilePdf, faChartLine, faClipboardList, faFilter, faEllipsisV,
  faExclamationCircle, faInfoCircle, faWind, faThermometerHalf, faTint, faBolt,
  faDotCircle, faChevronLeft, faChevronRight, faHeadset, faPhoneAlt,
  faHouse, faSignal, faChartColumn, faCreditCard, faAddressCard, faDownload,
  faArrowUp, faSliders, faMapPin, faNetworkWired, faTrash, faQrcode, faCircleQuestion, faShield,
  faUsers, faHeartPulse, faArrowTrendUp, faPenToSquare, faArrowUpRightFromSquare, faCheck,
  faArrowLeft, faArrowRight, faRightFromBracket, faSpinner
} from '@fortawesome/free-solid-svg-icons'

import { faCcVisa, faCcMastercard, faCcAmex } from '@fortawesome/free-brands-svg-icons'

library.add(
  faCircleCheck, faTriangleExclamation, faEye, faEyeSlash, faArrowRightToBracket, faMicrochip, 
  faLightbulb, faLock, faWifi, faGear, faTableCellsLarge, faBuilding, faBell, faMagnifyingGlass, 
  faUser, faTemperatureHigh, faDroplet, faXmark, faBars, faLocationDot, faPlus,
  faSearch, faFilePdf, faChartLine, faClipboardList, faFilter, faEllipsisV,
  faExclamationCircle, faInfoCircle, faWind, faThermometerHalf, faTint, faBolt,
  faDotCircle, faChevronLeft, faChevronRight, faHeadset, faPhoneAlt,
  faHouse, faSignal, faChartColumn, faCreditCard, faAddressCard, faDownload,
  faArrowUp, faSliders, faMapPin, faNetworkWired, faTrash, faQrcode, faCircleQuestion, faShield,
  faUsers, faHeartPulse, faArrowTrendUp, faPenToSquare, faArrowUpRightFromSquare, faCheck,
  faArrowLeft, faArrowRight, faRightFromBracket,
  faCcVisa, faCcMastercard, faCcAmex, faSpinner
)

import './style.css'

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(createPinia())
app.use(createI18n())
app.use(router)
app.mount('#app')
