<template>
    <div>
        <Table :columns="modelColumn" :data="data" border @on-row-click="onRowClick" highlight-row  @on-selection-change="onSelectionChange"></Table>
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
            propMultiSelect:{
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
                selection:[],
                selectionSim:{},
                currentPageSelection:{},
            }
        },
        methods:{
            getData(){
                this.currentPageSelection = {}
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
                            /* 将之前已经选中的选项重新勾选 */
                            if(this.selection.length>0)
                                this.selection.forEach(selected=>{
                                    if (item.id === selected.id){
                                        item._checked = true
                                        this.$set(this.currentPageSelection, item.id, 'exist')
                                    }
                                })
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
                        this.getData()
                    }).catch(error=>{
                    if(config.DEBUG) console.log(error)
                    this.$Message.error({content:"SIM卡资源移除失败:" + error.response.data.message,duration:7})
                })
            },
            // 支持多选
            getThisSelection(){
                return this.selection;
            },
            onSelectionChange(selection){
                selection.forEach((value) => {
                    if (this.selectionSim[value.id] === undefined ) {
                        //console.log('勾选了id为' + value.id + '的job')
                        this.$set(this.selectionSim, value.id, value)    //所有的已选择App  包括新选择的App
                        this.$set(this.currentPageSelection, value.id, 'exist')    //currentPageSelectedApp  当前页已选择App
                    }
                })
                //用上个步骤得到的当前页已选择的App-id 和 实际表格返回的 selection做比对，如果对上，则不做任何操作
                // 如果对不上，则表示多了一个，即用户点击了一次取消，就用$delete方法将多出来的这条数据删除this.$delete(obj,key);
                for (let item in this.currentPageSelection) {
                    let i = 0
                    for (i; i < selection.length; i++) {
                        if (parseInt(item) === selection[i].id) {
                            break
                        }
                    }
                    if (i === selection.length) {
                        //console.log('不再勾选id为' + item + '的job')
                        this.$delete(this.selectionSim, item)
                        this.$delete(this.currentPageSelection, item)
                    }
                }
                //对象提取所有的value
                this.selection = _.values(this.selectionSim)
                this.$emit("selected-count",this.selection.length)
            },
            //取消全选
            resetSimList(){
                this.selectionSim = {}
                this.currentPageSelection = {}
                this.selection = []
                this.$emit("selected-count",0)
                this.data.forEach(item=>{
                    this.$set(item,"_checked",false)
                    this.$delete(item, "_checked")
                })
            }
        },
        created(){
            let username = sessionStorage.getItem('username');
            if (this.propMultiSelect && username==="admin")
                this.modelColumn.splice(0, 0, {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                })
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
                                class: 'mouse-hover-remove',
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
            this.pageSize = utils.getPageSize();
            this.getData()
        }
    }
</script>

<style>
    .mouse-hover:hover{
        color: #1bbc9c;
    }
    .mouse-hover-remove:hover{
        color: red;
    }
</style>
<style scoped>
    /deep/.ivu-modal-close{
        margin: 18px;
    }
</style>
