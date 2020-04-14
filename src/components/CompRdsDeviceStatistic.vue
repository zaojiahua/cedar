<template>
    <div>
        <!--   设备 统计 部分   -->
        <Card :bordered="false">
            <p style="text-align: center;font-size: 16px;font-weight: bold;padding-top: 20px;">设备统计情况</p>
            <comp-dynamic-loading-chart :device-id="-1"></comp-dynamic-loading-chart>
        </Card>
        <!--   设备下的用例统计    -->
        <Card style="margin: 16px 0;" :bordered="false">
            <p style="margin-left: 20px;font-size: 14px;font-weight: bold;">用例统计</p>
            <p style="margin-left: 20px;font-size: 12px">设备：cactus---mt6765---65a4066f7d29<a href="javascript:" style="margin-left: 10px">设备详情</a></p>
            <div style="width: 280px;float: left;padding: 10px;margin-top: 30px">
                <comp-statistic-pie></comp-statistic-pie>
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
                <p style="text-align: center;font-size: 16px;font-weight: bold">dev36 用例统计情况</p>
                <comp-dynamic-loading-chart></comp-dynamic-loading-chart>
            </div>

        </Card>

        <!--  RDS部分 -->

        <Card :bordered="false" style="overflow:hidden;">
            <p style="margin-left: 20px;font-size: 14px;font-weight: bold;">数据日历</p>
            <p style="margin-left: 20px;font-size: 12px">设备：【d1-02】    用例：【切换字体大小】<a href="javascript:" style="margin-left: 10px">用例详情</a></p>
            <div style="width: 280px;float: left;padding: 10px;">
                <RadioGroup v-model="date" type="button" size="small">
                    <Radio style="width: 100px;text-align: center;" :label="1">日</Radio>
                    <Radio style="width: 100px;text-align: center;" :label="2">月</Radio>
                </RadioGroup>
                <DatePicker v-model="filterDate" class="index-time" type="date" open :options="options"></DatePicker>
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
                    <comp-rds-card ref="rdsCard"
                                   :prop-device-id="propDevices[0].id"
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
                    <p style="text-align: center;font-size: 16px;font-weight: bold">2020年4月数据日历</p>
                    <comp-calendar-figure :prop-month="4" @on--click="onCalendarClick"></comp-calendar-figure>
                </div>


            </div>
        </Card>
    </div>
</template>


<script>
    import CompRdsCard from "../components/CompRdsCard";
    import CompDynamicLoadingChart from "../components/CompDynamicLoadingChart";
    import CompStatisticPie from "../components/CompStatisticPie";
    import CompCalendarFigure from "../components/CompCalendarFigure";
    import utils from "../lib/utils";

    export default {
        components:{ CompRdsCard, CompDynamicLoadingChart, CompStatisticPie, CompCalendarFigure, },
        props:{
            propDevices:{
                type: Array,
                default:()=>{ return []}
            },
            propFilterDateRange:{
                type: Array,
                default:()=>{ return []}
            }
        },
        data(){
            return{
                totalCount:{
                    failureRate:"3.6%",
                    total:15735,
                    fail:578,
                    pass:15132,
                    invalid:24
                },
                date:1,
                filterDate:new Date("2020-4-11"),
                filterDateOne:[],
                resultRange:[],
                loadingMoreRdsData:false,
                scrollMore:false,
                noMoreData:false,
                options: {},

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
        },
        mounted(){
            this.options.disabledDate = (date)=> {
                //判断面板上的时间是否在选定的时间范围（start-end）外，若结果返回true，则该时间点要被禁用，返回false，则该时间点可以被选择
                return date&&( date.valueOf() >this.propFilterDateRange[1] || date.valueOf() < this.propFilterDateRange[0]);
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