<template>

    <div class="content" @scroll="onScroll">
        <Modal v-model="showSelectDeviceModal" :fullscreen="true" :closable="false"
               @on-ok="getDeviceSelection">
            <comp-device-list ref="selectDevice" :prop-add-mode="false" :prop-multi-select="true"
                              @on-row-click="onSelectDeviceModalRowClick"></comp-device-list>
        </Modal>

        <Row v-show="devices.length === 0" style="margin-bottom: 16px;">
            <DatePicker v-model="filterDateRange" type="daterange" placeholder="测试开始时间" :transfer="true" :clearable="false"></DatePicker>
            <p style="color: rgb(194, 194, 194);margin-top: 10px;">默认选择最近三天的数据 </p>
        </Row>
        <Row v-show="devices.length === 0" style="margin-top: 100px;text-align: center">
            <Button type="primary" @click="openDeviceList">选取设备</Button>
            <p style="color: rgb(194, 194, 194); font-size: larger; font-weight: bold;margin-top: 16px;">您还没有选择任何设备!</p>
        </Row>

        <div v-if="devices.length !== 0">
            <RadioGroup v-model="groupType" type="button">
                <Radio style="width: 100px;text-align: center;margin-bottom: 12px" :label="1">失败数据</Radio>
                <Radio style="width: 100px;text-align: center;margin-bottom: 12px" :label="2">无效数据</Radio>
            </RadioGroup>
            <Button type="primary" style="float: right;" @click="openDeviceList">选取设备( {{ devices.length }} )</Button>
            <DatePicker style="float: right;margin-right: 20px;" v-model="filterDateRange" type="daterange" placeholder="测试开始时间" :transfer="true" :clearable="false"></DatePicker>

        </div>

        <div v-if="devices.length !== 0">
            <!--     总数据统计     -->

            <div>
                <div class="count-left">
                    <Row style="margin-left: 10px">
                        <p>{{ groupType===1 ? "总失败率" : "总无效率" }}</p>
                        <p style="font-size: 36px;font-weight: bold">{{ groupType===1 ? totalCount.failureRate : totalCount.invalidRate }}</p>
                    </Row>
                    <Row class="progress" style="margin: 10px">
                        <div v-if="totalCount.total!==0">
                            <span :style="{ width: 260*computeWidth(totalCount.fail)+'px',background:'#f5a623' }"></span>
                            <span :style="{ width: 260*computeWidth(totalCount.invalid)+'px',background:'#999'}"></span>
                            <span :style="{ width: 260*computeWidth(totalCount.pass)+'px',background:'#1bbc9c'}"></span>
                        </div>
                        <span v-else style="width: 260px;background:#d7d7d7"></span>
                    </Row>
                    <Row>
                        <Col span="12">
                            <span class="icon-span" style="background: #2D8cF0"></span> 总共： {{ totalCount.total }}
                        </Col>
                        <Col span="12">
                            <span class="icon-span" style="background: #f5a623"></span> 失败： {{ totalCount.fail }}
                        </Col>
                    </Row>
                    <Row style="margin-top: 5px;">
                        <Col span="12">
                            <span class="icon-span" style="background: #999"></span> 无效： {{ totalCount.invalid }}
                        </Col>
                        <Col span="12">
                            <span class="icon-span" style="background: #1bbc9c"></span> 通过： {{ totalCount.pass }}
                        </Col>
                    </Row>
                </div>
                <Card style="height: 200px;margin-left: 315px" :bordered="false" dis-hover>
                    <p style="height: 32px;line-height:32px;margin-bottom: 6px;">
                        <span>设备列表</span>
                        <!--<Button type="primary" style="float: right;" @click="openDeviceList">选取设备( {{ devices.length }} )</Button>-->
                        <!--<DatePicker style="float: right;margin-right: 20px;" v-model="filterDateRange" type="daterange" placeholder="测试开始时间" :transfer="true" :clearable="false"></DatePicker>-->
                    </p>
                    <div style="height: 130px;overflow: auto">
                        <Tag type="border" v-for="(item,index) in devices" :key="index" style="margin: 0 5px 5px 0"> {{ item.device_label }} </Tag>
                    </div>
                </Card>
            </div>
            <!--     设备/用例维度统计情况    -->
            <div style="margin-top: 16px;" class="device-statistic"  v-if="devices.length !== 0&&groupType===1">
                <comp-rds-device-statistic ref="rdsDeviceStatistic"
                                           :prop-filter-date-range="filterDateRange"
                                           :prop-device-url="compDeviceUrl"
                                           @rds-mouse-enter="onRdsMouseEnter"
                                           @rds-mouse-leave="onRdsMouseLeave">
                </comp-rds-device-statistic>
            </div>

            <!--   无效数据  -->
            <div style="margin-top: 16px;" class="device-statistic" v-if="devices.length !== 0&&groupType===2">
                <comp-rds-device-statistic ref="rdsDeviceStatistic"
                                           :prop-filter-date-range="filterDateRange"
                                           :prop-device-url="compDeviceUrl"
                                           :prop-type="2"
                                           @rds-mouse-enter="onRdsMouseEnter"
                                           @rds-mouse-leave="onRdsMouseLeave">
                </comp-rds-device-statistic>
            </div>
            <!--   无效数据  -->

        </div>

        <div v-show="tipData.id" style="position: fixed; bottom: 2px; right: 2px; background-color: #434343; border-radius: 5px;opacity: 0.9; color: #ebf7ff; padding: 8px;">
            <span>ID：</span>
            <span>{{tipData.id}}</span>
            <br>
            <span>设备名称：</span>
            <span>{{tipData.device.device_name}}</span>
            <br>
            <span>用例名称：</span>
            <span>{{tipData.job.job_name}}</span>
            <br>
            <span>结果：</span>
            <span>{{tipData.job_assessment_value}}</span>
        </div>

    </div>
