<template>
    <div>
        <Drawer v-model="showRdsDetail" :closable="false" width="50" :draggable="true" transfer>
            <comp-rds-detail ref="rdsDetail" @delRdsOne="delRdsOne" :prop-perf-rds="perfRds"></comp-rds-detail>
        </Drawer>
        <Card style="margin-bottom: 16px;" dis-hover v-for="(rdsData,Index) in rdsDataList" :key="Index">
            <Row type="flex">
                <Spin v-show="loadingData" size="large" style="position: absolute; width: 100%; height: inherit; left: 50%;"></Spin>
                <div :class="loadingData ? 'opacity-row' : ''">
                    <div class="rds-box tooltip" :title="'ID：'+item.id+'\n设备名称：'+ item.device.device_name+'\n用例名称：'+item.job.job_name+'\n结果：'+item.job_assessment_value"
                         v-for="(item,index) in rdsData" :key="item.id" :class="[getRdsColorClass(item.job_assessment_value),{'select':index===rdsIndex&&cardIndex===Index}]"
                         @click="onRdsBoxClick(item,Index,index)"></div>
                </div>
            </Row>
        </Card>
    </div>

</template>

<script>
    import config from "../lib/config";
    import utils from "../lib/utils";
    import CompJobList from "./CompJobList";
    import CompTboardList from "./CompTboardList";
    import CompRdsDetail from "./CompRdsDetail";

    const pageSize = config.LARGE_PAGE_SIZE

    const getRdsSerializer = {
        rdss: [
            {
                id: "number",
                job_assessment_value: "string",
                job: {
                    id: "number",
                    job_name: "string",
                },
                device: {
                    id: "number",
                    device_name: "string",
                }
            }
        ]
    }

    const isThereMoreSerializer = {
        rdss: [
            {
                id: "number"
            }
        ]
    }

    export default {
        name: "CompRdsList",
        components: {CompTboardList, CompJobList, CompRdsDetail},
        props: {
            propDeviceId: {
                type: Number,
                default: null
            },
            propJobId: {
                type: Number,
                default: null
            },
            propTboardId: {  // tboard data with id and board_name
                type: Number,
                default: null
            },
            propDefaultTboards: {  // tboard data with id and board_name
                type: Array,
                default: ()=>{return []}
            },
            propDefaultJobs: {  // Job data with id, job_label, job_name
                type: Array,
                default: ()=>{return []}
            },
            propFilterDateRange:{
                type: Array,
                default: ()=>{return []}
            },
            propResultRange:{
                type: Array,
                default: ()=>{return []}
            },
            propInvalidType:{
                type: String,
                default: ''
            },
            perfRds:{
                type: Boolean,
                default: false
            },
            propFullDate:{
                type: Boolean,
                default: true
            },
            updateRds:{
                type: String,
                default: ""
            }
        },
        data: function () {
            return {
                dataOffset: 0,
                rdsData: [],
                // showMore: false,
                loadingData: false,
                jobs: [],
                tboards: [],
                showJobSelector: false,
                showTboardSelector: false,
                showRdsDetail: false,
                rdsIndex:null,
                cardIndex:null,
                jobSelection:[],
                tboardSelection:[],
                rdsDataList:[],
            }
        },
        methods: {
            onRdsMouseEnter(item) {
                this.$emit('rds-mouse-enter', item)
            },
            onRdsMouseLeave() {
                this.$emit('rds-mouse-leave')
            },
            loadMoreData(reset) {
                //通过、未通过、无效条件选择
                let resultRangeCondition = ""
                if(this.propResultRange.length === 1 && this.propResultRange.indexOf("-1")=== -1)
                    resultRangeCondition = "&job_assessment_value__in=ReefList[" + this.propResultRange.join("{%,%}") + "]";
                else if(this.propResultRange.length === 1 && this.propResultRange.indexOf("-1")!== -1)
                    resultRangeCondition = "&job_assessment_value!=1,0";
                else if(this.propResultRange.length === 2 && this.propResultRange.indexOf("-1")=== -1)
                    resultRangeCondition = "&job_assessment_value__in=ReefList[" + this.propResultRange.join("{%,%}") + "]";
                else if(this.propResultRange.length === 2 && this.propResultRange.indexOf("1")=== -1)
                    resultRangeCondition = "&job_assessment_value!=1";
                else if(this.propResultRange.length === 2 && this.propResultRange.indexOf("0")=== -1)
                    resultRangeCondition = "&job_assessment_value!=0";
                else
                    resultRangeCondition = ""
                if(this.propResultRange.length === 1 && this.propResultRange[0] === '-1' && this.propInvalidType.length > 0)
                    resultRangeCondition = "&job_assessment_value=" + this.propInvalidType;
                //时间参数选择
                let dateRangeCondition = ""
                if (this.propFilterDateRange && this.propFilterDateRange[0] && this.propFilterDateRange[1]) {
                    if(this.propFullDate)
                        dateRangeCondition = "&start_time__gte=" +
                            this.propFilterDateRange[0].getFullYear() +
                            "-" +
                            (this.propFilterDateRange[0].getMonth() + 1) +
                            "-" +
                            this.propFilterDateRange[0].getDate() +
                            " 00:00:00&end_time__lte=" +
                            this.propFilterDateRange[1].getFullYear() +
                            "-" +
                            (this.propFilterDateRange[1].getMonth() + 1) +
                            "-" +
                            this.propFilterDateRange[1].getDate() +
                            " 23:59:59"
                    else
                        dateRangeCondition = "&start_time__gte=" + this.propFilterDateRange[0].format("yyyy-MM-dd hh:mm:ss") +
                            "&end_time__lte=" + this.propFilterDateRange[1].format("yyyy-MM-dd hh:mm:ss")
                }
                this.loadingData = true
                if(reset){
                    this.dataOffset = 0
                }
                let jobCondition = ""
                // if(this.jobs.length !== 0) {
                //     let jobIds = []
                //     this.jobs.forEach(job=>{
                //         jobIds.push(job.id)
                //     })
                //     jobCondition = "&job__in=ReefList[" + jobIds.join("{%,%}") + "]"
                // }
                if(this.propJobId){
                    jobCondition = "&job=" + this.propJobId
                }
                let tboardCondition = ""
                if(this.propTboardId){
                    tboardCondition =  "&tboard=" + this.propTboardId
                }
                // if(this.tboards.length !== 0) {
                //     let tboardIds = []
                //     this.tboards.forEach(tboard=>{
                //         tboardIds.push(tboard.id)
                //     })
                //     tboardCondition = "&tboard__in=ReefList[" + tboardIds.join("{%,%}") + "]"
                // }
                this.$ajax.get("api/v1/cedar/filter_rds_validity/?" +
                    jobCondition +
                    tboardCondition +
                    dateRangeCondition +
                    resultRangeCondition +
                    "&limit=" + pageSize +
                    "&offset=" + this.dataOffset +
                    "&device=" + this.propDeviceId +
                    "&ordering=-start_time")
                    .then(response=>{
                        this.dataOffset += pageSize
                        if(reset) { // 数据加载完成才清空原有数据，以免画面闪烁。
                            this.rdsDataList = []
                            // this.rdsData = utils.validate(getRdsSerializer, response.data).rdss
                            if(response.data.rdss.length>0)
                                this.rdsDataList.push(utils.validate(getRdsSerializer, response.data).rdss)
                        }
                        else{
                            // this.rdsData = this.rdsData.concat(utils.validate(getRdsSerializer, response.data).rdss)
                            this.rdsDataList.push(utils.validate(getRdsSerializer, response.data).rdss)
                        }
                        return this.$ajax
                            .get("api/v1/cedar/filter_rds_validity/?" +
                                jobCondition +
                                tboardCondition +
                                dateRangeCondition +
                                resultRangeCondition +
                                "&limit=1" +
                                "&offset=" + this.dataOffset +
                                "&device=" + this.propDeviceId)
                            .then(response=>{
                                // this.showMore = utils.validate(isThereMoreSerializer, response.data).rdss.length > 0
                                this.$emit("after-load-data",utils.validate(isThereMoreSerializer, response.data).rdss.length > 0)
                                this.loadingData = false
                            })
                            .catch(error=>{
                                if (config.DEBUG) console.log(error)
                                // this.showMore = true
                                this.loadingData = false
                            })
                    })
                    .catch(error=>{
                        if (config.DEBUG) console.log(error)
                        this.$Message.error("数据加载失败!")
                        this.loadingData = false
                    })
            },
            openJobList(){
                this.showJobSelector = true
                this.$nextTick(function(){
                    this.$refs.jobList.setSelection(this.jobSelection)
                })
            },
            openTboardList(){
                this.showTboardSelector = true
                this.$nextTick(function(){
                    this.$refs.tboardList.setSelection(this.tboardSelection)
                })
            },
            onJobTagClose(_index){
                this.jobs.splice(_index, 1)
                this.loadMoreData(true)
            },
            onTboardTagClose(_index){
                this.tboards.splice(_index, 1)
                this.loadMoreData(true)
            },
            onJobListOk(){
                this.jobs = this.$refs.jobList.getSelection()
                this.jobSelection = this.$refs.jobList.getThisSelection()
                this.loadMoreData(true)
            },
            onJobListRowClick(row, index){
                this.$refs.jobList.toggleSelect(index)
            },
            onTboardListOk(){
                this.tboards = this.$refs.tboardList.getSelection()
                this.tboardSelection = this.$refs.tboardList.getThisSelection()
                this.loadMoreData(true)
            },
            onTboardListRowClick(row, index){
                this.$refs.tboardList.toggleSelect(index)
            },
            onRdsBoxClick(rds,cardIndex,rdsIndex){
                this.showRdsDetail = true
                this.$refs.rdsDetail.refresh(rds.id,rds.job.id)
                this.rdsIndex=rdsIndex;
                this.cardIndex = cardIndex;
            },
            delRdsOne(){
                this.showRdsDetail = false;
                this.rdsDataList[this.cardIndex].splice(this.rdsIndex, 1)   /////////////
            },
            getRdsColorClass(type) {
                if (type === "0") return "success"
                if (type === "1") return "failed"
                return "invalid"
            },
        },
        watch:{
            propDefaultTboards:{
                handler: function(val){
                    this.tboards = _.cloneDeep(val)
                },
                immediate: true
            },
            propDefaultJobs:{
                handler: function(val){
                    this.jobs = _.cloneDeep(val)
                },
                immediate: true
            },
            propTboardId:{
                handler: function(val){
                    this.loadMoreData(true)
                },
                immediate: true
            },
            propFilterDateRange:{
                handler: function(){
                    this.loadMoreData(true)
                }
            },
            propResultRange:{
                handler: function(){
                    this.loadMoreData(true)
                }
            },
            propInvalidType:{
                handler: function(){
                    this.loadMoreData(true)
                }
            },
            // propJobId:{
            //     handler: function(){
            //         console.log(this.propJobId)
            //         this.loadMoreData(true)
            //     }
            // },
            propDeviceId:{
                handler: function(){
                    if(this.updateRds===""){
                        this.loadMoreData(true)
                    }
                }
            },
            updateRds:{
                handler: function(val){
                    this.loadMoreData(true)
                }
            }
        },
        created() {
            if(config.DEBUG && (this.propDeviceId===null)) console.log("CompRdsList的参数propDeviceId不可为空!")
            else this.loadMoreData(true)
        }
    }
</script>

<style scoped>
    .rds-box {
        height: 24px;
        width: 24px;
        display: inline-block;
        margin-right: 2px;
        cursor: pointer;
        border: #00000000 1px solid;
    }

    .rds-box:hover {
        border: #000000 1px solid;
    }
    .select{
        border: #000000 1px solid;
    }

    .opacity-row {
        opacity: 0.5;
    }
    .success{
        background-color: #1bbc9c;
    }
    .failed{
        background-color: #FFAE25;
    }
    .invalid{
        background-color: #BDC3C7;
    }
</style>
