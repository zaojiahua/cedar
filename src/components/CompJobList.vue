<template>
    <div>
        <Row style="margin-bottom: 18px;" v-if="propShowSearch">
            <AutoComplete  style="width: calc(100% - 75px)"
                           v-model="keyword"
                           :clearable="true"
                           @on-select="jobSearch"
                           @on-search="handleSearch"
                           @on-clear="clearSearch"
                           @keyup.enter.native="jobSearch(keyword.trim())"
                           placeholder="Enter something...">
                <Option v-for="(item,index) in filterJobNameList" :value="item" :key="index">{{ item }}</Option>
            </AutoComplete>
            <Button style="height: 32px;" @click="jobSearch(keyword.trim())" type="primary">search</Button>
        </Row>
        <Table ref="table" border :columns="columns" :data="data" @on-row-click="onRowClick" @on-selection-change="onSelectionChange">
            <template slot-scope="{row, index}" slot="counter">
                <InputNumber style="width: 65px" :min="1" v-model="data[index].counter"></InputNumber>
            </template>
            <template slot-scope="{row, index}" slot="delete">
                <Button shape="circle" type="default" icon="md-trash" @click="deleteRow(index)">
                </Button>
            </template>
        </Table>
        <Page v-if="propShowPage" :current="currentPage" :total="dataTotal" :page-size="pageSize" simple @on-change="onPageChange"
              style="margin-top:20px;text-align: center "/>
    </div>
</template>

