<template>
    <div>
        <!--   用例 统计 部分   -->
        <Card :bordered="false">
            <div v-show="jobId!== null ">
                <p style="text-align: center;font-size: 16px;font-weight: bold;padding-top: 20px;">用例统计情况</p>
                <comp-dynamic-loading-chart :device-id="-11" :prop-url="propJobUrl" :prop-type="propType"
                                            @after-load-data="afterJobDataLoading"
                                            @on-chart-click="onJobChartClick" >
                </comp-dynamic-loading-chart>
            </div>
            <div v-show="jobId===null" style="font-size: 12px;text-align: center">
                暂无数据信息！
            </div>
        </Card>
        <!--   用例下的设备统计    -->
        <Card style="margin: 16px 0;" :bordered="false" v-if="jobUrl.length>0">
            <p style="margin-left: 20px;font-size: 14px;font-weight: bold;">设备统计</p>
            <p style="margin-left: 20px;font-size: 12px">用例：{{ jobName }}<a href="javascript:" style="margin-left: 10px" @click="showJobDetail=true;$refs.jobDetail.refresh(jobId)">用例详情</a></p>
            <div style="width: 280px;float: left;padding: 10px;margin-top: 50px">
                <comp-statistic-pie :prop-data="pieData" :prop-failure="totalCount.failureRate" :prop-id="-11" :prop-invalid-rate="totalCount.invalidRate" :prop-type="propType"></comp-statistic-pie>
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
                <p style="text-align: center;font-size: 16px;font-weight: bold">{{ jobName }} 设备统计情况</p>
                <comp-dynamic-loading-chart ref="jobChart" :prop-width="400" :prop-url="jobUrl" :device-id="-22" :prop-type="propType"
                                            @after-load-data="afterDeviceDataLoading"
                                            @on-chart-click="onDeviceChartClick" ></comp-dynamic-loading-chart>
            </div>

        </Card>

        <!--  RDS部分 -->
        <Card :bordered="false" style="overflow:hidden;" v-if="deviceId!==null&&jobUrl.length>0">
            <p style="margin-left: 20px;font-size: 14px;font-weight: bold;">数据日历</p>
            <p style="margin-left: 20px;font-size: 12px">用例：【{{ jobName }}】    设备：【{{ deviceLabel }}】<a href="javascript:" style="margin-left: 10px" @click="showDeviceDetail=true;$refs.deviceDetail.refresh(deviceId)">设备详情</a></p>
            <div style="width: 280px;float: left;padding: 10px;">
                <RadioGroup v-model="date" type="button" size="small">
                    <Radio style="width: 100px;text-align: center;" :label="1">日</Radio>
                    <Radio style="width: 100px;text-align: center;" :label="2">月</Radio>
                </RadioGroup>
                <DatePicker v-show="date===1" v-model="filterDate" class="index-time" type="date" open :options="options"></DatePicker>
                <DatePicker v-show="date===2" v-model="monthData" class="index-time" type="month" open :options="monthOptions"></DatePicker>
            </div>
            <div style="margin-left: 280px">
                <div v-show="date===1">
                    <p style="text-align: center;font-size: 16px;font-weight: bold">{{ filterDate.format("yyyy年MM月dd日") }}</p>
                    <div style="margin: 20px 0;">
                        <Select v-model="resultRange" multiple style="width:230px" placeholder="请选择测试结果类型">
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
                    <comp-rds-card ref="rdsCard" v-if="deviceId!==null"
                                   :prop-device-id="deviceId"
                                   :prop-job-id="jobId"
                                   :prop-filter-date-range="filterDateOne"
                                   :prop-result-range="resultRange"
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
                    <p v-show="noMoreData" style="text-align: center">暂无更多数据</p>
                </div>

                <div v-if="date===2">
                    <p style="text-align: center;font-size: 16px;font-weight: bold">{{ propType===1 ? monthData.format("yyyy年MM月")+" 失败数据" : monthData.format("yyyy年MM月")+" 无效数据" }}</p>
                    <comp-calendar-figure :prop-month="monthData"
                                          :prop-id="-1"
                                          :prop-type="propType"
                                          :prop-device-id="deviceId"
                                          :prop-job-id="jobId"
                                          :prop-filter-date-range="propFilterDateRange"
                                          @on--click="onCalendarClick">
                    </comp-calendar-figure>
                </div>
            </div>
        </Card>

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
            propDeviceIds:{
                type:String,
                default:""
            },
            propType:{
                type:Number,
                default:1   //1：失败 2：无效
            }
        },
        data(){
            return{
                totalCount:{
                    failureRate:0.28,
                    total:15735,
                    fail:578,
                    pass:15132,
                    invalid:24
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
                deviceId:null,
                deviceLabel:"",
                jobId:-1,
                jobName:"",
                pieData:[],
                pieFailure:null,
                showLoading:false,

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
                    this.jobUrl = "api/v1/cedar/get_data_view/?job_id=" + id +
                        "&devices="+ this.propDeviceIds +
                        "&group_by=device&page=0&ordering=-" + type +
                        "&start_date="+ this.propFilterDateRange[0].format("yyyy-MM-dd") +
                        "&end_date="+ this.propFilterDateRange[1].format("yyyy-MM-dd")
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
                this.jobUrl = "api/v1/cedar/get_data_view/?job_id=" + id +
                    "&devices="+ this.propDeviceIds +
                    "&group_by=device&page=0&ordering=-" + type +
                    "&start_date="+ this.propFilterDateRange[0].format("yyyy-MM-dd") +
                    "&end_date="+ this.propFilterDateRange[1].format("yyyy-MM-dd")
            },
            afterDeviceDataLoading(id,na,success,fail,total,na_ratio,fail_ratio,label){
                this.deviceId = id
                this.deviceLabel = label
            },
            onDeviceChartClick(id,na,success,fail,total,na_ratio,fail_ratio,label){
                this.deviceId = id
                this.deviceLabel = label
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
            propJobUrl:{
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


<style lang="less" scoped>
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
    .ivu-spin-fix{
        left: inherit;
    }
</style>