<template>
    <div>
        <Table :columns="appColumn" :data="data" border highlight-row @on-row-click="onRowClick"></Table>
        <Page :total="dataTotal" :current="currentPage" @on-change="onPageChange" :page-size="pageSize" simple style="margin-top:20px;text-align: center "/>
        <Spin size="large" fix v-if="showLoading"></Spin>
        <Modal v-model="showAppModal" footer-hide :mask-closable="false">
            <comp-add-app-card-msg ref="editApp" @after-update="afterUpdate"></comp-add-app-card-msg>
        </Modal>
    </div>
</template>

<script>
    import config from "../lib/config"
    import CompAddAppCardMsg from "./CompAddAppCardMsg"
    import utils from "../lib/utils";

    const appSerializer = [{
        id:"number",
        name: "string",
        phone_number: "string",
        app_name: "boolean",
        username: "string",
        password: "string",
        connection:"string",
        head_portrait_name:"string",
        crony:"string",
        status :"string",
        max_login_num:"string",
        device:[{
            id:"number",
            device_name:"string"
        }],
        subsidiary_device:[{
            id:"number",
            custom_name:"string"
        }]
    }]

    export default {
        name: "CompAppTable",
        components:{ CompAddAppCardMsg },
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
                appColumn:[
                    {
                        title: "App",
                        key: "app_name",
                        filters: [],
                        filterRemote (value) {
                            this.appNameList = value
                            this.onPageChange(1)
                        }
                    },
                    {
                        title: "账号",
                        key: "name",
                        sortable:true
                    },
                    {
                        title: "用户名/昵称",
                        key: "username",
                        sortable:true
                    },
                    {
                        title: "密码",
                        key: "password",
                    },
                    {
                        title: "绑定手机号",
                        key: "phone_number",
                    },
                    {
                        title: "头像",
                        key: "head_portrait_name",
                    },
                    {
                        title: "好友",
                        key: "crony",
                    },
                    {
                        title: "资源状态",
                        key: "status",
                        filters: [
                            {
                                label: '未占用',
                                value: 'idle'
                            },
                            {
                                label: '占用',
                                value: 'busy'
                            }
                        ],
                        filteredValue: this.propStatus ? ['idle'] : [],
                        filterRemote (value, row) {
                            this.statusList = value
                            this.onPageChange(1)
                        }
                    },
                    {
                        title: "关联设备/僚机",
                        key: "connection",
                        sortable: true,
                    },
                    {
                        title: "最多登录数",
                        key: "max_login_num",
                    },
                ],
                data:[],
                appNameList:[],
                statusList:[],
                showLoading:false,
                pageSize:config.DEFAULT_PAGE_SIZE,
                showAppModal:false,
                dataTotal:0,
                currentPage:1,
                offset: 0,
            }
        },
        methods:{
            getData(){
                let appNameCondition = ""
                if(this.appNameList.length>0)
                    appNameCondition = "&app__id__in="+"ReefList["+this.appNameList.join("{%,%}")+"]"

                let statusCondition = ""
                if(this.propStatus)
                    statusCondition = "&status=idle"
                if(this.statusList.length>0)
                    statusCondition = "&status__in="+"ReefList["+this.statusList.join("{%,%}")+"]"

                this.showLoading = true
                this.$ajax.get("api/v1/cedar/account/?fields=id,app_name,app,app.id,app.name," +
                    "crony,head_portrait_name,max_login_num," +
                    "name,password,phone_number," +
                    "status,username," +
                    "device.id,device.device_name," +
                    "subsidiary_device.id,subsidiary_device.custom_name" +
                    appNameCondition +
                    statusCondition +
                    "&ordering=-update_time" +
                    "&limit=" + this.pageSize +
                    "&offset=" + this.offset )
                    .then(response=>{
                        this.dataTotal = parseInt(response.headers["total-count"])
                        this.data = utils.validate(appSerializer,response.data.Account)
                        this.data.forEach(item=>{
                            item.status = item.status === "idle" ? "未占用" :"占用"
                            let deviceList = []
                            if(item.device.length>0)
                                item.device.forEach(device=>{
                                    deviceList.push(device.device_name)
                                })
                            let subsidiaryList = []
                            if(item.subsidiary_device.length>0)
                                item.subsidiary_device.forEach(device=>{
                                    subsidiaryList.push(device.custom_name)
                                })
                            item.connection = deviceList.join(",") + subsidiaryList.join(",")
                        })
                        this.showLoading = false
                    }).catch(error=>{
                    if(config.DEBUG) console.log(error)
                        this.$Message.error({content:"获取账号资源信息失败"+error.response.data.message,duration:5})
                        this.showLoading = false
                })
            },
            removeResources(id){
                this.$ajax.delete("api/v1/cedar/account/" + id + "/")
                    .then(response=>{
                        this.$Message.success("账号资源移除成功")
                        this. getData()
                    }).catch(error=>{
                        if(config.DEBUG) console.log(error)
                        this.$Message.error({content:"账号资源移除失败:" + error.response.data.message,duration:7})
                    })
            },
            afterUpdate(){
                this.showAppModal=false;
                this.getData()
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
            //获取app名称列表
            getAppNameList(){
                this.$ajax.get("api/v1/cedar/get_order_app_name")
                    .then(response=>{
                        let appNameList = response.data.result
                        let  appNameFilters = []
                        appNameList.forEach(item=>{
                            appNameFilters.push({label:item.name,value:item.id})
                        })
                        this.appColumn[0].filters = appNameFilters;
                    })
                    .catch(error=>{
                        if(config.DEBUG) console.log(error)
                        this.$Message.error("app列表获取失败")
                    })
            },
        },
        created(){
            let username = sessionStorage.getItem('username');
            this.getAppNameList()
            if (username==="admin" && this.propAction) {
                this.appColumn.push({
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
                                         this.showAppModal = true
                                        this.$refs.editApp.setData(params.row)
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
                                            content: "确定要移除资源账号" + params.row.account_number+ "吗？",
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
    .ivu-poptip-popper .ivu-poptip-content .ivu-poptip-inner{
        max-height: 300px;
        overflow: auto;
    }
    .ivu-poptip-popper .ivu-poptip-content .ivu-poptip-inner .ivu-table-filter-list-item{
        max-height: 259px;
        overflow: auto;
    }
</style>
<style scoped>
    /deep/.ivu-modal-close{
        margin: 18px;
    }
</style>