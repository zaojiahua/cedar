<template>
    <div>
        <comp-perf-histogram-time-track style="margin: 20px 0;" ref="histogram"
                                        :job-id="job.job_id" :prop-canvas-id="index"
                                        @after-load-data="isShowRdsCard"></comp-perf-histogram-time-track>
        <div v-show="showRds">
            <p style="border-left: 3px solid #1bbc9c;padding-left: 10px;margin-bottom: 5px;">测试结果</p>
            <!--  RDS部分 -->
            <div style="overflow:hidden;">
                <div>
                    <div style="margin: 5px 0 20px 0">
                        <Select v-model="resultRange" multiple style="width:230px" :transfer="true" placeholder="请选择测试结果类型">
                            <Option value="0"> 通过 </Option>
                            <Option value="1"> 未通过 </Option>
                            <Option value="-1"> 无效 </Option>
                        </Select>
                        <p style="float: right">
                            <Tag type="dot" color="#1bbc9c">通过</Tag>
                            <Tag type="dot" color="#FFAE25">未通过</Tag>
                            <Tag type="dot" color="#BDC3C7">无效</Tag>
                        </p>
                    </div>
                    <comp-rds-card ref="rdsCard"
                                   :prop-tboard-id="tboardId"
                                   :prop-job-id="job.job_id"
                                   :prop-device-id="deviceId"
                                   :perf-rds="true"
                                   :prop-result-range="resultRange"
                                   @after-load-data="isShowLoadMore">
                    </comp-rds-card>
                    <div v-show="scrollMore" style="position: relative;height: 50px;">
                        <Spin fix>
                            <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                            <div>Loading</div>
                        </Spin>
                    </div>
                    <p v-show="!noMoreData" style="text-align: center" @click="onClickLoadMore"><Button>点击加载更多</Button></p>
                    <p v-show="noMoreData" style="text-align: center">暂无更多数据</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import CompPerfHistogramTimeTrack from "../components/CompPerfHistogramTimeTrack";
    import CompRdsCard from "../components/CompRdsCard";

    export default {
        name: "CompPerfChartRdsTrackGroup",
        components:{ CompPerfHistogramTimeTrack, CompRdsCard, },
        props:{
            index:{
                type: Number,
            },
            job:{
                type: Object,
                default: ()=>{
                    return {}
                }
            },
            deviceId:{
                type: Number,
                default: null
            },
            tboardId:{
                type: Number,
                default: null
            }
        },
        data(){
            return{
                showRds:true,
                resultRange:[],
                scrollMore:false,
                noMoreData:false,
            }
        },
        methods:{
            isShowRdsCard(flag){
                this.showRds = flag
            },
            isShowLoadMore(flag){
                this.scrollMore = false
                this.noMoreData = !flag
            },
            onClickLoadMore(){
                this.scrollMore = true
                this.$refs.rdsCard.loadMoreData(false)
            }
        },
        watch:{
            tboardId:{
                handler:function (val) {
                    this.$nextTick(function () {
                        this.$refs.histogram.refresh(this.tboardId)
                    })
                },
                immediate: true
            }
        }
    }
</script>

<style scoped>

</style>
