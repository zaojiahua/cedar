<template>
    <div style="float: left;width: 200px;height: 30px;color: #fff">
        <div @click="onOpenCleanModel">
            <span v-if="isClean===1" style="float: right; height: 18px;margin-top: -6px;">已使用：{{capacity.used}} <span style="color: #999">{{usedText}}</span> / {{capacity.total}} <span style="color: #999">{{totalText}}</span></span>
            <span v-if="isClean===0" style="float: right; height: 18px;margin-top: -6px;">正在清理中...</span>
            <span v-if="isClean===2" style="float: right; height: 18px;margin-top: -6px;">清理失败...</span>
            <span v-if="isClean===3" style="float: right; height: 18px;margin-top: -6px;">清理异常...</span>
            <Progress hide-info :percent=percent :stroke-width="5" />
        </div>
        <Modal v-model="showTimeModal" :closable="false" :footer-hide="true" :mask-closable="false" width="350">
            <div>
                <Row style="margin-top: 16px;">
                    <DatePicker v-model="filterDateRange" @on-change="onDateChange" style="width: 300px;" type="daterange" placeholder="选择要清理的日期范围" :transfer="true"></DatePicker>
                </Row>
                <Row style="text-align: right;margin-top: 30px">
                    <Button @click="showTimeModal=false" style="margin-right: 24px;">取消</Button>
                    <Button type="primary" @click="onCleanClick">清理</Button>
                </Row>
            </div>
        </Modal>
    </div>

</template>

<script>
    import config from "../lib/config"
    export default  {
        data(){
            return{
                capacity:{
                    free: 0,
                    total: 0,
                    used: 0,
                },
                usedText:"GB",
                totalText:"GB",
                percent:0,
                showTimeModal:false,
                filterDateRange:null,
                isClean:1,   //  0：清理中  1：清理成功   2：清理失败
                path:"ws://"+config.REEF_HOST+":"+config.WEBSOCKET+"/ws/system/log_delete/",
                socket:null,
                isSocketConnectError:false,
            }
        },
        methods:{
            getReefUsage(){
                this.$ajax.get("api/v1/cedar/get_reef_space_usage/?unit=GB")
                    .then(response=>{
                        this.percent = response.data.total=== 0 ? 0 : parseFloat((response.data.used/response.data.total*100).toFixed(2))
                        this.usedText = this.totalText = "GB"
                        this.capacity = response.data
                        if(response.data.total>=10240){
                            this.capacity.total = parseFloat((response.data.total/1024).toFixed(2));
                            this.totalText = "T"
                        }
                        if(response.data.used>=10240){
                            this.capacity.used =  parseFloat((response.data.used/1024).toFixed(2));
                            this.usedText = "T"
                        }
                    }).catch(error=>{
                        if(config.DEBUG) console.log(error)
                        this.$Message.error("取得容量信息失败")
                })
            },
            //点击弹出选择时间清理
            onOpenCleanModel(){
                if(sessionStorage.getItem('username')!=='admin'){
                    return
                }
                if(this.isSocketConnectError){
                    this.$Message.warning({content:"socket连接中断，请联系管理员处理",duration:3})
                    return
                }
                if(this.isClean===0){
                    this.$Message.info("正在清理,请勿重复点击...")
                    return
                }
                if(this.isClean===3){
                    this.$Message.warning({content:"清理服务异常，请联系管理员处理",duration:3})
                    return
                }
                this.showTimeModal = true
                this.filterDateRange = null
            },
            //点击清理
            onCleanClick(){
                if(!this.filterDateRange || !this.filterDateRange[0] || !this.filterDateRange[1]){
                    this.$Message.warning("请选择要清理的时间范围")
                    return
                }
                let startDate = new Date(this.filterDateRange[0]).format('yyyy-MM-dd')
                let endDate = new Date(this.filterDateRange[1]).format('yyyy-MM-dd')
                this.showTimeModal = false
                let _this = this
                this.$Modal.confirm({
                    title: "提示",
                    content: "清理会影响正常使用TMach和Edtior，可能需要较长时间，确定要清理吗?",
                    okText: "开始清理",
                    onOk() {
                        this.$ajax.post("api/v1/cedar/delete_log/",{
                            start_date:startDate,
                            end_date:endDate
                        }).then(response=>{
                            this.$Message.success("请求成功")
                        }).catch(error=>{
                            _this.isClean = 1
                            this.$Message.error("请求失败")
                        })
                    }
                })
            },
            // 清理时控制选取时间不超过15天
            onDateChange(date){
                let sub = new Date(date[1])-  new Date(date[0])
                if(sub>15*24*3600*1000){
                    this.$Modal.info({
                        title:"提示",
                        content:"最多只能选取15天的数据，已自动调整日期！",
                    })
                    this.filterDateRange = [ new Date(date[0]),new Date(new Date(new Date(date[0]).getTime()+15*24*3600*1000).setHours(0,0,0,0))]
                }
            },
            // websocket 长连接 获取是否在清理中
            socketInit() {
                if(typeof(WebSocket) === "undefined"){
                    alert("您的浏览器不支持socket")
                }else{
                    // 实例化socket
                    this.socket = new WebSocket(this.path)
                    // 监听socket连接 (连接建立成功时触发)
                    this.socket.onopen = this.socketOpen
                    // 监听socket错误信息
                    this.socket.onerror = this.socketError
                    // 监听socket消息
                    this.socket.onmessage = this.socketMessage
                    // 监听socket 关闭信息
                    this.socket.onclose = this.socketClose
                }
            },
            socketMessage(msg) {
                let data = JSON.parse(msg.data).message
                if(data.status === "PENDING"){
                    this.isClean = 0
                }else if(data.status === "SUCCESS"){
                    this.isClean = 1
                }else if(data.status === "FAIL"){
                    this.isClean = 2
                }else if(data.status === "EXCEPTION"){
                    this.isClean = 3
                }
                this.getReefUsage()
            },
            socketError(error){
                this.isSocketConnectError = true
            },
            socketOpen(res){
                this.isSocketConnectError = false
            },
            socketClose(res){
                this.isSocketConnectError = true
            },
        },
        created(){
            this.socketInit()
            this.getReefUsage()
        },
        destroyed () {
            // 销毁监听
            if(this.socket) {
                this.socket.onclose
            }
        }
    }
</script>
