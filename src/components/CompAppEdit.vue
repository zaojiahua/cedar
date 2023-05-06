<template>
    <div>
        <Row style="height: 50px;line-height: 50px;">
            <Col span="4">
                <span style="padding-left: 5px;border-left: 3px solid #1bbc9c">{{$t('appInfo.editTips_1')}}</span>
            </Col>
            <Col span="20" style="text-align: right">
                <Button type="primary" @click="onOpenAddModal">{{$t('appInfo.editTips_2')}}</Button>
                <Dropdown trigger="click" style="margin: 0 15px">
                    <Button>
                        {{$t('public.moreAction')}}
                        <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list" style="text-align: left">
                        <span @click="deleteApp"><DropdownItem>{{$t('public.btn_del')}}</DropdownItem></span>
                    </DropdownMenu>
                </Dropdown>
                <AutoComplete  style="width:300px;text-align: left"
                               v-model="keyword"
                               :clearable="true"
                               @on-select="jobSearch"
                               @on-search="handleSearch"
                               @on-clear="clearSearch"
                               @keyup.enter.native="jobSearch(keyword)"
                               :placeholder="$t('appInfo.editTips_3')">
                    <Option v-for="(item,index) in filterAppNameList" :value="item" :key="index">{{ item }}</Option>
                </AutoComplete>
                <Button style="height: 32px;" @click="jobSearch(keyword)" type="primary">search</Button>
            </Col>
        </Row>
        <Table :columns="appColumn" :data="data" border highlight-row @on-row-click="onRowClick" @on-selection-change="onSelectionChange"></Table>
        <Page :total="dataTotal" :current="currentPage" @on-change="onPageChange" :page-size="pageSize" simple style="margin-top:20px;text-align: center "/>
        <Spin size="large" fix v-if="showLoading"></Spin>

        <Modal v-model="showAppNameInfo" footer-hide :mask-closable="false" width="420">
            <Card>
                <p slot="title">{{$t('appInfo.editTips_4')}}</p>
                <Form :model="appInfo" :label-width="130" :rules="ruleValidate" ref="formValidate">
                    <FormItem :label="$t('appInfo.editTips_5')+'：'" prop="name">
                        <Input v-model="appInfo.name" :placeholder="$t('appInfo.editTips_6')"></Input>
                    </FormItem>
                    <FormItem :label="$t('appInfo.editTips_7')+'：'" prop="max_login_num">
                        <InputNumber v-model="appInfo.max_login_num" :min="1" :precision="0"></InputNumber>
                    </FormItem>
                </Form>
                <Row type="flex" justify="center">
                    <Button type="primary" @click="createAppName">{{$t('resourcesList.commit')}}</Button>
                </Row>
            </Card>
        </Modal>

    </div>
</template>

