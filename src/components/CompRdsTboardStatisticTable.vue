<template>
    <div>
        <Row style="margin-bottom: 10px;">
            <RadioGroup v-model="groupTypeSwitch" style="float: right;">
                <Radio style="width: 100px;text-align: center;" :label="1">数值</Radio>
                <Radio style="width: 100px;text-align: center;" :label="2">百分比</Radio>
            </RadioGroup>
        </Row>
        <!-- 第一层级表格数据 -->
        <Table :columns="columns" :data="data" border highlight-row :loading="loading1"
               @on-sort-change="onSortChange" @on-row-click="onRowClick" ></Table>
        <Row style="margin-top:20px;text-align: center ">
            <Page :current="currentPage" :total="dataTotal" :page-size="pageSize" simple @on-change="onPageChange" style="display: inline-flex"/>
            <Select v-model="pageSize" style="width:100px;margin-left: 30px" size="small">
                <Option :value="10">10 条/页</Option>
                <Option :value="30">30 条/页</Option>
                <Option :value="50"> 50 条/页</Option>
                <Option :value="100"> 100 条/页</Option>
                <Option :value="150"> 150 条/页</Option>
            </Select>
        </Row>
        <!-- 第二层级表格数据 -->
        <Row style="padding:0 20px" v-show="rowData.name">
            <b v-show="propType==='job'">用例：{{ rowData.name }}</b>
            <b v-show="propType==='device'">设备：{{ rowData.name }}</b>
            <span v-show="showTableChild" style="float: right;color: #1296db;cursor: pointer" @click="showTableChild=false"><Icon type="ios-arrow-up" />收起</span>
            <span v-show="!showTableChild" style="float: right;color: #1296db;cursor: pointer" @click="showTableChild=true"><Icon type="ios-arrow-down" />展开</span>
        </Row>
        <div v-show="showTableChild&&rowData.name">
            <Table :columns="columns2" :data="data2" border highlight-row style="margin-top: 16px" :loading="loading2"
                   @on-sort-change="onSortChange2" @on-row-click="onRowClick2" ></Table>
            <Row style="margin-top:20px;text-align: center ">
                <Page :current="currentPage2" :total="dataTotal2" :page-size="pageSize2" simple @on-change="onPageChange2" style="display: inline-flex"/>
                <Select v-model="pageSize2" style="width:100px;margin-left: 30px" size="small">
                    <Option :value="10">10 条/页</Option>
                    <Option :value="30">30 条/页</Option>
                    <Option :value="50"> 50 条/页</Option>
                    <Option :value="100"> 100 条/页</Option>
                    <Option :value="150"> 150 条/页</Option>
                </Select>
            </Row>
        </div>
        <Drawer v-model="showJobDetail" :draggable="true" :closable="false" width="50">
            <comp-job-detail ref="jobDetail" @closeDrawer="showJobDetail=false"></comp-job-detail>
        </Drawer>
        <Drawer v-model="showDeviceDetail" :draggable="true" :closable="false" width="50">
            <comp-device-detail ref="deviceDetail"></comp-device-detail>
        </Drawer>
    </div>
</template>

