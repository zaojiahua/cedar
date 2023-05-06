<template>
    <div>
        <!--   用例 统计 部分   -->
        <Card :bordered="false">
            <div v-show="jobId!== null ">
                <p style="text-align: center;font-size: 16px;font-weight: bold;padding-top: 20px;">{{$t('rdsDeviceStatistic.jobTitle')}}</p>
                <comp-dynamic-loading-chart :device-id="10" :prop-url="propJobUrl" :prop-type="propType"
                                            @after-load-data="afterJobDataLoading"
                                            @on-chart-click="onJobChartClick" >
                </comp-dynamic-loading-chart>
            </div>
            <div v-show="jobId===null" style="font-size: 12px;text-align: center">
                {{$t('rdsDeviceStatistic.nodata')}}
            </div>
        </Card>
        <!--   用例下的设备统计    -->
        <div style="margin: 16px 0;background: #fff" v-if="jobUrl.length>0">
            <p style="margin-left: 20px;font-size: 14px;font-weight: bold;padding: 10px 0">{{$t('rdsTboardView.tabs_1')}}</p>
            <p style="margin-left: 20px;font-size: 12px">{{$t('rdsDeviceStatistic.job')}}：{{ jobName }}<a href="javascript:" style="margin-left: 10px" @click="showJobDetail=true;$refs.jobDetail.refresh(jobId)">{{$t('rdsDeviceStatistic.jobInfo')}}</a></p>
            <div style="width: 280px;float: left;padding: 10px;margin-top: 50px">
                <comp-statistic-pie :prop-data="pieData" :prop-failure="totalCount.failureRate" :prop-id="10" :prop-invalid-rate="totalCount.invalidRate" :prop-type="propType"></comp-statistic-pie>
                <div style="font-size: 12px">
                    <Row>
                        <Col span="12">
                            <span class="iconTip" style="background: #2D8cF0"></span> {{$t('tboardDetail.total')}}： {{ totalCount.total }}
                        </Col>
                        <Col span="12">
                            <span class="iconTip" style="background: #f5a623"></span> {{$t('tboardDetail.fail')}}： {{ totalCount.fail }}
                        </Col>
                    </Row>
                    <Row style="margin-top: 5px;">
                        <Col span="12">
                            <span class="iconTip" style="background: #999"></span> {{$t('tboardDetail.invalid')}}： {{ totalCount.invalid }}
                        </Col>
                        <Col span="12">
                            <span class="iconTip" style="background: #1bbc9c"></span> {{$t('tboardDetail.pass')}}： {{ totalCount.pass }}
                        </Col>
                    </Row>
                </div>
            </div>
            <div style="margin-left: 280px">
                <p style="text-align: center;font-size: 16px;font-weight: bold">{{ jobName }} {{$t('rdsDeviceStatistic.deviceTitle')}}</p>
                <comp-dynamic-loading-chart ref="jobChart" :prop-width="400" :prop-url="jobUrl" :device-id="20" :prop-type="propType"
                                            @after-load-data="afterDeviceDataLoading"
                                            @on-chart-click="onDeviceChartClick" ></comp-dynamic-loading-chart>
            </div>
            <Divider orientation="left" style="margin-bottom: 0">{{$t('rdsDetail.result')}}</Divider>
            <!--  RDS部分 -->
            <Card :bordered="false" :dis-hover="true" style="overflow:hidden;" v-if="jobId!==null&&jobUrl.length>0">
                <p style="font-size: 12px">{{$t('rdsDeviceStatistic.job')}}：【{{ jobName }}】    {{$t('rdsDeviceStatistic.dev')}}：【{{ deviceLabel }}】<a href="javascript:" style="margin-left: 10px" @click="showDeviceDetail=true;$refs.deviceDetail.refresh(deviceId)">{{$t('rdsDeviceStatistic.devInfo')}}</a></p>
                <div>
                    <div style="margin: 20px 0;">
                        <Select v-model="resultRange" multiple style="width:230px" @on-change="invalidType='';filterType=''" :transfer="true" :placeholder="$t('rdsDeviceStatistic.selTip_1')">
                            <Option value="0"> {{$t('tboardDetail.pass')}} </Option>
                            <Option value="1"> {{$t('tboardDetail.fail')}} </Option>
                            <Option value="-1"> {{$t('tboardDetail.invalid')}} </Option>
                        </Select>
                        <Select v-model="invalidType" v-show="resultRange.length===1&&resultRange[0]==='-1'&&invalidList.length>0" clearable style="width:230px;margin-left: 16px;" :transfer="true" :placeholder="$t('rdsDeviceStatistic.selTip_2')">
                            <Option v-for="item in invalidList" :value="item.job_assessment_value"> {{ item.job_assessment_value }} ({{ item.count }}) </Option>
                        </Select>
                        <Select v-model="filterType" v-show="resultRange.length===1&&resultRange[0]==='1'" clearable style="width:230px;margin-left: 16px;" :transfer="true" :placeholder="$t('rdsTboardDeviceStatistic.tips_1')">
                            <Option value="serious">{{$t('rdsDeviceStatistic.seriousFail')}}</Option>
                        </Select>
                        <p style="float: right">
                            <Tag type="dot" color="#1bbc9c">{{$t('tboardDetail.pass')}}</Tag>
                            <Tag type="dot" color="#FFAE25">{{$t('tboardDetail.fail')}}</Tag>
                            <Tag type="dot" color="#F75F0D">{{$t('rdsDeviceStatistic.seriousFail')}}</Tag>
                            <Tag type="dot" color="#BDC3C7">{{$t('tboardDetail.invalid')}}</Tag>
                        </p>
                    </div>
                    <comp-rds-card ref="rdsCard" v-if="deviceId!==null"
                                   :prop-device-id="deviceId"
                                   :prop-job-id="jobId"
                                   :update-rds="updateRds"
                                   :prop-tboard-id="propTboardId"
                                   :prop-result-range="resultRange"
                                   :prop-invalid-type="invalidType"
                                   :prop-filter-type="filterType"
                                   @after-load-data="afterLoadData"
                                   @rds-mouse-enter="onRdsMouseEnter"
                                   @rds-mouse-leave="onRdsMouseLeave">
                    </comp-rds-card>
                    <div v-show="scrollMore" style="position: relative;height: 50px;">
                        <Spin fix>
                            <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                            <div>Loading</div>
                        </Spin>
                    </div>
                    <p v-show="!noMoreData" style="text-align: center" @click="onClickLoadMore"><Button>{{$t('rdsTboardDeviceStatistic.btn')}}</Button></p>
                    <p v-show="noMoreData" style="text-align: center">{{$t('rdsDeviceStatistic.noMore')}}</p>
                </div>
            </Card>
        </div>

        <Spin size="large" class="spin-tab" fix v-show="showLoading"></Spin>
        <Modal v-model="showDeviceDetail" transfer :closable="false" footer-hide :styles="{top: '16px'}">
            <comp-device-detail ref="deviceDetail"></comp-device-detail>
        </Modal>
        <Modal v-model="showJobDetail" transfer :closable="false" footer-hide :styles="{top: '16px'}">
            <comp-job-detail ref="jobDetail" :prop-close-btn="false"></comp-job-detail>
        </Modal>

    </div>