<script>
    import config from "../lib/config"
    import utils from "../lib/utils";

    export default {
        name: "CompAppTable",
        components:{  },
        data(){
            return{
                appColumn:[
                    // {
                    //     type: 'selection',
                    //     width: 60,
                    //     align: 'center'
                    // },
                    {
                        title: "App",
                        key: "name",
                    },
                    {
                        title: this.$t('appInfo.editTips_7'),
                        key: "max_login_num",
                    },
                    {
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
                                            this.showAppNameInfo = true
                                            this.setAppInfo(params.row)
                                        }
                                    }
                                }, this.$t('resourcesList.edit')),
                            ]);
                        }
                    }
                ],
                ruleValidate: {
                    name: [
                        { required: true, message: this.$t('appInfo.title_2'), trigger: 'blur' },
                    ],
                    max_login_num:[
                        { required: true, type:"number", min:1, message: this.$t('appInfo.editTips_8'), trigger: 'blur' },
                    ]
                },
                isCreated:true,
                data:[],
                showAppNameInfo:false,
                appInfo:{
                    id:null,
                    name:"",
                    max_login_num:1,
                },
                keyword:"",
                filterAppNameList:[],
                allAppNameList:[],
                showLoading:false,
                pageSize:config.DEFAULT_PAGE_SIZE,
                dataTotal:0,
                currentPage:1,
                offset: 0,
                selection:[],
                selectionApp:{},
                currentPageSelection:{},
            }
        },
        methods:{
            resetAppInfo(){
                this.isCreated = true
                this.appInfo = {
                    id:null,
                    name:"",
                    max_login_num:1,
                }
            },
            setAppInfo(row){
                this.isCreated = false
                this.appInfo = {
                    id:row.id,
                    name:row.name,
                    max_login_num:row.max_login_num,
                }
            },
            getData(){
                this.showLoading = true
                this.$ajax.get("api/v1/cedar/appgather/?" +
                    "&ordering=-update_time" +
                    "&limit=" + this.pageSize +
                    "&offset=" + this.offset )
                    .then(response=>{
                        this.currentPageSelection = {}
                        this.dataTotal = parseInt(response.headers["total-count"])
                        this.data = response.data.APPGather
                        console.log(this.data)
                        this.data.forEach(item=>{
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
                    this.$Message.error({content:this.$t('appInfo.tips_9')+error.response.data.message,duration:5})
                    this.showLoading = false
                })
            },
            //切换页面
            onPageChange(page){
                this.offset = this.pageSize*(page-1);
                this.currentPage = page;
                this.getData()
            },
            // Table event
            onRowClick(row, index){
                this.selection = [].concat(row)
                // this.$emit("on-row-click", row, index)
            },
            //获取app名称列表
            getAppNameList(){
                this.$ajax.get("api/v1/cedar/get_order_app_name")
                    .then(response=>{
                        let appNameList = []
                            response.data.result.forEach(item=>{
                                appNameList.push(item.name)
                        })
                        this.allAppNameList = appNameList
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
            //搜索类代码
            handleSearch (value) {  //搜索补全项的时候调用//输入框输入实时改变option
                let list = [];
                if(this.allAppNameList.toString().toUpperCase().indexOf(value.toUpperCase())!==-1){
                    this.allAppNameList.forEach(item=>{
                        if(item.toUpperCase().indexOf(value.toUpperCase())!==-1)
                            list.push(item)
                    })
                }
                this.filterAppNameList = list
            },
            jobSearch(value){
                value= encodeURIComponent(value)
                let keyCountCondition = ""
                if(value.length>0)
                    keyCountCondition = "&name__icontains=" +  value
                let url = "api/v1/cedar/appgather/?" +
                    "&ordering=-update_time" +
                    keyCountCondition +
                    "&limit=" + this.pageSize +
                    "&offset=0"
                this.showLoading = true
                this.$ajax.get(url)
                    .then(response=>{
                        this.currentPageSelection = {}
                        this.dataTotal = parseInt(response.headers["total-count"])
                        this.data = response.data.APPGather
                        console.log(this.data)
                        this.data.forEach(item=>{
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
                    })
                    .catch(error=>{
                        if(config.DEBUG) console.log(error)
                        this.$Message.error(this.$t('appInfo.tips_9'))
                        this.showLoading = false
                    })
            },
            clearSearch(){
                this.keyword = "";
                this.onPageChange(1)
            },
            //添加 - 删除 App名称
            onOpenAddModal(){
                this.showAppNameInfo = true
                this.resetAppInfo()
            },
            deleteApp(){
                if(this.selection.length===0){
                    this.$Message.warning(this.$t('appInfo.editTips_9'))
                    return
                }
                let _this = this
                this.$Modal.confirm({
                    title:this.$t('public.modal_warn'),
                    content:this.$t('appInfo.editTips_10')+"【"+_this.selection[0].name+"】"+this.$t('tboardList.delTit_2'),
                    onOk(){
                        _this.$ajax.delete("api/v1/cedar/appgather/"+_this.selection[0].id + "/")
                        .then(response=>{
                            _this.$Message.success(_this.$t('public.delSuccess'))
                            _this.selection = []
                            _this.clearSearch()
                            _this.$emit("after-update-app")
                        }).catch(error=>{
                            if(error.response.data.custom_code==="0"){
                                _this.$Message.error({content:error.response.data.description,duration:5})
                            }else {
                                _this.$Message.error(_this.$t('public.delFail'))
                            }
                        })
                    }
                })


            },
            createAppName(){
                if(this.appInfo.name.trim().length===0){
                    this.$Message.warning(this.$t('appInfo.editTips_6'))
                    return
                }
                if(this.isCreated){
                    this.$ajax.post("api/v1/cedar/appgather/",{
                        name:this.appInfo.name,
                        max_login_num:this.appInfo.max_login_num,
                    }).then(response=>{
                        this.showAppNameInfo = false
                        this.$Message.success(this.$t('appInfo.editApp_1'))
                        this.$emit("after-update-app")
                        this.clearSearch()
                    }).catch(error=>{
                        if(error.response.data.name){
                            this.$Message.error({content:error.response.data.name.join(","),duration:5})
                        }else {
                            this.$Message.error(this.$t('appInfo.editApp_2'))
                        }
                    })
                }else {
                    this.$ajax.patch("api/v1/cedar/appgather/"+this.appInfo.id + "/",{
                        name:this.appInfo.name,
                        max_login_num:this.appInfo.max_login_num,
                    }).then(response=>{
                        this.showAppNameInfo = false
                        this.$Message.success(this.$t('userDetail.success_1'))
                        this.$emit("after-update-app")
                        this.clearSearch()
                    }).catch(error=>{
                        if(error.response.data.name){
                            this.$Message.error({content:error.response.data.name.join(","),duration:5})
                        }else {
                            this.$Message.error(this.$t('appInfo.editApp_3'))
                        }
                    })
                }
            },
        },
        created(){

        },
        mounted(){
            this.pageSize = utils.getPageSize();
            this.getData()
            this.getAppNameList()
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
