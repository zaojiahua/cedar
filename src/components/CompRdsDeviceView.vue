<template>
    <div class="content">
        <Modal v-model="showSelectDeviceModal" :fullscreen="true" :closable="false"
               @on-ok="getDeviceSelection">
            <comp-device-list ref="selectDevice" :prop-add-mode="false" :prop-multi-select="true"
                              @on-row-click="onSelectDeviceModalRowClick"></comp-device-list>
        </Modal>


        <Row v-show="devices.length === 0" style="margin-bottom: 16px;">
            <DatePicker v-model="filterDateRange" type="daterange" placeholder="测试开始时间" :transfer="true"></DatePicker>
            <p style="color: rgb(194, 194, 194);margin-top: 10px;">默认选择最近三天的数据 <a href="#" style="margin-left: 10px;">设置</a></p>
        </Row>
        <Row v-show="devices.length === 0" style="margin-top: 100px;text-align: center">
            <Button type="primary" @click="openDeviceList">选取设备</Button>
            <p style="color: rgb(194, 194, 194); font-size: larger; font-weight: bold;margin-top: 16px;">您还没有选择任何设备!</p>
        </Row>
        <div v-if="devices.length !== 0">
            <!--     总数据统计     -->
            <div>
                <div class="count-left">
                    <Row style="margin-left: 20px">
                        <p>总失败率</p>
                        <p style="font-size: 36px;font-weight: bold">{{ totalCount.failureRate }}</p>
                    </Row>
                    <Row class="progress" style="margin: 10px 20px">
                        <span :style="{ width: 220*computeWidth(totalCount.fail)+'px',background:'#f5a623' }"></span>
                        <span :style="{ width: 220*computeWidth(totalCount.invalid)+'px',background:'#999'}"></span>
                        <span :style="{ width: 220*computeWidth(totalCount.pass)+'px',background:'#1bbc9c'}"></span>
                    </Row>
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
                <Card style="height: 200px;margin-left: 295px" :bordered="false" dis-hover>
                    <p style="height: 32px;line-height:32px;margin-bottom: 6px;">
                        <span>设备列表</span>
                        <Button type="primary" style="float: right;" @click="openDeviceList">选取设备( {{ devices.length }} )</Button>
                        <DatePicker style="float: right;margin-right: 20px;" v-model="filterDateRange" type="daterange" placeholder="测试开始时间" :transfer="true"></DatePicker>
                    </p>
                    <div style="height: 130px;overflow: auto">
                        <Tag type="border" v-for="(item,index) in devices" :key="index" style="margin: 0 5px 5px 0"> {{ item.device_label }} </Tag>
                    </div>
                </Card>
            </div>
            <!--     设备/用例维度统计情况    -->
            <div style="margin-top: 16px;" class="device-statistic">
                <Tabs value="deviceStatistic" type="card" name="inside">
                    <TabPane label="设备统计" name="deviceStatistic" tab="inside">
                        <!--   设备 统计 部分   -->
                        <Card :bordered="false">
                            <p style="text-align: center;font-size: 16px;font-weight: bold;padding-top: 20px;">设备统计情况</p>
                            <comp-dynamic-loading-chart></comp-dynamic-loading-chart>
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
                                    <Radio style="width: 100px;text-align: center;" label="日"></Radio>
                                    <Radio style="width: 100px;text-align: center;" label="月"></Radio>
                                </RadioGroup>
                                <DatePicker v-model="filterDate" class="index-time" type="date" open ></DatePicker>
                            </div>
                            <div style="margin-left: 280px">
                                <p style="text-align: center;font-size: 16px;font-weight: bold">2020年4月7日</p>
                                <div style="margin-bottom: 20px;">
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
                                <!--<comp-rds-card></comp-rds-card>-->
                                <comp-rds-card ref="rdsCard" v-for="item in devices" :key="item.id"
                                               :prop-device-id="item.id"
                                               :prop-device-label="item.device_label"
                                               :prop-device-name="item.device_name"
                                               :prop-default-tboards="defaultTboards"
                                               :prop-default-jobs="defaultJobs"
                                               :prop-filter-date-range="filterDateRange"
                                               :prop-result-range="resultRange"
                                               @rds-mouse-enter="onRdsMouseEnter"
                                               @rds-mouse-leave="onRdsMouseLeave"></comp-rds-card>


                                <comp-rds-result-list></comp-rds-result-list>

                            </div>
                        </Card>






                    </TabPane>
                    <TabPane label="用例统计" name="jobStatistic" tab="inside">
                        <div style="height: 200px"></div>
                    </TabPane>
                </Tabs>
            </div>
        </div>

    </div>

</template>

<script>
    import CompDeviceList from "../components/CompDeviceList";
    import CompRdsCard from "../components/CompRdsCard";
    import CompDynamicLoadingChart from "../components/CompDynamicLoadingChart";
    import CompStatisticPie from "../components/CompStatisticPie";
    import CompRdsResultList from "../components/CompRdsResultList";
    import utils from "../lib/utils";

    export default {
        components: {CompDeviceList, CompRdsCard, CompDynamicLoadingChart, CompStatisticPie, CompRdsResultList, },
        data(){
            return{
                filterDateRange:['2019-04-01', '2020-04-15'],
                devices: [],
                showSelectDeviceModal:false,
                deviceSelection:[],
                totalCount:{
                    failureRate:"3.6%",
                    total:15735,
                    fail:578,
                    pass:15132,
                    invalid:24
                },
                date:"日",
                filterDate:null,

            }
        },
        methods:{
            onSelectDeviceModalRowClick(data, index) {
                this.$refs.selectDevice.toggleSelect(index)
            },
            getDeviceSelection() {
                this.devices = this.$refs.selectDevice.getSelection()
                this.deviceSelection = this.$refs.selectDevice.getThisSelection()    //记录当前选取设备的位置

                console.log(this.devices)
                console.log(this.deviceSelection)
            },
            openDeviceList(){
                this.showSelectDeviceModal=true
                this.$nextTick(function(){
                    this.$refs.selectDevice.setSelection(this.deviceSelection)
                })
            },
            computeWidth(count){
                if (count === 0)
                    return 0
                return count/this.totalCount.total
            }
        }

    }

</script>


<style lang="less">
    .content{
        height: calc(100vh - 150px);
        overflow-y: auto;
        overflow-x: hidden;
    }
    .iconTip{
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-left: 20px;
    }
    .progress span{
        display: inline-block;
        height:20px
    }
    .count-left{
        float: left;
        width: 280px;
        height:200px;
        padding: 20px 10px;
        background: #fff;
        border-radius: 5px;
    }

    .device-statistic .ivu-tabs-bar{
        margin-bottom: 0;
        border-bottom: none;
    }
    //DatePicker 样式改变
    .index-time {
        .ivu-date-picker-rel {
            display: none;
        }
        .ivu-select-dropdown {
            position:static!important;
        }
    }


</style>