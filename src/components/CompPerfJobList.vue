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
        <Table ref="table" border :columns="columns" :data="data" @on-row-click="onRowClick" highlight-row></Table>
        <Page :current="currentPage" :total="dataTotal" :page-size="pageSize" simple @on-change="onPageChange"
              style="margin-top:20px;text-align: center "/>
    </div>
</template>

<script>
    import utils from "../lib/utils";
    import config from "../lib/config";

    const getJobSerializer = [
            {
                id: "number",
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
            }
        ]

    export default {
        name: "CompPerfJobList",
        props: {
            propAutoLoad: {
                type: Boolean,
                default: true
            },
            propTboard:{
                type: Array,
                default: ()=>{
                    return []
                }
            },
            propTboardIds:{
                type: Array,
                default: ()=>{
                    return []
                }
            },
            propShowSearch: {
                type: Boolean,
                default: true
            },
        },
        data() {
            return {
                columns: [
                    {
                        title: this.$t('jobList.job_name'),
                        key: "job_name",
                        sortable: true
                    },
                    {
                        title: this.$t('jobList.display_job_test_area'),
                        key: "display_job_test_area"
                    },
                    {
                        title: this.$t('jobList.display_custom_tag'),
                        key: "display_custom_tag"
                    },
                    {
                        title: this.$t('jobList.updated_time'),
                        key: "updated_time",
                        sortable: true
                    }
                ],
                data: [],
                dataTotal: 0,
                offset: 0,
                // urlParam: "",
                currentPage: 1,
                allJobNameList:[],
                keyword: '',
                filterJobNameList: [],
                pageSize:config.DEFAULT_PAGE_SIZE,
            }
        },
        methods: {
            _requestErrorHandle(reason) {
                if (config.DEBUG) console.log(reason)
                this.$Message.error(this.$t('public.loadFail'))
            },
            _responseHandle(response) {
                this.dataTotal = parseInt(response.headers["total-count"])
                this.data = utils.validate(getJobSerializer, response.data)
                this.data.forEach(job => {
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

            },
            refreshWithData(data) {
                if (data !== undefined) {
                    this.data = data
                }
            },
            refresh() {
                let url =
                    "api/v1/cedar/get_perf_data_job_data/?tboard="+ this.propTboardIds.join(",") +
                    "&limit=" + this.pageSize +
                    "&offset=" + this.offset

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
            toggleSelect(_index) {
                this.$refs.table.toggleSelect(_index)
            },
            onRowClick(row, index) {
                this.$emit("on-row-click", row, index)
            },
            onPageChange(page) {
                this.offset = this.pageSize * (page-1)
                this.currentPage = page
                this.refresh()
            },
            getJobNameList(){
                this.$ajax.get("api/v1/cedar/get_perf_data_job_data/?tboard="+ this.propTboardIds.join(","))
                    .then(response=>{
                        let jobNameList = [];
                        response.data.forEach(job=>{
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
                let url = "api/v1/cedar/get_perf_data_job_data/?tboard="+ this.propTboardIds.join(",") +
                    "&job_name__icontains=" +  value +
                    "&limit=" + this.pageSize +
                    "&offset=0"

                this.currentPage = 1;
                this.$ajax.get(url)
                    .then(this._responseHandle)
                    .catch(this._requestErrorHandle)
            },
            clearSearch(){
                this.keyword = "";
                this.currentPage = 1;
                this.refresh();
            },
        },
        watch:{

        },
        created() {
            this.pageSize = utils.getPageSize();
            if (this.propAutoLoad) this.refresh()
        }
    }
</script>

<style scoped>
    /deep/.ivu-auto-complete.ivu-select-dropdown{
        max-height: 350px
    }
</style>
