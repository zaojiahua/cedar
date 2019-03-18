export default class AuthenticationMiddleware {
    onRequest(config) {
        if('token' in sessionStorage){
            config.headers['Authorization'] = "Bearer "+ sessionStorage.getItem('token')
        }
        return config
    }
}