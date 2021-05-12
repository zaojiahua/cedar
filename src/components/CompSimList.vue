<template>
    <div>
        <Table :columns="modelColumn" :data="data" border @on-row-click="onRowClick" highlight-row></Table>
        <Page :total="dataTotal" :current="currentPage" :page-size="pageSize" @on-change="onPageChange" simple style="margin-top:20px;text-align: center "/>
        <Spin size="large" fix v-if="showLoading"></Spin>
        <Modal v-model="showSimModal" footer-hide :mask-closable="false">
            <comp-add-sim-msg ref="editSim" @after-update="afterUpdate"></comp-add-sim-msg>
        </Modal>
    </div>
</template>

<script>
    import config from "../lib/config"
    import utils from "../lib/utils"
    import CompAddSimMsg from "./CompAddSimCardMsg"

    const simSerializer = [{
        id:"number",
        operator: "string",
        phone_number: "string",
        is_volte: "boolean",
        status: "string",
        history_relevance: "string",
        connection:"string",
        volte:"string",
        device:{
            id:"number",
            device_name:"string"
        },
        subsidiary_device:{
            id:"number",
            device_name:"string"
        }
    }]

    export default {
        name: "CompSimList",
        components:{ CompAddSimMsg },
        props:{
            propStatus:{
                type:Boolean,
                default:false
            },
            propAction:{
                type:Boolean,
                default:true
            }
        },
        data(){
            return{
                modelColumn:[
                    {
                        title: "运营商",
                        key: "operator",
                        filters: [
                            {
                                label: '中国移动',
                                value: '中国移动'
                            },
                            {
                                label: '中国联通',
                                value: '中国联通'
                            },
                            {
                                label: '中国电信',
                                value: '中国电信'
                            }
                        ],
                        filterRemote (value, row) {
                            this.operatorList = value
                            this.onPageChange(1)
                        }
                    },
                    {
                        title: "手机号",
                        key: "phone_number",
                    },
                    {
                        title: "是否Volte",
                        key: "volte",
                        filters: [
                            {
                                label: '是',
                                value: "True"
                            },
                            {
                                label: '否',
                                value: "False"
                            }
                        ],
                        filterRemote (value, row) {
                            this.volteList = value
                            this.onPageChange(1)
                        }
                    },
                    {
                        title: "资源状态",
                        key: "status",
                        filters: [
                            {
                                label: '未占用',
                                value: "idle"
                            },
                            {
                                label: '占用',
                                value: "busy"
                            }
                        ],
                        filterRemote (value, row) {
                            if(this.propStatus){
                                this.$Modal.info({
                                    title: "提示",
                                    content: "只允许查看空闲状态的资源！"
                                });
                            }else {
                                this.statusList = value
                                this.onPageChange(1)
                            }
                        }
                    },
                    {
                        title: "关联设备/僚机",
                        key: "connection",
                        sortable: true,
                    },
                    {
                        title: "历史关联",
                        key: "history_relevance",
                    },
                ],
                data:[],
                operatorList:[],
                volteList:[],
                statusList:[],
                showLoading:false,
                pageSize:config.DEFAULT_PAGE_SIZE,
                showSimModal:false,
                dataTotal:0,
                currentPage:1,
                offset: 0,
            }
        },
        methods:{
            getData(){
                let operatorCondition = ""
                if(this.operatorList.length>0)
                    operatorCondition = "&operator__in="+"ReefList["+this.operatorList.join("{%,%}")+"]"

                let volteCondition = ""
                if(this.volteList.length===1)
                    volteCondition = "&is_volte="+ this.volteList[0]

                let statusCondition = ""
                if(this.statusList.length>0)
                    statusCondition = "&status__in="+"ReefList["+this.statusList.join("{%,%}")+"]"
                if(this.propStatus)
                    statusCondition = "&status=idle"

                this.showLoading = true
                this.$ajax.get("api/v1/cedar/simcard/?fields=id,device.id,device.device_name," +
                    "subsidiary_device.id,subsidiary_device.custom_name," +
                    "operator,phone_number,is_volte,status,history_relevance" +
                    operatorCondition +
                    volteCondition +
                    statusCondition +
                    "&ordering=-update_time" +
                    "&limit=" + this.pageSize +
                    "&offset=" + this.offset )
                    .then(response=>{
                        this.dataTotal = parseInt(response.headers["total-count"])
                        this.data = utils.validate(simSerializer,response.data.SIMCard)
                        this.data.forEach(item=>{
                            item.status = item.status === "idle" ? "未占用" :"占用"
                            item.volte = item.is_volte ? "是" : "否"
                            item.connection = (item.device.id ? item.device.device_name : "" ) + (item.subsidiary_device.id ? item.subsidiary_device.custom_name : "")
                        })
                        this.showLoading = false
                    }).catch(error=>{
                        if(config.DEBUG) console.log(error)
                        this.$Message.error({content:"获取SIM卡资源信息失败"+error.response.data.message,duration:5})
                        this.showLoading = false
                })
            },
            onPageChange(page){
                this.offset = this.pageSize*(page-1);
                this.currentPage = page;
                this.getData()
            },
            // Table event
            onRowClick(row, index){
                this.$emit("on-row-click", row, index)
            },
            afterUpdate(){
                this.showSimModal=false;
                this.getData()
            },
            //移除资源
            removeResources(id){
                this.$ajax.delete("api/v1/cedar/simcard/" + id + "/")
                    .then(response=>{
                        this.$Message.success("SIM卡资源移除成功")
                        this. getData()
                    }).catch(error=>{
                    if(config.DEBUG) console.log(error)
                    this.$Message.error({content:"SIM卡资源移除失败:" + error.response.data.message,duration:7})
                })
            }
        },
        created(){
            let username = localStorage.getItem('username');
            if (username==="admin" && this.propAction) {
                this.modelColumn.push(  {
                    title: "操作",
                    key: "action",
                    align: 'center',
                    width:120,
                    render: (h, params) => {
                        return h('div', [
                            h('span', {
                                class: 'mouse-hover',
                                style: {
                                    marginRight: '15px',
                                    cursor: 'pointer',
                                },
                                on: {
                                    click: () => {
                                        this.showSimModal = true
                                        this.$refs.editSim.setData(params.row)
                                    }
                                }
                            }, '编辑'),
                            h('span', {
                                style: {
                                    cursor: 'pointer'
                                },
                                on: {
                                    click: () => {
                                        let root = this
                                        this.$Modal.confirm({
                                            title: "警告！",
                                            content: "确定要移除资源SIM卡" + params.row.phone_number+ "吗？",
                                            onOk(){
                                                root.removeResources(params.row.id)
                                            }
                                        })
                                    }
                                }
                            }, '移除')
                        ]);
                    }
                })
            }
        },
        mounted(){
            this.getData()
        }
    }
</script>

<style>
    .mouse-hover:hover{
        color: #1bbc9c;
    }
</style>
<style scoped>
    /deep/.ivu-modal-close{
        margin: 18px;
    }
</style>