<template>
    <div>
        <Row style="margin-bottom: 10px">
            <Input style="width: calc(100% - 70px)" v-model="keyword" :clearable="true"
                   :placeholder="$t('appInfo.tips_1')"
                   @on-enter="onPageChange(1)" @on-clear="keyword='';onPageChange(1)"></Input>
            <Button style="height: 32px;" @click="onPageChange(1)" type="primary">search</Button>
        </Row>
        <Table :columns="appColumn" :data="data" border @on-row-click="onRowClick" @on-selection-change="onSelectionChange"></Table>
        <Page :total="dataTotal" :current="currentPage" @on-change="onPageChange" :page-size="pageSize" simple style="margin-top:20px;text-align: center "/>
        <Spin size="large" fix v-if="showLoading"></Spin>
        <Modal v-model="showAppModal" footer-hide :mask-closable="false">
            <comp-add-app-card-msg ref="editApp" :isDisabled="true" @after-update="afterUpdate"></comp-add-app-card-msg>
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
        usage_rate:"string",
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
            },
            propMultiSelect:{
                type:Boolean,
                default:false
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
                        title: this.$t('deviceDetail.account_info'),
                        key: "name",
                    },
                    {
                        title: this.$t('appInfo.tips_2'),
                        key: "username",
                    },
                    {
                        title: this.$t('userDetail.password'),
                        key: "password",
                    },
                    {
                        title: this.$t('appInfo.tips_3'),
                        key: "phone_number",
                    },
                    // {
                    //     title: "是否已达上限",
                    //     key: "status",
                    //     filters: [
                    //         {
                    //             label: '是',
                    //             value: 'idle'
                    //         },
                    //         {
                    //             label: '否',
                    //             value: 'busy'
                    //         }
                    //     ],
                    //     filteredValue: this.propStatus ? ['idle'] : [],
                    //     filterRemote (value, row) {
                    //         this.statusList = value
                    //         this.onPageChange(1)
                    //     }
                    // },
                    {
                        title: this.$t('appInfo.tips_4'),
                        key: "connection",
                    },
                    {
                        title: this.$t('appInfo.tips_5'),
                        key: "usage_rate",
                    },
                ],
                data:[],
                appNameList:[],
                // statusList:[],
                keyword:"",
                showLoading:false,
                pageSize:config.DEFAULT_PAGE_SIZE,
                showAppModal:false,
                dataTotal:0,
                currentPage:1,
                offset: 0,
                selection:[],
                selectionApp:{},
                currentPageSelection:{},
            }
        },
        methods:{
            getData(){
                this.currentPageSelection = {}
                let appNameCondition = ""
                if(this.appNameList.length>0)
                    appNameCondition = "&app__id__in="+"ReefList["+this.appNameList.join("{%,%}")+"]"

                let keywordCondition = ""
                if(this.keyword.trim().length!==0){
                    keywordCondition = "&name__icontains=" +  encodeURIComponent(this.keyword)
                }


                // let statusCondition = ""
                // if(this.propStatus)
                //     statusCondition = "&status=idle"
                // if(this.statusList.length>0)
                //     statusCondition = "&status__in="+"ReefList["+this.statusList.join("{%,%}")+"]"

                this.showLoading = true
                this.$ajax.get("api/v1/cedar/account/?fields=id,app_name,app,app.id,app.name," +
                    "max_login_num,usage_rate," +
                    "name,password,phone_number," +
                    "status,username," +
                    "device.id,device.device_name," +
                    "subsidiary_device.id,subsidiary_device.custom_name" +
                    appNameCondition +
                    keywordCondition +
                    "&ordering=-update_time" +
                    "&limit=" + this.pageSize +
                    "&offset=" + this.offset )
                    .then(response=>{
                        this.dataTotal = parseInt(response.headers["total-count"])
                        this.data = utils.validate(appSerializer,response.data.Account)
                        this.data.forEach(item=>{
                            item.status = item.status === "idle" ? this.$t('resourcesList.status_1') :this.$t('resourcesList.status_2')
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
                        this.$Message.error({content:this.$t('appInfo.tips_6')+error.response.data.message,duration:5})
                        this.showLoading = false
                })
            },
            removeResources(id){
                this.$ajax.delete("api/v1/cedar/account/" + id + "/")
                    .then(response=>{
                        this.$Message.success(this.$t('appInfo.tips_7'))
                        this.getData()
                    }).catch(error=>{
                        if(config.DEBUG) console.log(error)
                        this.$Message.error({content:this.$t('appInfo.tips_8') + error.response.data.message,duration:7})
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
                        if(this.propMultiSelect)
                            this.appColumn[1].filters = appNameFilters;
                        else
                            this.appColumn[0].filters = appNameFilters;
                    })
                    .catch(error=>{
                        if(config.DEBUG) console.log(error)
                        this.$Message.error(this.$t('appInfo.tips_9'))
                    })
            },
            // 支持多选
            getThisSelection(){
                return this.selection;
            },
            onSelectionChange(selection){
                selection.forEach((value) => {
                    if (this.selectionApp[value.id] === undefined ) {
                        //console.log('勾选了id为' + value.id + '的job')
                        this.$set(this.selectionApp, value.id, value)    //所有的已选择App  包括新选择的App
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
                        this.$delete(this.selectionApp, item)
                        this.$delete(this.currentPageSelection, item)
                    }
                }
                //对象提取所有的value
                this.selection = _.values(this.selectionApp)
                this.$emit("selected-count",this.selection.length)
            },
            //取消全选
            resetAppList(){
                this.selectionApp = {}
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
            this.getAppNameList()
            if (this.propMultiSelect)
                this.appColumn.splice(0, 0, {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                })
            if (username==="admin" && this.propAction) {
                this.appColumn.push({
                    title: this.$t('testSetList.action'),
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
                            }, this.$t('resourcesList.edit')),
                            h('span', {
                                class:'mouse-hover-remove',
                                style: {
                                    cursor: 'pointer'
                                },
                                on: {
                                    click: () => {
                                        let root = this
                                        this.$Modal.confirm({
                                            title: this.$t('public.modal_warn'),
                                            content: this.$t('appInfo.tips_10') + params.row.account_number+ this.$t('deviceDetail.removeTips_2'),
                                            onOk(){
                                                root.removeResources(params.row.id)
                                            }
                                        })
                                    }
                                }
                            }, this.$t('resourcesList.remove'))
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
