import config from './config'

export default {
    getUrl(path){
        return "http://" + config.REEF_HOST + ":" + config.REEF_PORT + "/" + path
    }
}