<template>
    <div>
        <!--   设备 统计 部分   -->
        <Card :bordered="false" >
            <div v-show="deviceId!== null">
                <p style="text-align: center;font-size: 16px;font-weight: bold;padding-top: 20px;">{{$t('rdsDeviceStatistic.deviceTitle')}}</p>
                <comp-dynamic-loading-chart :device-id="-1" :prop-url="propDeviceUrl" :prop-type="propType"
                                            @after-load-data="afterDeviceDataLoading"
                                            @on-chart-click="onDeviceChartClick" >
                </comp-dynamic-loading-chart>
            </div>
            <div v-show="deviceId===null" style="font-size: 12px;text-align: center">
                {{$t('rdsDeviceStatistic.nodata')}}
            </div>

        </Card>
        <!--   设备下的用例统计    -->
        <Card style="margin: 16px 0;" :bordered="false" v-if="jobUrl.length>0">
            <p style="margin-left: 20px;font-size: 14px;font-weight: bold;">{{$t('rdsDeviceStatistic.jobStatistic')}}</p>
            <p style="margin-left: 20px;font-size: 12px">{{$t('rdsDeviceStatistic.dev')}}：{{ deviceLabel }}<a href="javascript:" style="margin-left: 10px" @click="showDeviceDetail=true;$refs.deviceDetail.refresh(deviceId)">{{$t('rdsDeviceStatistic.devInfo')}}</a></p>
            <div style="width: 280px;float: left;padding: 10px;margin-top: 50px">
                <comp-statistic-pie :prop-data="pieData" :prop-failure="totalCount.failureRate" :prop-invalid-rate="totalCount.invalidRate" :prop-id="-1" :prop-type="propType"></comp-statistic-pie>
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
                <p style="text-align: center;font-size: 16px;font-weight: bold">{{ deviceLabel }} {{$t('rdsDeviceStatistic.jobTitle')}}</p>
                <comp-dynamic-loading-chart ref="jobChart" :prop-width="400" :prop-url="jobUrl" :device-id="-2" :prop-type="propType"
                                            @after-load-data="afterJobDataLoading"
                                            @on-chart-click="onJobChartClick" ></comp-dynamic-loading-chart>
            </div>

        </Card>

        <!--  RDS部分 -->
        <Card :bordered="false" style="overflow:hidden;" v-if="jobId!==null&&jobUrl.length>0">
            <p style="margin-left: 20px;font-size: 14px;font-weight: bold;">{{$t('rdsDeviceStatistic.dataTip')}}</p>
            <p style="margin-left: 20px;font-size: 12px">{{$t('rdsDeviceStatistic.dev')}}：【{{ deviceLabel }}】    {{$t('rdsDeviceStatistic.job')}}：【{{ jobName }}】<a href="javascript:" style="margin-left: 10px" @click="showJobDetail=true;$refs.jobDetail.refresh(jobId)">{{$t('rdsDeviceStatistic.jobInfo')}}</a></p>
            <div style="width: 280px;float: left;padding: 10px;">
                <RadioGroup v-model="date" type="button" size="small">
                    <Radio style="width: 100px;text-align: center;" :label="1">{{$t('rdsDeviceStatistic.day')}}</Radio>
                    <Radio style="width: 100px;text-align: center;" :label="2">{{$t('rdsDeviceStatistic.month')}}</Radio>
                </RadioGroup>
                <DatePicker v-show="date===1" v-model="filterDate" class="index-time" style="width: 220px;" type="date" open :options="options"></DatePicker>
                <DatePicker v-show="date===2" v-model="monthData" class="index-time" style="width: 220px;" type="month" open :options="monthOptions"></DatePicker>
            </div>
            <div style="margin-left: 280px">
                <div v-show="date===1">
                    <p style="text-align: center;font-size: 16px;font-weight: bold">{{ filterDate.format($t('rdsDeviceStatistic.format_1')) }}</p>
                    <div style="margin: 20px 0;">
                        <Select v-model="resultRange" multiple style="width:230px" @on-change="invalidType=''" :transfer="true" :placeholder="$t('rdsDeviceStatistic.selTip_1')">
                            <Option value="0"> {{$t('tboardDetail.total')}} </Option>
                            <Option value="1"> {{$t('tboardDetail.fail')}} </Option>
                            <Option value="-1"> {{$t('tboardDetail.invalid')}} </Option>
                        </Select>
                        <Select v-model="invalidType" v-if="false" v-show="resultRange.length===1&&resultRange[0]==='-1'&&false" clearable style="width:230px;margin-left: 16px;" :transfer="true" :placeholder="$t('rdsDeviceStatistic.selTip_2')">
                            <Option value="2003"> 2003 </Option>
                            <Option value="7003"> 7003 </Option>
                            <Option value="7006"> 7006 </Option>
                        </Select>
                        <p style="float: right">
                            <Tag type="dot" color="#1bbc9c">{{$t('tboardDetail.total')}}</Tag>
                            <Tag type="dot" color="#FFAE25">{{$t('tboardDetail.fail')}}</Tag>
                            <Tag type="dot" color="#F75F0D">{{$t('rdsDeviceStatistic.seriousFail')}}</Tag>
                            <Tag type="dot" color="#BDC3C7">{{$t('tboardDetail.invalid')}}</Tag>
                        </p>
                    </div>
                    <comp-rds-card ref="rdsCard" v-if="jobId!==null"
                                   :prop-device-id="deviceId"
                                   :prop-job-id="jobId"
                                   :update-rds="updateRds"
                                   :prop-filter-date-range="filterDateOne"
                                   :prop-result-range="resultRange"
                                   :prop-invalid-type="invalidType"
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
                    <p v-show="noMoreData" style="text-align: center">{{$t('rdsDeviceStatistic.noMore')}}</p>
                </div>

                <div v-if="date===2">
                    <p style="text-align: center;font-size: 16px;font-weight: bold">{{ propType===1 ? monthData.format($t('rdsDeviceStatistic.format_2'))+" "+$t('rdsDeviceView.failData') : monthData.format($t('rdsDeviceStatistic.format_2'))+" "+$t('rdsDeviceView.invalidData') }}</p>
                    <comp-calendar-figure :prop-month="monthData"
                                          :prop-id="1"
                                          :prop-type="propType"
                                          :prop-device-id="deviceId"
                                          :prop-job-id="jobId"
                                          :prop-filter-date-range="propFilterDateRange"
                                          @on--click="onCalendarClick">
                    </comp-calendar-figure>
                </div>


            </div>
        </Card>

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
            propDeviceUrl:{
                type:String,
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
                date:2,
                filterDate:this.propFilterDateRange[1],
                filterDateOne:[],
                resultRange:[],
                loadingMoreRdsData:false,
                scrollMore:false,
                noMoreData:false,
                options: {},
                monthOptions: {},
                monthData: _.cloneDeep(this.propFilterDateRange[1]),
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
                updateRds:"",
                invalidType:'',

            }
        },
        methods:{
            afterLoadData(flag){
                this.loadingMoreRdsData = flag
                this.scrollMore = false
                this.noMoreData = !flag
            },
            onRdsMouseEnter(rds) {
                this.$emit("rds-mouse-enter",rds)
            },
            onRdsMouseLeave() {
                this.$emit("rds-mouse-leave")
            },
            onCalendarClick(time){
                this.date = 1
                this.filterDate = new Date(time)
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
                },
                this.pieData = []
                this.deviceId = id
                this.pieData.push(success,fail,na)
                let type = "fail_ratio"
                if(this.propType===2)
                    type = "na_ratio"
                if(id)
                    this.jobUrl = "api/v1/cedar/get_data_view/?device_id=" + id +
                    "&group_by=job&page=0&ordering=-" + type +
                    "&start_date="+ this.propFilterDateRange[0].format("yyyy-MM-dd") +
                    "&end_date="+ this.propFilterDateRange[1].format("yyyy-MM-dd")
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
                },
                this.pieData = []
                this.deviceId = id
                this.pieData.push(success,fail,na)
                let type = "fail_ratio"
                if(this.propType===2)
                    type = "na_ratio"
                this.jobUrl = "api/v1/cedar/get_data_view/?device_id=" + id +
                    "&group_by=job&page=0&ordering=-" + type +
                    "&start_date="+ this.propFilterDateRange[0].format("yyyy-MM-dd") +
                    "&end_date="+ this.propFilterDateRange[1].format("yyyy-MM-dd")
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
            }

        },
        watch:{
            filterDate:{
                handler: function(val){
                    this.filterDateOne = []
                    this.filterDateOne.push(val)
                    this.filterDateOne.push(val)
                },
                immediate: true
            },
            propFilterDateRange:{
                handler: function(val){
                    this.filterDate = val[1]
                    this.monthData = val[1]
                },
                immediate: true
            },
            propDeviceUrl:{
                handler: function(){
                    this.showLoading = true
                },
                immediate: true
            }
        },
        mounted(){
            this.options.disabledDate = (date)=> {
                //判断面板上的时间是否在选定的时间范围（start-end）外，若结果返回true，则该时间点要被禁用，返回false，则该时间点可以被选择
                return date&&( date.valueOf() >this.propFilterDateRange[1] || date.valueOf() < this.propFilterDateRange[0]);
            }

            this.monthOptions.disabledDate = (date)=> {
                let start = _.cloneDeep(this.propFilterDateRange[0]).format("yyyy-MM-dd")
                let str = start.split('-')
                str[2] = "01"
                let startMonth = str.join("-")
                //判断面板上的时间是否在选定的时间范围（start-end）外，若结果返回true，则该时间点要被禁用，返回false，则该时间点可以被选择
                return date&&( date.valueOf() >this.propFilterDateRange[1] || date.valueOf() < new Date(startMonth)- 86400000);
            }

        }
    }


</script>


<style lang="less">
    //DatePicker 样式改变
    .index-time {
        .ivu-date-picker-rel {
            display: none;
        }
        .ivu-select-dropdown {
            position:static!important;
        }
    }
    .iconTip{
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-left: 20px;
    }
</style>
