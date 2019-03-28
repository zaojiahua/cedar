import Vue from 'vue'
import Router from 'vue-router'
import Login from "./views/Login"
import Home from "./views/Home"
import Page404 from "./errorpage/404"
import axios from "axios"
import DeviceManagement from "./views/DeviceManagement";
import CreateTboard from "./views/CreateTboard";
import UserManagement from "./views/UserManagement";
import PersonalData from "./views/PersonalData";


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
                    path: "device-management",
                    name: 'device-management',
                    component: DeviceManagement
                },
                {
                    path: "create-tboard",
                    name: 'create-tboard',
                    component: CreateTboard
                },
                {
                    path: "user-management",
                    name: 'user-management',
                    component: UserManagement
                },
                {
                    path: "personal-data",
                    name: 'personal-data',
                    component: PersonalData
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
            name: '404',
            component: Page404
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

    // Has logged in.
    next()
})

export default router
