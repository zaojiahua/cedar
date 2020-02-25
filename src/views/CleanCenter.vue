<template>
    <div>
        <Table ref="table" :columns="columns" :data="data" border style="margin-top: 16px;">
        </Table>
    </div>
</template>

<script>
    import config from "../lib/config"

    export default {
        data(){
            return{
                path:"ws://"+config.REEF_HOST+":"+config.WEBSOCKET+"/ws/tboard_delete/",
                socket:null,
                columns: [
                    {
                        title: "任务名称",
                        key: "board_name",
                        sortable: true
                    },
                    {
                        width: 150,
                        title: "创建日期",
                        key: "board_stamp",
                        sortable: true
                    },
                    {
                        title: "任务成功率",
                        key: "success_ratio",
                        sortable: true
                    },
                    {
                        title: "操作人员",
                        key: "author",
                        sortable: true
                    },
                    {
                        title: "状态",
                        key: "state",
                        sortable: true
                    }
                ],
                data: [
                    {
                        board_stamp: "",
                        board_name: "",
                        success_ratio: "",
                        author:"",
                        state:"",
                    }
                ],
                pageSize:config.DEFAULT_PAGE_SIZE,
                offset:0,
            }
        },
        methods:{
            getData(reset){
                this.$ajax.get( "api/v1/cedar/tboard/?fields=" +
                    "id," +
                    "board_stamp," +
                    "board_name," +
                    "success_ratio," +
                    "is_to_delete," +
                    "author," +
                    "author.username" +
                    "&ordering=-board_stamp" +
                    "&finished_flag=True&is_to_delete=True"
                ).then(response=>{
                    if(response.data.tboards.length===0){
                        this.data = response.data.tboards
                        this.$Message.info("暂无待清理的数据")
                        if(this.socket===null)
                            this.socketInit()
                        return
                    }
                    response.data.tboards.forEach(item=>{
                        item.author = item.author.username
                        item.success_ratio = (item.success_ratio *100).toFixed(1) + "%";
                        item.state = item.is_to_delete ? "待删除" : item.is_to_delete
                    })
                    this.data = response.data.tboards
                    if(reset)
                        this.socketInit()
                }).catch(error=>{
                    if(config.DEBUG) console.log(error)
                    this.$Message.warning("取得数据失败！")
                })
            },
            socketInit() {
                if(typeof(WebSocket) === "undefined"){
                    alert("您的浏览器不支持socket")
                }else{
                    // 实例化socket
                    this.socket = new WebSocket(this.path)
                    // 监听socket连接
                    this.socket.onopen
                    // 监听socket错误信息
                    this.socket.onerror
                    // 监听socket消息
                    this.socket.onmessage = this.socketMessage
                }
            },
            socketMessage(msg) {
                let tboards = JSON.parse(msg.data).message
                for (let key in tboards){
                    let message = ""
                    if(tboards[key]==="deleting")
                        message = "正在删除"
                    else if(tboards[key]==="deleted")
                        message = "已删除"
                    else
                        message = "待删除"
                    this.data.forEach(item=>{
                        if(item.id===parseInt(key)){
                            this.$set(item,"state",message)
                        }
                    })
                }
            },
        },
        created () {
            this.getData(true)
        },
        destroyed () {
            // 销毁监听
            if(this.socket)
                this.socket.onclose
        }
    }
</script>