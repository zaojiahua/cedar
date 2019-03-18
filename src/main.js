import Vue from 'vue'
import App from './App.vue'
import router from './router'
import iView from 'iview'
import './theme/classic.less'
import axios from 'axios'
import {Service} from 'axios-middleware';
import ConsoleLogMiddleware from './middleware/ConsoleLogMiddleware'
import config from "./lib/config"
import AuthenticationMiddleware from "./middleware/AuthenticationMiddleware";


// Axios settings
axios.defaults.withCredentials = true
// axios.defaults.xsrfCookieName = "csrftoken"
// axios.defaults.xsrfHeaderName = "x-csrftoken"
axios.defaults.baseURL = "http://127.0.0.1:8000/"

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
Vue.use(iView)

//Load authentication from local
if(!'token' in sessionStorage){
    if('token' in localStorage){
        sessionStorage.setItem('token', localStorage.getItem('token'))
    } // if token is not in localStorage, implying user hasn't logged in or user don't want to keep login status
}


// Entry point
const main = new Vue({
    router,
    render: h => h(App),
})

main.$mount('#app')