<script>
    import utils from "../lib/utils";
    import config from "../lib/config";

    const getJobSerializer = {
        jobs: [
            {
                id: "number",
                job_label: "string",
                job_name: "string",
                test_area: [
                    {
                        id: "number",
                        description: "string"
                    }
                ],
                custom_tag: [
                    {
                        id: "number",
                        custom_tag_name: "string"
                    }
                ],
                counter: "number"
            }
        ]
    }

    export default {
        name: "CompJobList",
        props: {
            propAutoLoad: {
                type: Boolean,
                default: false
            },
            propShowCounter: {
                type: Boolean,
                default: false
            },
            propMultiSelect: {
                type: Boolean,
                default: false
            },
            propDeletable: {
                type: Boolean,
                default: false
            },
            propShowPage: {
                type: Boolean,
                default: true
            },
            propShowSearch: {
                type: Boolean,
                default: true
            },
            propTboard:{
                type: Array,
                default: ()=>{
                    return []
                }
            },
            propSubsidiaryDeviceCount:{
                type: Number,
            },
            propShowJobType: {
                type: Boolean,
                default: false
            },
            propNotInner:{
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                columns: [
                    {
                        title: "用例名称",
                        key: "job_name",
                        sortable: true,
                        minWidth:200
                    },
                    // {
                    //     title: "caseNo",
                    //     key: "case_number",
                    //     sortable: true
                    // },
                    this.propShowJobType ? {
                        title: "用例类型",
                        key: "job_type",
                        sortable: true,
                        filters: [
                            {
                                label: '功能',
                                value: 'Joblib'
                            },
                            {
                                label: '性能',
                                value: 'PerfJob'
                            },
                            {
                                label: '内嵌',
                                value: 'InnerJob'
                            }
                        ],
                        filterMultiple: false,
                        filteredValue: this.jobType ? [ this.jobType ] : [],
                        filterRemote (value) {
                            this.jobType = value[0] || ''
                            localStorage.setItem('COMPJOBLIST:FILTER_JOB_TYPE', this.jobType)
                            this.jobSearch(this.keyword.trim())
                        }
                    } :  this.propNotInner ? {
                        title: "用例类型",
                        key: "job_type",
                        sortable: true,
                        filters: [
                            {
                                label: '功能',
                                value: 'Joblib'
                            },
                            {
                                label: '性能',
                                value: 'PerfJob'
                            },
                        ],
                        filterMultiple: false,
                        filteredValue: [],
                        filterRemote (value) {
                            this.jobType = value[0] || ''
                            console.log(this.jobType)
                            this.jobSearch(this.keyword.trim())
                        }
                    } : {
                        title: "用例类型",
                        key: "job_type",
                        sortable: true
                    },
                    {
                        title: "测试用途",
                        key: "display_job_test_area"
                    },
                    {
                        title: "自定义标签",
                        key: "display_custom_tag"
                    },
                    // {
                    //     title: "priority",
                    //     key: "priority",
                    //     sortable: true,
                    //     width:105
                    // },
                    {
                        title: "维护人员",
                        key: "username",
                    },
                    {
                        title: "更新时间",
                        key: "updated_time",
                        sortable: true
                    }
                ],
                data: [],
                selection: [],
                currentPageSelection:{},
                selectionJob:{},
                dataTotal: 0,
                offset: 0,
                urlParam: "",
                currentPage: 1,
                allJobNameList:[],
                keyword: '',
                filterJobNameList: [],
                pageSize:config.DEFAULT_PAGE_SIZE,
                tboard:[],
                jobType: localStorage.getItem('COMPJOBLIST:FILTER_JOB_TYPE') || ''
            }
        },
        methods: {
            _requestErrorHandle(reason) {
                if (config.DEBUG) console.log(reason)
                this.$Message.error("载入失败")
            },
            _responseHandle(response) {
                this.currentPageSelection = {}
                this.dataTotal = parseInt(response.headers["total-count"])
                this.data = utils.validate(getJobSerializer, response.data).jobs
                this.data.forEach(job => {
                    job.username = job.author.username
                    if( job.job_type === "Joblib" )
                        job.job_type = '功能'
                    else if( job.job_type === "InnerJob" )
                        job.job_type = '内嵌'
                    else if( job.job_type === "PerfJob" )
                        job.job_type = '性能'
                    // if (job.job_type === "InnerJob" && sessionStorage.username!=='admin') job._disabled = true
                    if (job.counter === null) job.counter = 1
                    let job_test_areas = []
                    job.test_area.forEach(job_test_area => {
                        job_test_areas.push(job_test_area.description)
                    })
                    let custom_tags = []
                    job.custom_tag.forEach(custom_tag => {
                        custom_tags.push(custom_tag.custom_tag_name)
                    })

                    job.display_job_test_area = job_test_areas.join(', ')
                    job.display_custom_tag = custom_tags.join(', ')

                    /* 将之前已经选中的选项重新勾选 */
                    this.selection.forEach(selected=>{
                        if (job.id === selected.id){
                            job._checked = true
                            this.$set(this.currentPageSelection, job.id, 'exist')
                        }
                    })
                })
            },
            _setUrlParam(param){
                this.urlParam = param
            },
            refreshWithData(data) {
                if (data !== undefined) {
                    this.data = data
                }
            },
            refreshWithParam(param){
                // this.keyword = "";
                this._setUrlParam(param)
                this.onPageChange(1)
            },
            refresh() {
                let tboardCondition = ""
                if(this.tboard.length>0)
                    tboardCondition = "&tboard=" + this.tboard[0].id;
                let deviceCountCondition = ""
                if(this.propSubsidiaryDeviceCount)
                    deviceCountCondition = "&subsidiary_device_count__lte=" + this.propSubsidiaryDeviceCount
                let url =
                    "api/v1/cedar/job/?fields=" +
                    "id," +
                    "job_label," +
                    "job_name," +
                    "job_type," +
                    "case_number," +
                    "priority," +
                    "test_area," +
                    "test_area.id," +
                    "test_area.description," +
                    "custom_tag," +
                    "custom_tag.id," +
                    "custom_tag.custom_tag_name," +
                    "author,author.username," +
                    "updated_time" +
                    "&job_deleted=False" +
                    this.filterUrlParam +
                    "&ordering=-updated_time" +
                    "&draft=False" +
                    tboardCondition +
                    deviceCountCondition +
                    this.urlParam

                if(this.propShowPage){
                    url = url +
                        "&limit=" + this.pageSize +
                        "&offset=" + this.offset
                }

                if(this.propShowSearch&&this.keyword.trim()!==""){
                    url = url + "&job_name__icontains=" +  encodeURIComponent(this.keyword.trim());
                }
                this.$ajax.get(url)
                    .then(this._responseHandle)
                    .catch(this._requestErrorHandle)

                if(this.propShowSearch){
                    this.filterJobNameList = [];
                    this.getJobNameList()
                }
            },
            getData() {
                return this.data
            },
            getSelection() {                   //转换成id对比以后可以不用forEach
                return this.selection
            },
            toggleSelect(_index) {
                this.$refs.table.toggleSelect(_index)
            },
            deleteRow(index) {
                this.data.splice(index, 1)
            },
            onRowClick(row, index) {
                this.$emit("on-row-click", row, index)
            },
            onPageChange(page) {
                this.offset = this.pageSize * (page-1)
                this.currentPage = page
                this.refresh()
            },
            clearSelection() {
                this.$refs.table.selectAll(false)
            },
            clearJobSelection() {
                this.selection = []
            },
            onSelectionChange(selection){
                selection.forEach((value) => {
                    if (this.selectionJob[value.id] === undefined ) {
                        //console.log('勾选了id为' + value.id + '的job')
                        this.$set(this.selectionJob, value.id, value)    //所有的已选择job  包括新选择的job
                        this.$set(this.currentPageSelection, value.id, 'exist')    //currentPageSelectedJobs  当前页已选择job
                    }
                })
                //用上个步骤得到的当前页已选择的job-id 和 实际表格返回的 selection做比对，如果对上，则不做任何操作
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
                        this.$delete(this.selectionJob, item)
                        this.$delete(this.currentPageSelection, item)
                    }
                }
                //对象提取所有的value
                this.selection = _.values(this.selectionJob)
                this.$emit("get-job-count",this.selection.length)
            },
            getJobNameList(){
                let deviceCountCondition = ""
                if(this.propSubsidiaryDeviceCount)
                    deviceCountCondition = "&subsidiary_device_count__lte=" + this.propSubsidiaryDeviceCount
                this.$ajax.get("api/v1/cedar/job/?fields=job_name&job_deleted=False&draft=False"+this.urlParam + deviceCountCondition)
                    .then(response=>{
                        let jobNameList = [];
                        response.data.jobs.forEach(job=>{
                            jobNameList.push(job.job_name)
                        })
                        this.allJobNameList = jobNameList;
                    })
                    .catch(this._requestErrorHandle)
            },
            handleSearch (value) {  //搜索补全项的时候调用//输入框输入实时改变option
                let list = [];
                if(this.allJobNameList.toString().toUpperCase().indexOf(value.toUpperCase())!==-1){
                    this.allJobNameList.forEach(item=>{
                        if(item.toUpperCase().indexOf(value.toUpperCase())!==-1)
                            list.push(item)
                    })
                }
                this.filterJobNameList = list
            },
            jobSearch(value){
                if(value.indexOf("&")!==-1){
                    value = value.replace(/\&/g,"%26")
                }
                value= encodeURIComponent(value)
                let deviceCountCondition = ""
                if(this.propSubsidiaryDeviceCount)
                    deviceCountCondition = "&subsidiary_device_count__lte=" + this.propSubsidiaryDeviceCount
                let url =
                    "api/v1/cedar/job/?fields=" +
                    "id," +
                    "job_label," +
                    "job_name," +
                    "job_type," +
                    "test_area," +
                    "test_area.id," +
                    "test_area.description," +
                    "custom_tag," +
                    "custom_tag.id," +
                    "updated_time," +
                    "author,author.username," +
                    "custom_tag.custom_tag_name" +
                    "&job_deleted=False" +
                    "&draft=False" +
                    "&ordering=-updated_time" +
                    this.filterUrlParam +
                    "&job_name__icontains=" +  value +
                    deviceCountCondition +
                    this.urlParam

                if(this.propShowPage){
                    this.currentPage = 1;
                    url = url +
                        "&limit=" + this.pageSize +
                        "&offset=0"
                }
                this.$ajax.get(url)
                    .then(this._responseHandle)
                    .catch(this._requestErrorHandle)
            },
            clearSearch(){
                this.keyword = "";
                this.currentPage = 1;
                this.refresh();
            },
            getThisSelection(){
                return this.selection;
            },
            setSelection(selection){
                this.selection = selection;
            },
            setSelectionJob(selection){   // 返回到选取job页时，恢复selection的值时将SelectionJob的值一并恢复
                selection.forEach((value) => {
                    if (this.selectionJob[value.id] === undefined ) {
                        //console.log('勾选了id为' + value.id + '的job')
                        this.$set(this.selectionJob, value.id, value)    //所有的已选择job  包括新选择的job
                        this.$set(this.currentPageSelection, value.id, 'exist')    //currentPageSelectedJobs  当前页已选择job
                    }
                })
            },
            filterJob () {
                let deviceCountCondition = ""
                if(this.propSubsidiaryDeviceCount)
                    deviceCountCondition = "&subsidiary_device_count__lte=" + this.propSubsidiaryDeviceCount
                let url =
                    "api/v1/cedar/job/?fields=" +
                    "id," +
                    "job_label," +
                    "job_name," +
                    "job_type," +
                    "test_area," +
                    "test_area.id," +
                    "test_area.description," +
                    "custom_tag," +
                    "custom_tag.id," +
                    "updated_time," +
                    "custom_tag.custom_tag_name" +
                    "&job_deleted=False" +
                    "&draft=False" +
                    "&ordering=-updated_time" +
                    this.filterUrlParam +
                    "&job_name__icontains=" +
                    deviceCountCondition +
                    this.urlParam

                if(this.propShowPage){
                    this.currentPage = 1;
                    url = url +
                        "&limit=" + config.DEFAULT_PAGE_SIZE +
                        "&offset=0"
                }
                this.$ajax.get(url)
                    .then(this._responseHandle)
                    .catch(this._requestErrorHandle)
            },
            resetJobList(){
                this.selectionJob = {}
                this.currentPageSelection = {}
                this.selection = []
                this.$emit("get-job-count",this.selection.length)
                this.data.forEach(job=>{
                    this.$set(job,"_checked",false)
                    this.$delete(job, "_checked")
                })
            }

        },
        computed:{
            filterUrlParam(){
                return this.propShowJobType || this.propNotInner ? `${this.jobType ? `&job_type=${this.jobType}` : this.propNotInner ? `&job_type__in=ReefList[PerfJob{%,%}Joblib]` :''}` : ""
            }
        },
        watch:{
            propTboard:{
                handler: function(val){
                    this.tboard = _.cloneDeep(val)
                },
                immediate: true
            },
        },
        created() {
            this.pageSize = utils.getPageSize();
            if(this.propNotInner) this.jobType = ""
            if (this.propAutoLoad) this.refresh()
            if (this.propShowCounter)
                this.columns.splice(0, 0, {
                    title: "运行次数",
                    slot: "counter",
                    width:93
                })
            if (this.propMultiSelect)
                this.columns.splice(0, 0, {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                })
            if (this.propDeletable){
                this.columns.push({
                    align: "center",
                    title: "删除",
                    width:80,
                    slot: "delete"
                })
                this.columns.splice(2, 5)
            }
        },
        beforeCreate(){
            this.jobType = localStorage.getItem('COMPJOBLIST:FILTER_JOB_TYPE');
        }
    }
</script>

<style scoped>
    /deep/.ivu-auto-complete.ivu-select-dropdown{
        max-height: 350px
    }
    /deep/.ivu-page-simple .ivu-page-simple-pager input{
        width: 45px;
    }
</style>
