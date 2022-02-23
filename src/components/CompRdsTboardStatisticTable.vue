<template>
    <div>
        <Row style="margin-bottom: 10px;">
            <RadioGroup v-model="groupTypeSwitch" style="float: right;">
                <Radio style="width: 100px;text-align: center;" :label="1">数值</Radio>
                <Radio style="width: 100px;text-align: center;" :label="2">百分比</Radio>
            </RadioGroup>
        </Row>
        <Table row-key="uuid" :load-data="handleLoadData" :columns="columns" :data="data" border highlight-row
               :update-show-children="true" @on-sort-change="onSortChange" @on-row-click="onRowClick" ></Table>
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
                groupTypeSwitch:1,
                columns:[],
                data:[],
                currentPage:1,
                dataTotal:0,
                offset: 0,
                pageSize:10,
                showJobDetail:false,
                showDeviceDetail:false,
                urlParam:{},
                orderKey:"fail_num",
                sortFlag:false,  //true为升序，false为降序
            }
        },
        methods:{
            _setUrlParam(param){
                this.urlParam = param
            },
            _requestErrorHandle(error) {
                if (config.DEBUG) console.log(error)
                this.$Message.error({content:error.response.data.description,duration:8})
            },
            _responseHandle(response) {
                this.dataTotal = parseInt(response.headers["total-count"])
                response.data.forEach(item=>{
                    item._loading = false
                    item.children = []
                    item.success_rate = item.success_rate + '%'
                    item.invalid_rate = item.invalid_rate + '%'
                    item.fail_rate = item.fail_rate + '%'
                    item.cellClassName = {
                        name: 'highLight',
                    }
                })
                this.data = response.data
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
                this.$ajax.post("api/v1/cedar/data_view_job_filter/",this.urlParam)
                    .then(this._responseHandle)
                    .catch(this._requestErrorHandle)
            },
            //点击展开二级项
            handleLoadData(item, callback){
                let paramsObj = {}
                paramsObj.tboard = this.propTboard
                paramsObj.reverse = true
                if(this.groupTypeSwitch===1){
                    paramsObj.order = 'fail_num'
                }else {
                    paramsObj.order = 'fail_rate'
                }
                if(this.propType==='job'){
                    paramsObj.job = item.id
                    paramsObj.filter_condition = "job"
                }
                if(this.propType==='device'){
                    paramsObj.filter_condition = "device"
                    paramsObj.device = item.id
                }
                this.$ajax.post("api/v1/cedar/data_view_job_filter/",paramsObj)
                    .then(response=>{
                        response.data.forEach(item=>{
                            item.success_rate = item.success_rate + '%'
                            item.invalid_rate = item.invalid_rate + '%'
                            item.fail_rate = item.fail_rate + '%'
                        })
                        callback(response.data)
                    })
                    .catch(error=>{
                        if (config.DEBUG) console.log(error)
                        this.$Message.error({content:error.response.data.description,duration:8})
                    })
            },
            //翻页
            onPageChange(page){
                this.offset = page-1
                this.currentPage = page
                this.refresh()
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
            onRowClick(row,index){
                this.$emit('on-row-click',row,index)
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
                                                        if(this.propType==='job'){
                                                            if(params.row._loading===false){
                                                                this.showJobDetail = true
                                                                this.$refs.jobDetail.refresh(params.row.id)
                                                            }else {
                                                                this.showDeviceDetail = true
                                                                this.$refs.deviceDetail.refresh(params.row.id)
                                                            }
                                                        }else {
                                                            if(params.row._loading===false){
                                                                this.showDeviceDetail = true
                                                                this.$refs.deviceDetail.refresh(params.row.id)
                                                            }else {
                                                                this.showJobDetail = true
                                                                this.$refs.jobDetail.refresh(params.row.id)
                                                            }
                                                        }
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
                                                        if(this.propType==='job'){
                                                            if(params.row._loading===false){
                                                                this.showJobDetail = true
                                                                this.$refs.jobDetail.refresh(params.row.id)
                                                            }else {
                                                                this.showDeviceDetail = true
                                                                this.$refs.deviceDetail.refresh(params.row.id)
                                                            }
                                                        }else {
                                                            if(params.row._loading===false){
                                                                this.showDeviceDetail = true
                                                                this.$refs.deviceDetail.refresh(params.row.id)
                                                            }else {
                                                                this.showJobDetail = true
                                                                this.$refs.jobDetail.refresh(params.row.id)
                                                            }
                                                        }
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
                                                        if(this.propType==='job'){
                                                            if(params.row._loading===false){
                                                                this.showJobDetail = true
                                                                this.$refs.jobDetail.refresh(params.row.id)
                                                            }else {
                                                                this.showDeviceDetail = true
                                                                this.$refs.deviceDetail.refresh(params.row.id)
                                                            }
                                                        }else {
                                                            if(params.row._loading===false){
                                                                this.showDeviceDetail = true
                                                                this.$refs.deviceDetail.refresh(params.row.id)
                                                            }else {
                                                                this.showJobDetail = true
                                                                this.$refs.jobDetail.refresh(params.row.id)
                                                            }
                                                        }
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
                                                        if(this.propType==='job'){
                                                            if(params.row._loading===false){
                                                                this.showJobDetail = true
                                                                this.$refs.jobDetail.refresh(params.row.id)
                                                            }else {
                                                                this.showDeviceDetail = true
                                                                this.$refs.deviceDetail.refresh(params.row.id)
                                                            }
                                                        }else {
                                                            if(params.row._loading===false){
                                                                this.showDeviceDetail = true
                                                                this.$refs.deviceDetail.refresh(params.row.id)
                                                            }else {
                                                                this.showJobDetail = true
                                                                this.$refs.jobDetail.refresh(params.row.id)
                                                            }
                                                        }
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
