import Vue from 'vue'
import Router from 'vue-router'
import Login from "./views/Login"
import Home from "./views/Home"
import Page1 from "./views/Page1"
import Page2 from "./views/Page2"
import Page3 from "./views/Page3"
import axios from "axios"
import DeviceManagement from "./views/DeviceManagement";


Vue.use(Router)

let router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/home',
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
                },
                {
                    path: "device-management",
                    name: 'device-management',
                    component: DeviceManagement
                }
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '*',
            redirect: {name: 'home'}
        }
    ]
})

// 免验证页面
let whiteList = [
    'login'
]

router.beforeEach((to, from, next) => {
    // 免验证页面，不检查
    if(whiteList.includes(to.name)){
        next()
        return
    }

    // Not logged in, redirect to login page
    if(sessionStorage.token === undefined){
        next({name: "login"})
        return
    }

    // Has logged in, but don't update permissions list yet.
    if(sessionStorage.permissions === undefined){
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

    // Has logged in, and has permissions list.
    next()
})

export default router