</template>

<script>
    import CompDeviceList from "../components/CompDeviceList";
    import CompRdsDeviceStatistic from "../components/CompRdsDeviceStatistic";
    import CompRdsJobStatistic from "../components/CompRdsJobStatistic";
    import utils from "../lib/utils";
    import config from "../lib/config";

    const tipDataSerializer = {
        id: "number",
        device: {
            device_name: "string"
        },
        job: {
            job_name: "string"
        },
        job_assessment_value: "string"
    }

    export default {
        components: {CompDeviceList, CompRdsDeviceStatistic, CompRdsJobStatistic },
        data(){
            return{
                compDeviceUrl:"",
                compJobUrl:"",
                filterDateRange:[new Date(new Date(new Date().getTime()-24*60*60*1000*6).setHours(0,0,0,0)), new Date()],
                devices: [],
                showSelectDeviceModal:false,
                deviceSelection:[],
                totalCount:{
                    failureRate:"3.6%",
                    invalidRate:"0%",
                    total:15735,
                    fail:578,
                    pass:15132,
                    invalid:24
                },
                tipData:utils.validate(tipDataSerializer, null),
                ids:"",
                groupType:1,

            }
        },
        methods:{
            onSelectDeviceModalRowClick(data, index) {
                this.$refs.selectDevice.toggleSelect(index)
            },
            getDeviceSelection() {
                this.devices = this.$refs.selectDevice.getSelection()
                this.deviceSelection = this.$refs.selectDevice.getThisSelection()    //记录当前选取设备的位置
                let ids = []
                this.devices.forEach(item=>{
                    ids.push(item.id)
                })
                this.ids = ids.join(",")
                this.setRequestUrl()
                this.getDeviceSummery()
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
            },
            onScroll(){
                // 滚动到页面底部时，请求下一部分内容
                let scroll = this.$el
                //滚动条滚动的距离    scroll.scrollTop
                //窗体高度    scroll.offsetHeight
                //整个文本的高度    scroll.scrollHeight
                if((scroll.offsetHeight + scroll.scrollTop - scroll.scrollHeight > -1) &&(this.$refs.rdsDeviceStatistic.$refs.rdsCard)&&this.$refs.rdsDeviceStatistic.loadingMoreRdsData===true){
                    this.$refs.rdsDeviceStatistic.scrollMore = true
                    this.$refs.rdsDeviceStatistic.loadingMoreRdsData = false
                    this.$refs.rdsDeviceStatistic.$refs.rdsCard.loadMoreData(false)
                }
            },
            onRdsMouseEnter(rds) {
                this.tipData = utils.validate(tipDataSerializer, rds)
            },
            onRdsMouseLeave() {
                this.tipData = utils.validate(tipDataSerializer, null)
            },
            setRequestUrl(){
                let order = "fail_ratio"
                if(this.groupType===1)
                    order = "fail_ratio"
                else if(this.groupType===2)
                    order = "na_ratio"
                this.compDeviceUrl = "api/v1/cedar/get_data_view/?devices="+ this.ids +
                    "&group_by=device&page=0&ordering=-" + order +
                    "&start_date="+ this.filterDateRange[0].format("yyyy-MM-dd") +
                    "&end_date="+ this.filterDateRange[1].format("yyyy-MM-dd")
                this.compJobUrl = "api/v1/cedar/get_data_view/?devices="+ this.ids +
                    "&group_by=job&page=0&ordering=-" + order +
                    "&start_date="+ this.filterDateRange[0].format("yyyy-MM-dd") +
                    "&end_date="+ this.filterDateRange[1].format("yyyy-MM-dd")
            },
            getDeviceSummery(){
                this.$ajax.get("api/v1/cedar/get_data_view_summery/?devices="+ this.ids +
                    "&start_date="+ this.filterDateRange[0].format("yyyy-MM-dd") +
                    "&end_date="+ this.filterDateRange[1].format("yyyy-MM-dd")
                ).then(response=>{
                    this.totalCount ={
                        failureRate:(response.data.fail_ratio*100).toFixed(0)+ "%",
                        invalidRate:(response.data.na_ratio*100).toFixed(0)+ "%",
                        total:response.data.total,
                        fail:response.data.fail,
                        pass:response.data.success,
                        invalid:response.data.na
                    }
                }).catch(error=>{
                    if(config.DEBUG) console.log(error)
                    this.$Message.warning("统计模块信息获取失败")
                })
            }



        },
        watch:{
            filterDateRange:{
                handler: function(val){
                    this.setRequestUrl()
                    this.getDeviceSummery()
                },
                immediate: true
            },
            groupType:{
                handler: function(val){
                    this.setRequestUrl()
                },
                immediate: true
            }
        },
        mounted(){

        }

    }

</script>


<style lang="less">
    .content{
        height: calc(100vh - 150px);
        overflow-y: auto;
        overflow-x: hidden;
    }
    .progress span{
        display: inline-block;
        height:20px
    }
    .count-left{
        float: left;
        width: 300px;
        height:200px;
        padding: 20px 10px;
        background: #fff;
        border-radius: 5px;
    }
    .icon-span{
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-left: 10px;
    }
    .device-statistic .ivu-tabs-bar{
        margin-bottom: 0;
        border-bottom: none;
    }

    .ivu-radio-group-button .ivu-radio-wrapper-checked {
        border-color: #1bbc9c!important;
        background: #1bbc9c!important;
        color: #fff!important;
    }
    .ivu-radio-group-button .ivu-radio-wrapper-checked:hover {
        color: #fff!important;
    }

</style>