<template>
    <div>
        <Drawer v-model="showRdsDetail" :closable="false" width="50" transfer>
            <comp-rds-detail ref="rdsDetail" @delRdsOne="delRdsOne" :prop-perf-rds="true"></comp-rds-detail>
        </Drawer>
        <Card style="margin-bottom: 16px;" dis-hover v-if="rdsData.length>0">
            <Row type="flex">
                <Spin v-show="loadingData" size="large" style="position: absolute; width: 100%; height: inherit; left: 50%;"></Spin>
                <div :class="loadingData ? 'opacity-row' : ''">
                    <div class="rds-box"
                         v-for="(item,index) in rdsData" :key="item.id" :class="[getRdsColorClass(item.job_assessment_value),{selected : index===rdsIndex}]" @click="onRdsBoxClick(item,index)"></div>
                </div>
            </Row>
            <Row v-if="showMore" style="text-align: center;margin-top: 5px;">
                <Button @click="loadMoreData(false)">加载更多</Button>
            </Row>
        </Card>
        <Card style="margin-bottom: 16px;" dis-hover v-if="rdsData.length===0">
            <Row>暂无数据</Row>
        </Card>
    </div>

</template>

<script>
    import config from "../lib/config";
    import utils from "../lib/utils";

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
        components: { CompRdsDetail},
        props: {
            propResult:{
                type: Number,
                default: 0
            },
            propTboardId: {  // 单个tboard
                type: Number,
                default: null
            },
            propTboardIdList:{   //tboard 列表  id
                type: Array,
                default: ()=>{return []}
            },
            propJobId: {
                type: Number,
                default: null
            },
            propTimeRange:{
                type: String,
            },
            propFilterDateRange:{
                type: Array,
                default: ()=>{return []}
            },
            isMin:{
                type: Boolean,
                default: false
            }
        },
        data: function () {
            return {
                dataOffset: 0,
                rdsData: [],
                showMore: false,
                loadingData: false,
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
                this.rdsIndex = null
                //通过、未通过、无效条件选择
                let resultRangeCondition = ""
                if(this.propResult===0)
                    resultRangeCondition = "&job_assessment_value__in=ReefList[0]";
                else if(this.propResult===1)
                    resultRangeCondition = "&job_assessment_value__in=ReefList[1]"
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

                if(this.propJobId){
                    jobCondition = "&job=" + this.propJobId
                }
                let tboardCondition = ""
                if(this.propTboardId){
                    tboardCondition =  "&tboard_id__in=ReefList[" + this.propTboardId + "]"
                }
                if(this.propTboardIdList.length!==0)
                    tboardCondition =  "&tboard_id__in=ReefList[" + this.propTboardIdList.join("{%,%}") + "]"

                let durationCondition = ""
                if(this.propTimeRange)
                    if(this.isMin)
                        durationCondition = "&job_duration__gte="+ this.propTimeRange.split("-")[0]+"&job_duration__lte=" + this.propTimeRange.split("-")[1]
                    else
                        durationCondition = "&job_duration__gt="+ this.propTimeRange.split("-")[0]+"&job_duration__lte=" + this.propTimeRange.split("-")[1]

                this.$ajax.get("api/v1/cedar/rds/?" +
                    jobCondition +
                    tboardCondition +
                    dateRangeCondition +
                    resultRangeCondition +
                    durationCondition +
                    "&limit=" + pageSize +
                    "&offset=" + this.dataOffset +
                    "&ordering=-start_time")
                    .then(response=>{
                        this.dataOffset += pageSize
                        if(reset) { // 数据加载完成才清空原有数据，以免画面闪烁。
                            this.rdsData = []
                            if(response.data.rdss.length>0)
                                this.rdsData = utils.validate(getRdsSerializer, response.data).rdss
                        }
                        else{
                            this.rdsData = this.rdsData.concat(utils.validate(getRdsSerializer, response.data).rdss)
                        }
                        return this.$ajax
                            .get("api/v1/cedar/rds/?" +
                                jobCondition +
                                tboardCondition +
                                dateRangeCondition +
                                resultRangeCondition +
                                durationCondition +
                                "&limit=1" +
                                "&offset=" + this.dataOffset )
                            .then(response=>{
                                this.showMore = utils.validate(isThereMoreSerializer, response.data).rdss.length > 0
                                this.$emit("after-load-data",utils.validate(isThereMoreSerializer, response.data).rdss.length > 0)
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
            onRdsBoxClick(rds,rdsIndex){
                this.showRdsDetail = true
                this.$refs.rdsDetail.refresh(rds.id,this.propJobId)
                this.rdsIndex=rdsIndex;
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
            propTimeRange: {
                handler: function(val){
                    this.loadMoreData(true)
                },
            },
            propTboardId:{
                handler: function(val){
                  this.loadMoreData(true)
                },
            },
            propJobId:{
                handler: function(val){
                  this.loadMoreData(true)
                },
            }
        },
        created() {
            this.loadMoreData(true)
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
    .selected{
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
