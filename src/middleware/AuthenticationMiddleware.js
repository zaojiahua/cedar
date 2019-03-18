import router from "../router"


export default class AuthenticationMiddleware {
    onRequest(config) {
        if(sessionStorage.token !== undefined){
            config.headers['Authorization'] = "Bearer "+ sessionStorage.getItem('token')
        }
        return config
    }

    onResponseError(error) {
        if(error.response.status === 401 || error.response.status === 403){
            router.push({name: "login"})
        }
        throw error
    }
}