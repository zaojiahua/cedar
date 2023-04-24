import Vue from 'vue'
import App from './App.vue'
import router from './router'
import iView from 'view-design'
import './theme/classic.less'
import axios from 'axios'
import lodash from 'lodash'
import {Service} from 'axios-middleware';
import ConsoleLogMiddleware from './middleware/ConsoleLogMiddleware'
import config from "./lib/config"
import AuthenticationMiddleware from "./middleware/AuthenticationMiddleware";
import utils from "./lib/utils";
import i18n  from "./locale";

utils._initDate();

// Axios settings
axios.defaults.baseURL = "http://"+config.REEF_HOST+":"+config.REEF_PORT

// Axios middleware settings
let service = new Service(axios)
let debugMiddleware = [
    new ConsoleLogMiddleware()
]

let middleware = [
    new AuthenticationMiddleware()
]

if(config.DEBUG) {
    service.register(debugMiddleware)
}

service.register(middleware)

// Vue settings
Vue.config.debug = true
Vue.prototype.$ajax = axios
let _ = lodash
Vue.use(iView)
Vue.use(i18n)

//Load authentication from local
if(sessionStorage.token === undefined
    && localStorage.token !== undefined){
        sessionStorage.setItem('token', localStorage.getItem('token'))
        sessionStorage.setItem('id', localStorage.getItem('id'))
        sessionStorage.setItem('username', localStorage.getItem('username'))
}


// Entry point
let main = new Vue({
    router,
    i18n,  //挂载i18n
    render: h => h(App),
})

main.$mount('#app')

// Mount main vue instance on windows for debug
if(config.DEBUG){
    window.main = main
}

// Load default config
if(localStorage.firstUse === undefined){
    localStorage.setItem("firstUse", "no")
    localStorage.setItem("device-management:DEFAULT_DEVICE_COLUMN",
        "device_label,device_name,phone_model,status")
    localStorage.setItem("subsidiary-device-list:DEFAULT_DEVICE_COLUMN",
        "serial_number,custom_name,phone_model,status")
}

export default main
