import Vue from 'vue'
import Router from 'vue-router'
import Login from "./views/Login"
import Home from "./views/Home"
import Page1 from "./views/Page1"
import Page2 from "./views/Page2"
import Page3 from "./views/Page3"
import axios from "axios"

Vue.use(Router)

let router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
            children: [
                {
                    path: '/page1',
                    name: 'page1',
                    component: Page1
                },
                {
                    path: '/page2',
                    name: 'page2',
                    component: Page2
                },
                {
                    path: '/page3',
                    name: 'page3',
                    component: Page3
                }
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        }
    ]
})

router.beforeEach((to, from, next) => {
    if(to.name === 'login'){
        next()
        return
    }
    if('token' in sessionStorage && 'permissions' in sessionStorage){
        next()
    }
    else {
        axios
            .get("api/v1/permissions/")
            .then(response=>{
                sessionStorage.permissions = response.data
                next()
            })
            .catch(reason=>{
                next({name: "login"})
            })
    }
})
export default router