</template>


<script>
    import CompRdsCard from "../components/CompRdsCard";
    import CompDynamicLoadingChart from "../components/CompDynamicLoadingChart";
    import CompStatisticPie from "../components/CompStatisticPie";
    import CompCalendarFigure from "../components/CompCalendarFigure";
    import CompDeviceDetail from "../components/CompDeviceDetail";
    import CompJobDetail from "../components/CompJobDetail";
    import utils from "../lib/utils";

    export default {
        components:{ CompRdsCard, CompDynamicLoadingChart, CompStatisticPie, CompCalendarFigure, CompDeviceDetail, CompJobDetail },
        props:{
            propFilterDateRange:{
                type: Array,
                default:()=>{ return []}
            },
            propJobUrl:{
                type:String,
            },
            propTboardId:{
                type:Number,
            },
            propType:{
                type:Number,
                default:1   //1：失败 2：无效
            }
        },
        data(){
            return{
                totalCount:{
                    failureRate:0,
                    invalidRate:0,
                    total:0,
                    fail:0,
                    pass:0,
                    invalid:0
                },
                resultRange:[],
                scrollMore:false,
                noMoreData:false,
                showDeviceDetail:false,
                showJobDetail:false,
                jobUrl:"",
                deviceId:null,
                deviceLabel:"",
                jobId:-1,
                jobName:"",
                pieData:[],
                pieFailure:null,
                showLoading:false,
                updateRds:"",
                invalidType:'',
                filterType:'',
                invalidList:[],
            }
        },
        methods:{
            afterLoadData(flag){
                this.scrollMore = false
                this.noMoreData = !flag
            },
            onRdsMouseEnter(rds) {
                this.$emit("rds-mouse-enter",rds)
            },
            onRdsMouseLeave() {
                this.$emit("rds-mouse-leave")
            },
            afterJobDataLoading(id,na,success,fail,total,na_ratio,fail_ratio,label,name){
                this.jobId = id
                this.jobName = name
                this.totalCount = {
                    failureRate:fail_ratio,
                    invalidRate:na_ratio,
                    total:total,
                    fail:fail,
                    pass:success,
                    invalid:na
                }
                this.pieData = []
                this.pieData.push(success,fail,na)
                let type = "fail_ratio"
                if(this.propType===2)
                    type = "na_ratio"
                if(id)
                    this.jobUrl = "api/v1/cedar/get_data_view/?tboard_id="+ this.propTboardId  +"&job_id=" + id +
                        "&group_by=device&page=0&ordering=-" + type
                else
                    this.jobUrl = ""
                this.showLoading = false
            },
            onJobChartClick(id,na,success,fail,total,na_ratio,fail_ratio,label,name){
                this.jobId = id
                this.jobName = name
                this.totalCount = {
                    failureRate:fail_ratio,
                    invalidRate:na_ratio,
                    total:total,
                    fail:fail,
                    pass:success,
                    invalid:na
                }
                this.pieData = []
                this.pieData.push(success,fail,na)
                let type = "fail_ratio"
                if(this.propType===2)
                    type = "na_ratio"
                this.jobUrl = "api/v1/cedar/get_data_view/?tboard_id="+ this.propTboardId + "&job_id=" + id +
                    "&group_by=device&page=0&ordering=-" + type
            },
            afterDeviceDataLoading(id,na,success,fail,total,na_ratio,fail_ratio,label){
                this.deviceId = id
                this.deviceLabel = label
                this.updateRds = this.jobId + " "+ this.deviceId
                this.getInvalidList()
            },
            onDeviceChartClick(id,na,success,fail,total,na_ratio,fail_ratio,label){
                this.deviceId = id
                this.deviceLabel = label
                this.updateRds = this.jobId + " "+ this.deviceId
                this.getInvalidList()
            },
            onClickLoadMore(){
                this.scrollMore = true
                this.$refs.rdsCard.loadMoreData(false)
            },
            getInvalidList(){
                this.$ajax.post("api/v1/cedar/filter_invalid_rds/",{
                    device_id:this.deviceId,
                    tboard_id: this.propTboardId,
                    job_id: this.jobId
                }).then(response=>{
                    this.invalidList = response.data
                }).catch(error=>{
                    this.$Message.error(this.$t('rdsTboardDeviceStatistic.error'))
                })
            },

        },
        watch:{
            propJobUrl:{
                handler: function(){
                    this.showLoading = true
                },
                immediate: true
            }
        },
        mounted(){

        }
    }

</script>


<style lang="less" scoped>
    .iconTip{
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-left: 20px;
    }
    .ivu-spin-fix{
        left: inherit;
    }
</style>
