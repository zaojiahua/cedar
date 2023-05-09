<template>
    <Card :shadow="true">
        <Tabs v-model="tabList" style="background: #fff;" @on-click="onFailTabClick">
            <TabPane :label="$t('cleanCenter.list_1')" name="deleteList" :strip="true">
                <Table ref="table" :columns="columns" :data="data" border >
                </Table>
            </TabPane>
            <TabPane :label="failData.length===0 ? $t('cleanCenter.list_2') : $t('cleanCenter.list_2')+'('+failData.length+ ')'" name="failedList" >
                <Table ref="table" :columns="columns" :data="failData" border >
                </Table>
                <Row style="float: right;margin-top: 16px">
                    <Button type="primary" style="margin-right: 15px;width: 80px" @click="onRetry">{{$t('cleanCenter.btn_1')}}</Button>
                    <Button type="primary"  @click="showModal = true">{{$t('cleanCenter.btn_2')}}</Button>
                </Row>
            </TabPane>
        </Tabs>
        <Modal v-model="showModal" :closable="false" :mask-closable="false" footer-hide width="350" style="text-align: center">
            <p slot="header" style="font-size: 16px">{{$t('cleanCenter.btn_3')}}</p>
            <p slot="title" style="font-size: 16px">{{$t('cleanCenter.btn_3')}}</p>
            <div>
                <!--<Row>-->
                    <!--<Col span="10" class="icon-left">-->
                        <!--<Icon size="18" class="icon-border" type="ios-chatboxes-outline" />-->
                    <!--</Col>-->
                    <!--<Col span="14" class="icon-right">-->
                        <!--<p>QQ客服</p>-->
                        <!--<p>123456456</p>-->
                    <!--</Col>-->
                <!--</Row>-->
                <Row style="margin: 20px 0 10px;">
                    <Col span="10" class="icon-left">
                        <Icon size="18" class="icon-border" type="ios-call-outline" />
                    </Col>
                    <Col span="14" class="icon-right">
                        <p>{{$t('cleanCenter.btn_4')}}</p>
                        <p><a href="#">010 6868 1606</a></p>
                    </Col>
                </Row>
                <Row>
                    <img src="../static/angelreef.jpg" :alt="$t('cleanCenter.btn_5')" style="max-width: 150px">
                    <p>{{$t('cleanCenter.btn_5')}}</p>
                </Row>
                <Row style="margin-top: 20px">
                    <Button type="primary" @click="showModal = false">{{$t('public.btn_close')}}</Button>
                </Row>
            </div>
        </Modal>
    </Card>
</template>

<script>
    import config from "../lib/config"

    export default {
        data(){
            return{
                path:"ws://"+config.REEF_HOST+":"+config.WEBSOCKET+"/ws/tboard/tboard_delete/",
                failPath:"ws://"+config.REEF_HOST+":"+config.WEBSOCKET+"/ws/tboard/tboard_deleted_fail/",
                socket:null,
                failSocket:null,
                columns: [
                    {
                        title: this.$t('tboardList.board_name'),
                        key: "board_name",
                        sortable: true
                    },
                    {
                        width: 150,
                        title: this.$t('tboardList.board_stamp'),
                        key: "board_stamp",
                        sortable: true
                    },
                    {
                        title: this.$t('tboardList.success_ratio'),
                        key: "success_ratio",
                        sortable: true
                    },
                    {
                        title: this.$t('tboardList.people'),
                        key: "author",
                        sortable: true
                    },
                    {
                        title: this.$t('deviceDetail.status'),
                        key: "state",
                        sortable: true
                    }
                ],
                data: [],
                failData:[],
                showModal:false,
                tabList:"deleteList"
            }
        },
        methods:{
            socketInit() {
                if(typeof(WebSocket) === "undefined"){
                    alert(this.$t('cleanCenter.socket_1'))
                }else{
                    // 实例化socket
                    this.socket = new WebSocket(this.path)
                    this.failSocket =  new WebSocket(this.failPath)
                    // 监听socket连接
                    this.socket.onopen
                    // 监听socket错误信息
                    this.socket.onerror
                    // 监听socket消息
                    this.socket.onmessage = this.socketMessage
                    this.failSocket.onmessage = this.failSocketMessage
                }
            },
            socketMessage(msg) {
                let tboards = JSON.parse(msg.data).message
                tboards.forEach(item=>{
                    if(item.state === "deleting")
                        item.state = this.$t('cleanCenter.socket_2')
                    else if(item.state === "deleted")
                        item.state = this.$t('cleanCenter.socket_3')
                    else
                        item.state = this.$t('cleanCenter.socket_4')

                })
                this.data = tboards
            },
            failSocketMessage(msg) {
                this.failData = JSON.parse(msg.data).message
            },
            onRetry(){
                if(this.failData.length===0){
                    this.$Message.info(this.$t('cleanCenter.socket_5'))
                    return
                }
                let idList = []
                this.failData.forEach(item=>{
                    idList.push(item.id)
                })
                this.$ajax.post("api/v1/cedar/delete_tboard/",{
                    tboard_id:idList
                }).then(()=>{
                    this.failData = []
                    this.tabList = "deleteList"
                    this.columns.splice(4,0, {
                        title: "状态",
                        key: "state",
                        sortable: true
                    })
                    this.$Message.info(this.$t('cleanCenter.socket_6'))
                }).catch(error=>{
                    if(config.DEBUG) console.log(error)
                    this.$Message.error(this.$t('cleanCenter.socket_7'))
                })
            },
            onFailTabClick(name){
                if(name==="failedList"){
                    this.columns.splice(4,1)
                }else {
                    if(!this.columns[4])
                    this.columns.splice(4,0, {
                        title: this.$t('deviceDetail.status'),
                        key: "state",
                        sortable: true
                    })
                }
            }
        },
        created () {
            this.socketInit()
        },
        destroyed () {
            // 销毁监听
            if(this.socket) {
                this.socket.onclose
                this.failSocket.onclose
            }
        }
    }
</script>

<style>
    .icon-border{
        padding: 8px;
        margin-top: 2px;
        border: 1px solid #ddd;
        border-radius: 50%;
    }
    .icon-left{
        text-align: right;
        padding-right: 8px;
    }
    .icon-right{
        text-align: left;
        padding-left: 8px;
    }
</style>
