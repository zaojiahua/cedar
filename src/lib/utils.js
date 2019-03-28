import config from "./config"
export default {
    getDeviceDisplayName(device){
        return device.device_name + " (" + device.device_label + ")"
    },
    getCoralUrl(port){
        return "http://"+config.CORAL_HOST+":"+port;
    },
    getInDoorUrl(port){
        return "http://"+config.INDOOR_HOST+":"+port;
    },
    validate(serializer, data){
        // 广度优先遍历
        if(Object.prototype.toString.call(serializer) === "[object Object]"){
            return this._process_obj(serializer, data)
        } else if(Object.prototype.toString.call(serializer) === "[object Array]"){
            return this._check_array(serializer[0], data)
        } else {
            throw TypeError("serializer must be object or array!")
        }
    },
    _process_obj(schema, obj) {
        if(obj === undefined || obj === null || Object.prototype.toString.call(obj) !== "[object Object]")
            obj = {}

        let keys = Object.keys(schema)
        keys.forEach(key=>{
            if(schema[key] instanceof Array){
                obj[key] = this._check_array(schema[key][0], obj[key])
            }
            else if(schema[key] instanceof Object){
                obj[key] = this._process_obj(schema[key], obj[key])
            }else {
                obj[key] = obj[key]===undefined?null:obj[key]
            }
        })
        return obj
    },
    _check_array(obj_schema, arr){
        if(arr === undefined || arr === null || Object.prototype.toString.call(arr) !== "[object Array]")
            arr = []

        for(let i=0; i<arr.length; ++i){
            arr[i] = this._process_obj(obj_schema, arr[i])
        }

        return arr
    }
}