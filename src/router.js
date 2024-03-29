import Vue from 'vue'
import Router from 'vue-router'
import Login from "./views/Login"
import Home from "./views/Home"
import Page404 from "./errorpage/404"
import DeviceManagement from "./views/DeviceManagement";
import CreateTboard from "./views/CreateTboard";
import UserManagement from "./views/UserManagement";
import PersonalData from "./views/PersonalData";
import TboardManagement from "./views/TboardManagement";
import JobManagement from "./views/JobManagement";
import LogFiles from "./views/LogFiles";
import RdsManagement from "./views/RdsManagement"
import SystemUpgrade from "./views/SystemUpgrade"
import Setting from "./views/Setting"
import CleanCenter from "./views/CleanCenter"
import AbnormalStatistics from "./views/AbnormalStatistics"
import PerfDataManagement from "./views/PerfDataManagement"
import RdsDictView from "./views/RdsDictView"
import TGuardManagement from "./views/TGuardManagement"
import TestSetManagement from "./views/TestSetManagement"


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
                },
                {
                    path: "tboard-management",
                    name: "tboard-management",
                    component: TboardManagement
                },
                {
                    path: "job-management",
                    name: "job-management",
                    component: JobManagement
                },
                {
                    path: "log-files",
                    name: "log-files",
                    component: LogFiles
                },
                {
                    path: "rds-management",
                    name: "rds-management",
                    component: RdsManagement
                },
                {
                    path: "system-upgrade",
                    name: "system-upgrade",
                    component: SystemUpgrade
                },
                {
                    path: "setting",
                    name: "setting",
                    component: Setting
                },
                {
                    path: "clean-center",
                    name: "clean-center",
                    component: CleanCenter
                },
                {
                    path: "abnormal-statistics",
                    name: "abnormal-statistics",
                    component: AbnormalStatistics
                },
                {
                    path: "perf-data-management",
                    name: "perf-data-management",
                    component: PerfDataManagement
                },
                {
                    path: "TGuard-management",
                    name: "TGuard-management",
                    component: TGuardManagement
                },
                {
                    path: "testSet-management",
                    name: "testSet-management",
                    component: TestSetManagement
                }
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: "/rds-dict-view",
            name: "rds-dict-view",
            component: RdsDictView
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
