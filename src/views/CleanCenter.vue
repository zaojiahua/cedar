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
                tboards.forEach(item=>{
                    if(item.state === "deleting")
                        item.state = "正在删除"
                    else if(item.state === "deleted")
                        item.state = "已删除"
                    else
                        item.state = "待删除"

                })
                this.data = tboards
            },
        },
        created () {
            this.socketInit()
        },
        destroyed () {
            // 销毁监听
            if(this.socket)
                this.socket.onclose
        }
    }
</script>