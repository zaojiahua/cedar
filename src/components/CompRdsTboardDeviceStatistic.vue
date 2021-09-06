<template>
    <div>
        <!--   设备 统计 部分   -->
        <Card :bordered="false" >
            <div v-show="deviceId!== null">
                <p style="text-align: center;font-size: 16px;font-weight: bold;padding-top: 20px;">设备统计情况</p>
                <comp-dynamic-loading-chart :device-id="-10" :prop-url="propDeviceUrl" :prop-type="propType"
                                            @after-load-data="afterDeviceDataLoading"
                                            @on-chart-click="onDeviceChartClick" >
                </comp-dynamic-loading-chart>
            </div>
            <div v-show="deviceId===null" style="font-size: 12px;text-align: center">
                暂无数据信息！
            </div>
        </Card>

        <!--   设备下的用例统计    -->
        <Tabs v-model="tabName"  name="failStatics" style="margin-top: 16px;background: #fff">
            <TabPane label="测试轨迹" name="testInfo" tab="failStatics">
                <Card v-if="tabName==='testInfo'" :dis-hover="true" :bordered="false">
                    <p style="font-size: 12px">设备：{{ deviceLabel }}<a href="javascript:" style="margin-left: 10px" @click="showDeviceDetail=true;$refs.deviceDetail.refresh(deviceId)">设备详情</a></p>
                    <p class="b_tip">温度曲线</p>
                    <Row>
                        <comp-temperature-histogram :device-id="deviceId" ref="tempHistogram"></comp-temperature-histogram>
                    </Row>
                    <p class="b_tip">电量曲线</p>
                    <Row>
                        <comp-battery-level-histogram :device-id="deviceId" ref="powerHistogram"></comp-battery-level-histogram>
                    </Row>
                    <p class="b_tip">测试结果</p>
                    <!--  RDS部分 -->
                    <div style="overflow:hidden;">
                        <div>
                            <div style="margin: 5px 0 20px 0">
                                <Select v-model="resultRange" multiple style="width:230px" @on-change="invalidType=''" :transfer="true" placeholder="请选择测试结果类型">
                                    <Option value="0"> 通过 </Option>
                                    <Option value="1"> 未通过 </Option>
                                    <Option value="-1"> 无效 </Option>
                                </Select>
                                <Select v-model="invalidType" v-show="resultRange.length===1&&resultRange[0]==='-1'" clearable style="width:230px;margin-left: 16px;" :transfer="true" placeholder="请选择无效类型">
                                    <Option value="2003"> 2003 </Option>
                                    <Option value="7003"> 7003 </Option>
                                    <Option value="7006"> 7006 </Option>
                                </Select>
                                <p style="float: right">
                                    <Tag type="dot" color="#1bbc9c">通过</Tag>
                                    <Tag type="dot" color="#FFAE25">未通过</Tag>
                                    <Tag type="dot" color="#BDC3C7">无效</Tag>
                                </p>
                            </div>
                            <comp-rds-card ref="rdsCard1"
                                           :prop-device-id="deviceId"
                                           :prop-tboard-id="propTboardId"
                                           :prop-result-range="resultRange"
                                           :prop-invalid-type="invalidType"
                                           @after-load-data="afterLoadData1"
                                           @rds-mouse-enter="onRdsMouseEnter"
                                           @rds-mouse-leave="onRdsMouseLeave">
                            </comp-rds-card>
                            <div v-show="scrollMore1" style="position: relative;height: 50px;">
                                <Spin fix>
                                    <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                                    <div>Loading</div>
                                </Spin>
                            </div>
                            <p v-show="!noMoreData1" style="text-align: center" @click="onClickLoadMore1"><Button>点击加载更多</Button></p>
                            <p v-show="noMoreData1" style="text-align: center">暂无更多数据</p>
                        </div>
                    </div>

                </Card>
            </TabPane>
            <TabPane label="设备运行结果" name="deviceResult" tab="failStatics">
                <Card :dis-hover="true" :bordered="false" v-if="jobUrl.length>0">
                    <p style="font-size: 12px">设备：{{ deviceLabel }}<a href="javascript:" style="margin-left: 10px" @click="showDeviceDetail=true;$refs.deviceDetail.refresh(deviceId)">设备详情</a></p>
                    <div style="width: 280px;float: left;padding: 10px;margin-top: 50px">
                        <comp-statistic-pie :prop-data="pieData" :prop-failure="totalCount.failureRate" :prop-invalid-rate="totalCount.invalidRate" :prop-id="-10" :prop-type="propType"></comp-statistic-pie>
                        <div style="font-size: 12px">
                            <Row>
                                <Col span="12">
                                    <span class="iconTip" style="background: #2D8cF0"></span> 总共： {{ totalCount.total }}
                                </Col>
                                <Col span="12">
                                    <span class="iconTip" style="background: #f5a623"></span> 失败： {{ totalCount.fail }}
                                </Col>
                            </Row>
                            <Row style="margin-top: 5px;">
                                <Col span="12">
                                    <span class="iconTip" style="background: #999"></span> 无效： {{ totalCount.invalid }}
                                </Col>
                                <Col span="12">
                                    <span class="iconTip" style="background: #1bbc9c"></span> 通过： {{ totalCount.pass }}
                                </Col>
                            </Row>
                        </div>
                    </div>
                    <div style="margin-left: 280px">
                        <p style="text-align: center;font-size: 16px;font-weight: bold">{{ deviceLabel }} 用例统计情况</p>
                        <comp-dynamic-loading-chart ref="jobChart" :prop-width="400" :prop-url="jobUrl" :device-id="-20" :prop-type="propType"
                                                    @after-load-data="afterJobDataLoading"
                                                    @on-chart-click="onJobChartClick" ></comp-dynamic-loading-chart>
                    </div>
                </Card>

                <Divider orientation="left" style="margin-bottom: 0">测试结果</Divider>

                <!--  RDS部分 -->
                <Card :bordered="false" :dis-hover="true" style="overflow:hidden;" v-if="jobId!==null&&jobUrl.length>0">
                    <p style="font-size: 12px">设备：【{{ deviceLabel }}】    用例：【{{ jobName }}】<a href="javascript:" style="margin-left: 10px" @click="showJobDetail=true;$refs.jobDetail.refresh(jobId)">用例详情</a></p>
                    <div>
                        <div style="margin: 20px 0;">
                            <Select v-model="resultRange2" multiple style="width:230px" @on-change="invalidType2=''" :transfer="true" placeholder="请选择测试结果类型">
                                <Option value="0"> 通过 </Option>
                                <Option value="1"> 未通过 </Option>
                                <Option value="-1"> 无效 </Option>
                            </Select>
                            <Select v-model="invalidType2" v-show="resultRange2.length===1&&resultRange2[0]==='-1'" clearable style="width:230px;margin-left: 16px;" :transfer="true" placeholder="请选择无效类型">
                                <Option value="2003"> 2003 </Option>
                                <Option value="7003"> 7003 </Option>
                                <Option value="7006"> 7006 </Option>
                            </Select>
                            <p style="float: right">
                                <Tag type="dot" color="#1bbc9c">通过</Tag>
                                <Tag type="dot" color="#FFAE25">未通过</Tag>
                                <Tag type="dot" color="#BDC3C7">无效</Tag>
                            </p>
                        </div>
                        <comp-rds-card ref="rdsCard" v-if="jobId!==null"
                                       :prop-device-id="deviceId"
                                       :prop-job-id="jobId"
                                       :update-rds="updateRds"
                                       :prop-tboard-id="propTboardId"
                                       :prop-result-range="resultRange2"
                                       :prop-invalid-type="invalidType2"
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
                        <p v-show="!noMoreData" style="text-align: center" @click="onClickLoadMore"><Button>点击加载更多</Button></p>
                        <p v-show="noMoreData" style="text-align: center">暂无更多数据</p>
                    </div>
                </Card>
            </TabPane>
        </Tabs>

        <Spin size="large" fix v-if="showLoading"></Spin>
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
    import CompDeviceDetail from "../components/CompDeviceDetail";
    import CompJobDetail from "../components/CompJobDetail";
    import CompTemperatureHistogram from "./CompTemperatureHistogram";
    import CompBatteryLevelHistogram from "./CompBatteryLevelHistogram";
    import utils from "../lib/utils";

    export default {
        components:{ CompRdsCard, CompDynamicLoadingChart, CompStatisticPie, CompDeviceDetail, CompJobDetail, CompTemperatureHistogram, CompBatteryLevelHistogram },
        props:{
            propDeviceUrl:{
                type:String,
            },
            propType:{
                type:Number,
                default:1   //1：失败 2：无效
            },
            propTboardId:{
                type:Number,
            },
            propFilterDateRange:{
                type: Array,
                default:()=>{ return []}
            },
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
                resultRange2:[],
                scrollMore:false,
                noMoreData:false,
                scrollMore1:false,
                noMoreData1:false,
                showDeviceDetail:false,
                showJobDetail:false,
                jobUrl:"",
                deviceId:-1,
                deviceLabel:"",
                jobId:null,
                jobName:"",
                pieData:[],
                pieFailure:null,
                showLoading:false,
                tabName:"testInfo",
                invalidType:'',
                invalidType2:'',
                updateRds:"",
            }
        },
        methods:{
            afterLoadData(flag){
                this.scrollMore = false
                this.noMoreData = !flag
            },
            afterLoadData1(flag){
                this.scrollMore1 = false
                this.noMoreData1 = !flag
            },
            onRdsMouseEnter(rds) {
                this.$emit("rds-mouse-enter",rds)
            },
            onRdsMouseLeave() {
                this.$emit("rds-mouse-leave")
            },
            afterDeviceDataLoading(id,na,success,fail,total,na_ratio,fail_ratio,label){
                this.deviceLabel = label
                this.totalCount = {
                    failureRate:fail_ratio,
                    invalidRate:na_ratio,
                    total:total,
                    fail:fail,
                    pass:success,
                    invalid:na
                }
                this.pieData = []
                this.deviceId = id
                this.pieData.push(success,fail,na)
                let type = "fail_ratio"
                if(this.propType===2)
                    type = "na_ratio"
                if(id)
                    this.jobUrl = "api/v1/cedar/get_data_view/?tboard_id="+ this.propTboardId +"&device_id=" + id +
                        "&group_by=job&page=0&ordering=-" + type
                else
                    this.jobUrl = ""
                this.showLoading = false
            },
            onDeviceChartClick(id,na,success,fail,total,na_ratio,fail_ratio,label){
                this.deviceLabel = label
                this.totalCount = {
                    failureRate:fail_ratio,
                    invalidRate:na_ratio,
                    total:total,
                    fail:fail,
                    pass:success,
                    invalid:na
                }
                this.pieData = []
                this.deviceId = id
                this.pieData.push(success,fail,na)
                let type = "fail_ratio"
                if(this.propType===2)
                    type = "na_ratio"
                this.jobUrl = "api/v1/cedar/get_data_view/?tboard_id="+ this.propTboardId + "&device_id=" + id +
                    "&group_by=job&page=0&ordering=-" + type
            },
            afterJobDataLoading(id,na,success,fail,total,na_ratio,fail_ratio,label,name){
                this.jobId = id
                this.jobName = name
                this.updateRds = this.deviceId + " "+ this.jobId
            },
            onJobChartClick(id,na,success,fail,total,na_ratio,fail_ratio,label,name){
                this.jobId = id
                this.jobName = name
                this.updateRds = this.deviceId + " "+ this.jobId
            },
            onClickLoadMore(){
                this.scrollMore = true
                this.$refs.rdsCard.loadMoreData(false)
            },
            onClickLoadMore1(){
                this.scrollMore1 = true
                this.$refs.rdsCard1.loadMoreData(false)
            }

        },
        watch:{
            propDeviceUrl:{
                handler: function(){
                    this.showLoading = true
                },
                immediate: true
            },
            tabName:{
                handler: function(val){
                    if(val==="testInfo")
                    this.$nextTick(function () {
                        this.$refs.tempHistogram.refresh(this.propFilterDateRange[0],this.propFilterDateRange[1])
                        this.$refs.powerHistogram.refresh(this.propFilterDateRange[0],this.propFilterDateRange[1])
                    })
                },
                // immediate: true
            },
            deviceId:{
                handler: function(){
                    if(this.tabName==="testInfo"){
                        this.$refs.tempHistogram.refresh(this.propFilterDateRange[0],this.propFilterDateRange[1])
                        this.$refs.powerHistogram.refresh(this.propFilterDateRange[0],this.propFilterDateRange[1])
                    }
                }
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
    .b_tip{
        padding-left: 10px;
        margin: 20px 0 10px 0;
        border-left: 3px solid #1bbc9c;
        font-size: 16px;
    }
</style>
