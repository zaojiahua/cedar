import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap/dist/js/bootstrap.js'
import iView from 'iview'
import './theme/classic.less'

Vue.config.productionTip = false
Vue.use(iView)

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
