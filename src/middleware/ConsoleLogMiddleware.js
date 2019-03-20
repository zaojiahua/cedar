export default class ConsoleLogMiddleware {
    onRequest(config) {
        console.log("onRequest to:" + config.url)
        console.log(config)
        return config
    }

    onRequestError(error) {
        console.log("onRequestError to:" + error.url)
        console.log(error)
        throw error
    }

    onSync(promise) {
        return promise
    }

    onResponse(response) {
        console.log("onResponse from:" + response.config.url)
        console.log(response)
        return response
    }

    onResponseError(error) {
        console.log("onResponseError from:" + error.config.url)
        console.log(error)
        throw error
    }
}