<script>
    import CompJobDetail from "./CompJobDetail"
    import CompDeviceDetail from "./CompDeviceDetail"
    import utils from "../lib/utils";
    import config from "../lib/config";

    export default {
        name: "CompRdsTboardStatisticTable",
        components:{ CompJobDetail, CompDeviceDetail },
        props:{
            propTboard:{
                type:Number,
                default:null
            },
            propType:{
                type:String,
                default:'job'
            }
        },
        data(){
            return{
                //1:一层表格数据  2：二层表格数据
                groupTypeSwitch:1,
                columns:[],
                columns2:[],
                data:[],
                data2:[],
                currentPage:1,
                dataTotal:0,
                offset: 0,
                pageSize:10,
                currentPage2:1,
                dataTotal2:0,
                offset2: 0,
                pageSize2:10,
                showJobDetail:false,
                showDeviceDetail:false,
                urlParam:{},
                orderKey:"fail_num",
                orderKey2:"fail_num",
                sortFlag:false,  //true为升序，false为降序
                sortFlag2:false,  //true为升序，false为降序
                showTableChild:true,
                rowData:{},  //一层表格选中的数据
                loading1:false,
                loading2:false,
            }
        },
        methods:{
            _setUrlParam(param){
                this.urlParam = param
            },
            _requestErrorHandle(error) {
                if (config.DEBUG) console.log(error)
                this.loading1 = false
                this.$Message.error({content:error.response.data.description,duration:8})
            },
            _responseHandle(response) {
                this.rowData = {}
                this.dataTotal = parseInt(response.headers["total-count"])
                response.data.forEach(item=>{
                    item.success_rate = item.success_rate + '%'
                    item.invalid_rate = item.invalid_rate + '%'
                    item.fail_rate = item.fail_rate + '%'
                })
                this.data = response.data
                this.loading1 = false
            },
            //  一 级 数 据
            refresh() {
                // 公 共 传 参
                this.urlParam.order = this.orderKey
                this.urlParam.tboard = this.propTboard
                this.urlParam.offset = this.offset
                this.urlParam.limit = this.pageSize
                this.urlParam.reverse = this.sortFlag
                // job 和 device 吃不同的参数
                if(this.propType==='job'){
                    this.urlParam.filter_condition = "job"
                }
                if(this.propType==='device'){
                    this.urlParam.filter_condition = "device"
                }
                this.loading1 = true
                this.$ajax.post("api/v1/cedar/data_view_job_filter/",this.urlParam)
                    .then(this._responseHandle)
                    .catch(this._requestErrorHandle)
            },
            //点击展开二级项(获取二级表格数据)
            handleLoadData(row){
                let paramsObj = {}
                paramsObj.tboard = this.propTboard
                paramsObj.reverse = this.sortFlag2
                paramsObj.order = this.orderKey2
                paramsObj.offset = this.offset2
                paramsObj.limit = this.pageSize2
                if(this.propType==='job'){
                    paramsObj.job = row.id
                    paramsObj.filter_condition = "job"
                }
                if(this.propType==='device'){
                    paramsObj.filter_condition = "device"
                    paramsObj.device = row.id
                }
                this.loading2 = true
                this.$ajax.post("api/v1/cedar/data_view_job_filter/",paramsObj)
                    .then(response=>{
                        this.dataTotal2 = parseInt(response.headers["total-count"])
                        response.data.forEach(item=>{
                            item.success_rate = item.success_rate + '%'
                            item.invalid_rate = item.invalid_rate + '%'
                            item.fail_rate = item.fail_rate + '%'
                        })
                        this.data2 = response.data
                        this.loading2 = false
                    })
                    .catch(error=>{
                        if (config.DEBUG) console.log(error)
                        this.loading2 = false
                        this.$Message.error({content:error.response.data.description,duration:8})
                    })
            },
            //翻页
            onPageChange(page){
                this.offset = page-1
                this.currentPage = page
                this.refresh()
            },
            onPageChange2(page){
                this.offset2 = page-1
                this.currentPage2 = page
                this.handleLoadData(this.rowData)
            },
            //排序
            onSortChange(column){
                this.orderKey = column.key
                if(column.order==='desc'){  //倒 序
                    this.sortFlag = true
                }else {   // 正 序
                    this.sortFlag = false
                }
                this.onPageChange(1)
            },
            onSortChange2(column){
                this.orderKey2 = column.key
                if(column.order==='desc'){  //倒 序
                    this.sortFlag2 = true
                }else {   // 正 序
                    this.sortFlag2 = false
                }
                this.onPageChange2(1)
            },
            //'on-row-click' emit出去的数据：一层表格选中的数据，二层表格选中的数据
            onRowClick(row){
                this.rowData = row
                this.onPageChange2(1)
                this.$emit('on-row-click',row)
            },
            onRowClick2(row){
                this.$emit('on-row-click',this.rowData,row)
            }
        },
        watch:{
            groupTypeSwitch:{
                handler:function (val) {
                    if(val===1) {
                        if(this.propType==='job'){
                            this.columns = [
                                {
                                    title: "用例名称",
                                    key: "name",
                                    width:600,
                                    tree: true
                                },
                                {
                                    title: '失败',
                                    key: 'fail_num',
                                    sortable: 'custom',
                                },
                                {
                                    title: '无效',
                                    key: 'invalid_num',
                                    sortable: 'custom',
                                },
                                {
                                    title: '成功',
                                    key: 'success_num',
                                    sortable: 'custom',
                                },
                                {
                                    title: '总共',
                                    key: 'count_num'
                                },
                                {
                                    title: '操作',
                                    key: "action",
                                    align: 'center',
                                    render: (h, params) => {
                                        return h('div', [
                                            h('span', {
                                                class: 'mouse-hover',
                                                style: {
                                                    cursor: 'pointer'
                                                },
                                                on: {
                                                    click: () => {
                                                        event.stopPropagation();
                                                        // if(this.propType==='job'){
                                                        //     if(params.row._loading===false){
                                                                this.showJobDetail = true
                                                                this.$refs.jobDetail.refresh(params.row.id)
                                                        //     }else {
                                                        //         this.showDeviceDetail = true
                                                        //         this.$refs.deviceDetail.refresh(params.row.id)
                                                        //     }
                                                        // }else {
                                                        //     if(params.row._loading===false){
                                                        //         this.showDeviceDetail = true
                                                        //         this.$refs.deviceDetail.refresh(params.row.id)
                                                        //     }else {
                                                        //         this.showJobDetail = true
                                                        //         this.$refs.jobDetail.refresh(params.row.id)
                                                        //     }
                                                        // }
                                                    }
                                                }
                                            }, '详情'),
                                        ]);
                                    }
                                }
                            ]
                            this.columns2 = [
                                {
                                    title: "自定义名称",
                                    key: "name",
                                    width:600,
                                    tree: true
                                },
                                {
                                    title: '失败',
                                    key: 'fail_num',
                                    sortable: 'custom',
                                },
                                {
                                    title: '无效',
                                    key: 'invalid_num',
                                    sortable: 'custom',
                                },
                                {
                                    title: '成功',
                                    key: 'success_num',
                                    sortable: 'custom',
                                },
                                {
                                    title: '总共',
                                    key: 'count_num'
                                },
                                {
                                    title: '操作',
                                    key: "action",
                                    align: 'center',
                                    render: (h, params) => {
                                        return h('div', [
                                            h('span', {
                                                class: 'mouse-hover',
                                                style: {
                                                    cursor: 'pointer'
                                                },
                                                on: {
                                                    click: () => {
                                                        event.stopPropagation();
                                                        // if(this.propType==='job'){
                                                        //     if(params.row._loading===false){
                                                        //         this.showJobDetail = true
                                                        //         this.$refs.jobDetail.refresh(params.row.id)
                                                        //     }else {
                                                                this.showDeviceDetail = true
                                                                this.$refs.deviceDetail.refresh(params.row.id)
                                                        //     }
                                                        // }else {
                                                        //     if(params.row._loading===false){
                                                        //         this.showDeviceDetail = true
                                                        //         this.$refs.deviceDetail.refresh(params.row.id)
                                                        //     }else {
                                                        //         this.showJobDetail = true
                                                        //         this.$refs.jobDetail.refresh(params.row.id)
                                                        //     }
                                                        // }
                                                    }
                                                }
                                            }, '详情'),
                                        ]);
                                    }
                                }
                            ]
                        }else if(this.propType==='device'){
                            this.columns = [
                                {
                                    title: "自定义名称",
                                    key: "name",
                                    width:600,
                                    tree: true
                                },
                                {
                                    title: '失败',
                                    key: 'fail_num',
                                    sortable: 'custom',
                                },
                                {
                                    title: '无效',
                                    key: 'invalid_num',
                                    sortable: 'custom',
                                },
                                {
                                    title: '成功',
                                    key: 'success_num',
                                    sortable: 'custom',
                                },
                                {
                                    title: '总共',
                                    key: 'count_num'
                                },
                                {
                                    title: '操作',
                                    key: "action",
                                    align: 'center',
                                    render: (h, params) => {
                                        return h('div', [
                                            h('span', {
                                                class: 'mouse-hover',
                                                style: {
                                                    cursor: 'pointer'
                                                },
                                                on: {
                                                    click: () => {
                                                        event.stopPropagation();
                                                        // if(this.propType==='job'){
                                                        //     if(params.row._loading===false){
                                                        //         this.showJobDetail = true
                                                        //         this.$refs.jobDetail.refresh(params.row.id)
                                                        //     }else {
                                                                this.showDeviceDetail = true
                                                                this.$refs.deviceDetail.refresh(params.row.id)
                                                        //     }
                                                        // }else {
                                                        //     if(params.row._loading===false){
                                                        //         this.showDeviceDetail = true
                                                        //         this.$refs.deviceDetail.refresh(params.row.id)
                                                        //     }else {
                                                        //         this.showJobDetail = true
                                                        //         this.$refs.jobDetail.refresh(params.row.id)
                                                        //     }
                                                        // }
                                                    }
                                                }
                                            }, '详情'),
                                        ]);
                                    }
                                }
                            ]
                            this.columns2 = [
                                {
                                    title: "用例名称",
                                    key: "name",
                                    width:600,
                                    tree: true
                                },
                                {
                                    title: '失败',
                                    key: 'fail_num',
                                    sortable: 'custom',
                                },
                                {
                                    title: '无效',
                                    key: 'invalid_num',
                                    sortable: 'custom',
                                },
                                {
                                    title: '成功',
                                    key: 'success_num',
                                    sortable: 'custom',
                                },
                                {
                                    title: '总共',
                                    key: 'count_num'
                                },
                                {
                                    title: '操作',
                                    key: "action",
                                    align: 'center',
                                    render: (h, params) => {
                                        return h('div', [
                                            h('span', {
                                                class: 'mouse-hover',
                                                style: {
                                                    cursor: 'pointer'
                                                },
                                                on: {
                                                    click: () => {
                                                        event.stopPropagation();
                                                        // if(this.propType==='job'){
                                                        //     if(params.row._loading===false){
                                                                this.showJobDetail = true
                                                                this.$refs.jobDetail.refresh(params.row.id)
                                                        //     }else {
                                                        //         this.showDeviceDetail = true
                                                        //         this.$refs.deviceDetail.refresh(params.row.id)
                                                        //     }
                                                        // }else {
                                                        //     if(params.row._loading===false){
                                                        //         this.showDeviceDetail = true
                                                        //         this.$refs.deviceDetail.refresh(params.row.id)
                                                        //     }else {
                                                        //         this.showJobDetail = true
                                                        //         this.$refs.jobDetail.refresh(params.row.id)
                                                        //     }
                                                        // }
                                                    }
                                                }
                                            }, '详情'),
                                        ]);
                                    }
                                }
                            ]
                        }

                    }else if(val===2){
                        if(this.propType==='job'){
                            this.columns = [
                                {
                                    title: "用例名称",
                                    width:600,
                                    key: "name",
                                    tree: true
                                },
                                {
                                    title: '失败率',
                                    key: 'fail_rate',
                                    sortable: 'custom',
                                },
                                {
                                    title: '无效率',
                                    key: 'invalid_rate',
                                    sortable: 'custom',
                                },
                                {
                                    title: '成功率',
                                    key: 'success_rate',
                                    sortable: 'custom',
                                },
                                {
                                    title: '总共',
                                    key: 'count_num'
                                },
                                {
                                    title: '操作',
                                    key: "action",
                                    align: 'center',
                                    render: (h, params) => {
                                        return h('div', [
                                            h('span', {
                                                class: 'mouse-hover',
                                                style: {
                                                    cursor: 'pointer'
                                                },
                                                on: {
                                                    click: () => {
                                                        event.stopPropagation();
                                                        this.showJobDetail = true
                                                        this.$refs.jobDetail.refresh(params.row.id)
                                                    }
                                                }
                                            }, '详情'),
                                        ]);
                                    }
                                }
                            ]
                            this.columns2 = [
                                {
                                    title: "自定义名称",
                                    width:600,
                                    key: "name",
                                    tree: true
                                },
                                {
                                    title: '失败率',
                                    key: 'fail_rate',
                                    sortable: 'custom',
                                },
                                {
                                    title: '无效率',
                                    key: 'invalid_rate',
                                    sortable: 'custom',
                                },
                                {
                                    title: '成功率',
                                    key: 'success_rate',
                                    sortable: 'custom',
                                },
                                {
                                    title: '总共',
                                    key: 'count_num'
                                },
                                {
                                    title: '操作',
                                    key: "action",
                                    align: 'center',
                                    render: (h, params) => {
                                        return h('div', [
                                            h('span', {
                                                class: 'mouse-hover',
                                                style: {
                                                    cursor: 'pointer'
                                                },
                                                on: {
                                                    click: () => {
                                                        event.stopPropagation();
                                                        this.showDeviceDetail = true
                                                        this.$refs.deviceDetail.refresh(params.row.id)
                                                    }
                                                }
                                            }, '详情'),
                                        ]);
                                    }
                                }
                            ]
                        }else if(this.propType==='device'){
                            this.columns = [
                                {
                                    title: "自定义名称",
                                    width:600,
                                    key: "name",
                                    tree: true
                                },
                                {
                                    title: '失败率',
                                    key: 'fail_rate',
                                    sortable: 'custom',
                                },
                                {
                                    title: '无效率',
                                    key: 'invalid_rate',
                                    sortable: 'custom',
                                },
                                {
                                    title: '成功率',
                                    key: 'success_rate',
                                    sortable: 'custom',
                                },
                                {
                                    title: '总共',
                                    key: 'count_num'
                                },
                                {
                                    title: '操作',
                                    key: "action",
                                    align: 'center',
                                    render: (h, params) => {
                                        return h('div', [
                                            h('span', {
                                                class: 'mouse-hover',
                                                style: {
                                                    cursor: 'pointer'
                                                },
                                                on: {
                                                    click: () => {
                                                        event.stopPropagation();
                                                        this.showDeviceDetail = true
                                                        this.$refs.deviceDetail.refresh(params.row.id)
                                                    }
                                                }
                                            }, '详情'),
                                        ]);
                                    }
                                }
                            ]
                            this.columns2 = [
                                {
                                    title: "用例名称",
                                    width:600,
                                    key: "name",
                                    tree: true
                                },
                                {
                                    title: '失败率',
                                    key: 'fail_rate',
                                    sortable: 'custom',
                                },
                                {
                                    title: '无效率',
                                    key: 'invalid_rate',
                                    sortable: 'custom',
                                },
                                {
                                    title: '成功率',
                                    key: 'success_rate',
                                    sortable: 'custom',
                                },
                                {
                                    title: '总共',
                                    key: 'count_num'
                                },
                                {
                                    title: '操作',
                                    key: "action",
                                    align: 'center',
                                    render: (h, params) => {
                                        return h('div', [
                                            h('span', {
                                                class: 'mouse-hover',
                                                style: {
                                                    cursor: 'pointer'
                                                },
                                                on: {
                                                    click: () => {
                                                        event.stopPropagation();
                                                        this.showJobDetail = true
                                                        this.$refs.jobDetail.refresh(params.row.id)
                                                    }
                                                }
                                            }, '详情'),
                                        ]);
                                    }
                                }
                            ]
                        }
                    }
                },
                immediate: true
            },
            propTboard:{
                handler: function(val){
                    //重新获取值
                    if(this.propType==='job'){
                        this.sortFlag = false
                    }else if(this.propType==='device'){
                        this.sortFlag = true
                    }
                    this.onPageChange(1)
                },
                immediate: true
            },
            pageSize:{
                handler:function () {
                    this.onPageChange(1)
                }
            },
            pageSize2:{
                handler:function () {
                    this.onPageChange2(1)
                }
            }
        }
    }
</script>

<style scoped>
    .mouse-hover{
        color: #1bbc9c;
    }
    /deep/.ivu-table-overflowX {
        overflow-x: hidden;
    }
    /deep/.highLight{
        color: #222;
    }
</style>
