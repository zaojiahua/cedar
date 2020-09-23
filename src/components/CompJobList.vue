<template>
    <div>
        <Row style="margin-bottom: 18px;" v-if="propShowSearch">
            <AutoComplete  style="width: calc(100% - 75px)"
                v-model="keyword"
                :clearable="true"
                @on-select="jobSearch"
                @on-search="handleSearch"
                @on-clear="clearSearch"
                placeholder="Enter something...">
                <Option v-for="(item,index) in filterJobNameList" :value="item" :key="index">{{ item }}</Option>
            </AutoComplete>
            <Button style="height: 32px;" @click="jobSearch(keyword)" type="primary">search</Button>
        </Row>
        <Table ref="table" border :columns="columns" :data="data" @on-row-click="onRowClick" @on-selection-change="onSelectionChange">
            <template slot-scope="{row, index}" slot="counter">
                <InputNumber :min="1" v-model="data[index].counter"></InputNumber>
            </template>
            <template slot-scope="{row, index}" slot="delete">
                <Button shape="circle" type="default" icon="md-trash" size="large" @click="deleteRow(index)">
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
                default: true
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
            }
        },
        data() {
            return {
                columns: [
                    {
                        title: "用例名称",
                        key: "job_name",
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
                    {
                        title: "更新时间",
                        key: "updated_time",
                        sortable: true
                    }
                ],
                data: [],
                selection: [],
                dataTotal: 0,
                offset: 0,
                urlParam: "",
                currentPage: 1,
                allJobNameList:[],
                keyword: '',
                filterJobNameList: [],
                pageSize:config.DEFAULT_PAGE_SIZE,
                tboard:[]
            }
        },
        methods: {
            _requestErrorHandle(reason) {
                if (config.DEBUG) console.log(reason)
                this.$Message.error("载入失败")
            },
            _responseHandle(response) {
                this.dataTotal = parseInt(response.headers["total-count"])
                this.data = utils.validate(getJobSerializer, response.data).jobs
                this.data.forEach(job => {
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
                })

                /* 将之前已经选中的选项重新勾选 */
                if(this.selection[this.currentPage] !== undefined){
                    let ids = []
                    this.selection[this.currentPage].forEach(item=>{
                        ids.push(item.id)
                    })

                    for(let i=0; i<this.data.length; ++i){
                        if(ids.includes(this.data[i].id)){
                            this.data[i]._checked = true
                        }
                    }
                }
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
                this.keyword = "";
                this._setUrlParam(param)
                this.onPageChange(1)
            },
            refresh() {
                let tboardCondition = ""
                if(this.tboard.length>0)
                    tboardCondition = "&tboard=" + this.tboard[0].id;
                let url =
                    "api/v1/cedar/job/?fields=" +
                    "id," +
                    "job_label," +
                    "job_name," +
                    "test_area," +
                    "test_area.id," +
                    "test_area.description," +
                    "custom_tag," +
                    "custom_tag.id," +
                    "custom_tag.custom_tag_name," +
                    "updated_time" +
                    "&job_deleted=False" +
                    "&ordering=-updated_time" +
                    tboardCondition +
                    this.urlParam

                if(this.propShowPage){
                    url = url +
                        "&limit=" + this.pageSize +
                        "&offset=" + this.offset
                }

                if(this.propShowSearch&&this.keyword!==""){
                    url = url + "&job_name__icontains=" +  this.keyword;
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
            getSelection() {
                let selection = []
                this.selection.forEach(items=>{
                    selection = selection.concat(items)
                })
                return selection
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
            onSelectionChange(selection){
                this.selection[this.currentPage] = selection
            },
            getJobNameList(){
                this.$ajax.get("api/v1/cedar/job/?fields=job_name&job_deleted=False"+this.urlParam)
                    .then(response=>{
                        let jobNameList = [];
                        response.data.jobs.forEach(job=>{
                            jobNameList.push(job.job_name)
                        })
                        this.allJobNameList = jobNameList;
                    })
                    .catch(this._requestErrorHandle)
            },
            handleSearch (value) {
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
                let url =
                    "api/v1/cedar/job/?fields=" +
                    "id," +
                    "job_label," +
                    "job_name," +
                    "test_area," +
                    "test_area.id," +
                    "test_area.description," +
                    "custom_tag," +
                    "custom_tag.id," +
                    "custom_tag.custom_tag_name" +
                    "&job_deleted=False" +
                    "&ordering=-updated_time" +
                    "&job_name__icontains=" +  value +
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
            if (this.propAutoLoad) this.refresh()
            if (this.propShowCounter)
                this.columns.splice(0, 0, {
                    title: "运行次数",
                    slot: "counter",
                })
            if (this.propMultiSelect)
                this.columns.splice(0, 0, {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                })
            if (this.propDeletable)
                this.columns.push({
                    align: "center",
                    title: "删除",
                    slot: "delete"
                })
        }
    }
</script>

<style scoped>
    /deep/.ivu-auto-complete.ivu-select-dropdown{
        max-height: 500px
    }

</style>