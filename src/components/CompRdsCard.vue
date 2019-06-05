<template>
    <Card style="margin-bottom: 16px;" dis-hover>
        <Divider orientation="left">{{ propDeviceLabel }}</Divider>
        <Row type="flex" style="margin-bottom: 16px;" align="bottom">
            <Button style="margin-right: 16px;" @click="openJobList">选取用例</Button>
            <Tag closable v-for="(job, index) in jobs" :key="job.id" @on-close="onJobTagClose(index)">{{job.job_name}}</Tag>
        </Row>
        <Row type="flex" style="margin-bottom: 16px;" align="bottom">
            <Button style="margin-right: 16px;" @click="openTboardList">选取任务</Button>
            <Tag closable v-for="(tboard, index) in tboards" :key="tboard.id" @on-close="onTboardTagClose(index)">{{tboard.board_name}}</Tag>
        </Row>
        <Row type="flex">
            <Spin v-show="loadingData" size="large" style="position: absolute; width: 100%; height: inherit; left: 50%;"></Spin>
            <div :class="loadingData ? 'opacity-row' : ''">
                <div class="rds-box"
                     v-for="(item,index) in rdsData" :key="item.id" :class="getRdsColorClass(item.job_assessment_value)" @mouseenter="onRdsMouseEnter(item)"
                     @mouseleave="onRdsMouseLeave" @click="onRdsBoxClick(item,index)"></div>
            </div>
            <Button style="width: 100%; margin-top: 8px;" v-show="showMore"
                    @click="loadMoreData(false)" :disabled="loadingData">加载更多
            </Button>
        </Row>
        <Modal v-model="showJobSelector" :transfer="true" fullscreen @on-ok="onJobListOk">
            <comp-job-list :propMultiSelect="true" ref="jobList" @on-row-click="onJobListRowClick"></comp-job-list>
        </Modal>
        <Modal v-model="showTboardSelector" :transfer="true" fullscreen @on-ok="onTboardListOk">
            <comp-tboard-list :prop-multi-select="true" ref="tboardList" @on-row-click="onTboardListRowClick"></comp-tboard-list>
        </Modal>
        <Drawer v-model="showRdsDetail" :closable="false" width="50" transfer>
            <comp-rds-detail ref="rdsDetail" @delRdsOne="delRdsOne"></comp-rds-detail>
        </Drawer>
    </Card>
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
            propDeviceLabel: {
                type: String,
                default: ""
            },
            propDeviceId: {
                type: Number,
                default: null
            },
            propDefaultTboards: {  // tboard data with id and board_name
                type: Array,
                default: []
            },
            propDefaultJobs: {  // Job data with id, job_label, job_name
                type: Array,
                default: ()=>{return []}
            }
        },
        data: function () {
            return {
                dataOffset: 0,
                rdsData: [],
                showMore: false,
                loadingData: false,
                jobs: [],
                tboards: [],
                showJobSelector: false,
                showTboardSelector: false,
                showRdsDetail: false,
                rdsIndex:null,
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
                this.loadingData = true
                if(reset){
                    this.dataOffset = 0
                }
                let jobCondition = ""
                if(this.jobs.length !== 0) {
                    let jobIds = []
                    this.jobs.forEach(job=>{
                        jobIds.push(job.id)
                    })
                    jobCondition = "&job__in=ReefList[" + jobIds.join("{%,%}") + "]"
                }
                let tboardCondition = ""
                if(this.tboards.length !== 0) {
                    let tboardIds = []
                    this.tboards.forEach(tboard=>{
                        tboardIds.push(tboard.id)
                    })
                    tboardCondition = "&tboard__in=ReefList[" + tboardIds.join("{%,%}") + "]"
                }
                this.$ajax.get("api/v1/cedar/rds/?fields=" +
                    "id," +
                    "job_assessment_value," +
                    "device,device.id,device.device_name," +
                    "job,job.id,job.job_name" +
                    jobCondition +
                    tboardCondition +
                    "&limit=" + pageSize +
                    "&offset=" + this.dataOffset +
                    "&device=" + this.propDeviceId)
                    .then(response=>{
                        this.dataOffset += pageSize
                        if(reset)  // 数据加载完成才清空原有数据，以免画面闪烁。
                            this.rdsData = utils.validate(getRdsSerializer, response.data).rdss
                        else
                            this.rdsData = this.rdsData.concat(utils.validate(getRdsSerializer, response.data).rdss)
                        return this.$ajax
                            .get("api/v1/cedar/rds/?fields=id" +
                                jobCondition +
                                tboardCondition +
                                "&limit=1" +
                                "&offset=" + this.dataOffset +
                                "&device=" + this.propDeviceId)
                            .then(response=>{
                                this.showMore = utils.validate(isThereMoreSerializer, response.data).rdss.length > 0
                                this.loadingData = false
                            })
                            .catch(error=>{
                                if (config.DEBUG) console.log(error)
                                this.showMore = true
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
                this.$refs.jobList.clearSelection()
            },
            openTboardList(){
                this.showTboardSelector = true
                this.$refs.tboardList.clearSelection()
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
                this.loadMoreData(true)
            },
            onJobListRowClick(row, index){
                this.$refs.jobList.toggleSelect(index)
            },
            onTboardListOk(){
                this.tboards = this.$refs.tboardList.getSelection()
                this.loadMoreData(true)
            },
            onTboardListRowClick(row, index){
                this.$refs.tboardList.toggleSelect(index)
            },
            onRdsBoxClick(rds,index){
                this.$refs.rdsDetail.refresh(rds.id)
                this.showRdsDetail = true
                this.rdsIndex=index;
            },
            delRdsOne(){
                this.showRdsDetail = false;
                this.rdsData.splice(this.rdsIndex, 1)
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
                    this.tboards = val
                },
                immediate: true
            },
            propDefaultJobs:{
                handler: function(val){
                    console.log(val)
                    this.jobs = val
                },
                immediate: true
            }
        },
        created() {
            if(config.DEBUG && (this.propDeviceId===null)) console.log("CompRdsList的参数propDeviceId不可为空!")
            else this.loadMoreData(false)
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