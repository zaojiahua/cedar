import config from "./config"
export default {
    getCoralUrl(port){
        return "http://"+config.CORAL_HOST+":"+port;
    },
    getPageSize(){
        return parseInt(localStorage.pageSize === undefined ? config.DEFAULT_PAGE_SIZE : localStorage.pageSize);
    },
    validate(serializer, data){
        let dataClone = _.cloneDeep(data)
        // 广度优先遍历
        if(Object.prototype.toString.call(serializer) === "[object Object]"){
            return this._process_obj(serializer, dataClone)
        } else if(Object.prototype.toString.call(serializer) === "[object Array]"){
            return this._check_array(serializer[0], dataClone)
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
    },
    _initDate(){
        Date.prototype.format = function (format) {
            var args = {
                "M+": this.getMonth() + 1,
                "d+": this.getDate(),
                "h+": this.getHours(),
                "m+": this.getMinutes(),
                "s+": this.getSeconds(),
                "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
                "S": this.getMilliseconds()
            };
            if (/(y+)/.test(format))
                format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (let i in args) {
                let n = args[i];
                if (new RegExp("(" + i + ")").test(format))
                    format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? n : ("00" + n).substr(("" + n).length));
            }
            return format;
        };
    },
    blobToDataURL (blob) {
        return new Promise((resolve, reject) => {
            let reader = new FileReader()
            reader.readAsDataURL(blob)
            reader.onload = (e) => {
                resolve(e.target.result)
            }
        })
    },
    dataURLtoFile (dataurl, filename) {
    var arr = dataurl.split(',')
    var mime = arr[0].match(/:(.*?);/)[1]
    var dec = atob(arr[1]) // window atob() 方法用于解码使用 base-64 编码的字符串，base-64 编码使用的是 btoa，该方法使用 "A-Z", "a-z", "0-9", "+", "/" 和 "=" 字符来编码字符串。
    var n = dec.length
    var u8arr = new Uint8Array(n) // 8位无符号整数数组 0~255
    while (n--) {
      u8arr[n] = dec.charCodeAt(n) // charCodeAt() 方法可返回指定位置的字符的 Unicode 编码
    }
    return new File([u8arr], filename, { type: mime })
  }
}