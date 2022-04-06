<template>
    <div style="margin-left: 2px">
        <Row>
            <Select v-model="tableList" style="width: 200px;margin-bottom: 16px;">
                <Option :value="1">硬件模块列表</Option>
                <Option :value="2">温度感应片列表</Option>
                <Option :value="3">智能充电口列表</Option>
            </Select>
            <Button v-show="tableList===1" type="primary" style="float: right;" @click="onOpenHardWareModal">添加硬件模块</Button>
            <Button v-show="tableList===3" type="primary" style="float: right;" @click="onOpenStrategyModal">设置充电策略</Button>
            <!--<Button v-show="tableList===3" style="float: right;margin-right: 20px">查询充电状态</Button>-->
        </Row>

        <div v-if="tableList===1">
            <comp-hard-ware-table ref="hardWareTable"></comp-hard-ware-table>
        </div>
        <div v-if="tableList===2">
            <comp-temp-port-list></comp-temp-port-list>
        </div>
        <div v-if="tableList===3">
            <comp-power-port-list ref="powerPortList"></comp-power-port-list>
        </div>

        <Modal v-model="showAddHardWare" :closable="false" :mask-closable="false" :footer-hide="true">
            <comp-add-hard-ware ref="addHardware" @on-close-modal="onCloseHardWareModal" @after-add-hardware-click="onAfterAddHardWare"></comp-add-hard-ware>
        </Modal>
        <Modal v-model="showChargingStrategy" :closable="false" :mask-closable="false" :footer-hide="true" width="65">
            <div class="charging-box">
                <h2 style="margin: 10px 0">默认充电策略：</h2>
                <Row>
                    <p>设备电量低于
                        <InputNumber v-model="defaultTime.min" :min="0" :max="100" :precision="0" :formatter="value => `${value}%`"
                                     :parser="value => value.replace('%', '')"></InputNumber> 开始充电，设备电量达到
                        <InputNumber v-model="defaultTime.max" :min="1" :max="100" :precision="0" :formatter="value => `${value}%`"
                                     :parser="value => value.replace('%', '')"></InputNumber> 停止充电
                    </p>
                </Row>

                <h2 style="margin: 30px 0 10px 0">定时充电策略：
                    <Icon type="md-add-circle" style="margin-left: 5px;cursor: pointer;" size="24" color="#1bbc9c" @click="addTimerConfig" /></h2>

                <div v-show="timerConfig.length>0">
                    <Row v-for="(item,index) in timerConfig" style="margin-bottom: 20px">
                        <p @click="timeRangeIndex=index">{{ index+1 }}.设备电量低于
                            <InputNumber v-model="item.min" :min="0" :max="100" :precision="0" :formatter="value => `${value}%`" :parser="value => value.replace('%', '')"></InputNumber>
                            开始充电，设备电量达到
                            <InputNumber v-model="item.max" :min="1" :max="100" :precision="0" :formatter="value => `${value}%`" :parser="value => value.replace('%', '')"></InputNumber>
                            停止充电
                            <TimePicker :value="item.timeRange" :editable="false" :clearable="false" @on-change="onTimeSelect"
                                        format="HH:mm" type="timerange" placeholder="选择时间段" style="width: 168px;margin-left: 30px;"></TimePicker>
                            <Icon type="md-remove-circle" style="margin-left: 20px;cursor: pointer;" size="20" color="#666"
                                  @click="removeTimer(index)"/>
                        </p>
                    </Row>
                </div>

                <Row style="text-align: right;margin-top: 50px">
                    <Button type="default" style="margin-right: 20px" @click="showChargingStrategy=false">取消</Button>
                    <!--<Button type="primary" @click="onSaveConfig">确定</Button>-->
                    <Button type="primary" :loading="loading" @click="onSaveConfig">
                        <span v-if="!loading">确定</span>
                        <span v-else>正在配置...</span>
                    </Button>
                </Row>
            </div>
        </Modal>
    </div>
</template>

<script>
    import CompHardWareTable from "../components/CompHardWareTable"
    import CompTempPortList from "../components/CompTempPortList";
    import CompPowerPortList from "../components/CompPowerPortList";
    import CompAddHardWare from "./CompAddHardWare";
    import config from "../lib/config";


    export default {
        components:{ CompHardWareTable, CompTempPortList, CompPowerPortList, CompAddHardWare },
        data(){
            return{
                tableList:1,
                showAddHardWare:false,
                showChargingStrategy:false,
                defaultTime:{
                    min:30,
                    max:100,
                },
                // timerIndex:0,
                timerConfig:[{
                    min:50,
                    max:80,
                    timeRange:["12:00","13:00"]
                }],
                timeRangeIndex:0,
                powerList:[],
                loading:false,
            }
        },
        methods:{
            onOpenHardWareModal(){
                this.showAddHardWare = true;
                this.$refs.addHardware.reset()
            },
            onCloseHardWareModal(){
                this.showAddHardWare = false;
            },
            onAfterAddHardWare(){
                this.showAddHardWare = false;
                this.$refs.hardWareTable.getHardWareData()
            },
            onOpenStrategyModal(){
                this.powerList = this.$refs.powerPortList.getThisSelection()
                if(this.powerList.length===0){
                    this.$Message.warning({content:"至少选择一条数据！"})
                    return
                }
                this.showChargingStrategy = true;
                this.defaultTime = {
                    min:30,
                    max:100,
                }
                this.timerConfig=[]
            },
            onTimeSelect(time){
                this.timerConfig[this.timeRangeIndex].timeRange = time
            },
            addTimerConfig(){
                if(this.timerConfig.length===3){
                    this.$Message.warning({content:"最多只能添加3条定时策略！",duration:3})
                    return
                }
                this.timerConfig.push({
                    min:null,
                    max:null,
                    timeRange:[]
                })
            },
            removeTimer(index){
                this.timerConfig.splice(index,1)
            },
            // 保 存 充 电 策 略
            onSaveConfig(){
                // 校 验 输 入 的 数 据 是 否 符 合 要 求
                if(!this.defaultTime.max || !this.defaultTime.min){
                    this.$Message.warning("请将信息填写完整")
                    return
                }
                for (let i = 0; i < this.timerConfig.length; i++) {
                    if(!this.timerConfig[i].min || !this.timerConfig[i].max || this.timerConfig[i].timeRange.length===0){
                        this.$Message.warning("请将信息填写完整")
                        return
                    }
                }
                if(this.defaultTime.min >= this.defaultTime.max){
                    this.$Message.warning({content:"默认策略开始充电电量要小于停止充电电量",duration:8})
                    return
                }
                for (let i = 0; i < this.timerConfig.length; i++) {
                    if(this.timerConfig[i].min >= this.timerConfig[i].max ){
                        this.$Message.warning({content:"定时策略"+(i+1)+"开始充电电量要小于停止充电电量",duration:8})
                        return
                    }
                }
                if(this.timerConfig.length>=2){
                    for (let i = 0; i < this.timerConfig.length; i++) {
                        let timeClone = _.cloneDeep(this.timerConfig)
                        let start = this.timerConfig[i].timeRange[0].split(":")
                        let end = this.timerConfig[i].timeRange[1].split(":")
                        let startMin = parseInt(start[0])*60 + parseInt(start[1])
                        let endMin = parseInt(end[0])*60 + parseInt(end[1])
                        if(startMin===endMin){
                            this.$Message.warning({content:"定时策略"+(i+1)+"开始时间不能等于结束时间",duration:8})
                            return
                        }
                        timeClone.splice(i,1)
                        for (let j = 0; j < timeClone.length; j++) {
                            let startClone = timeClone[j].timeRange[0].split(":")
                            let endClone = timeClone[j].timeRange[1].split(":")
                            let startMinClone = parseInt(startClone[0])*60 + parseInt(startClone[1])
                            let endMinClone = parseInt(endClone[0])*60 + parseInt(endClone[1])

                            if( (startMin>startMinClone) && (startMin<endMinClone) || ((endMin>startMinClone) && (endMin<endMinClone))){
                                this.$Message.warning({content:"定时策略所选时间段存在冲突，请检查",duration:8})
                                return
                            }
                        }
                    }
                }
                // 开 始 保 存 数 据 发 送 请 求
                let powerStrategy = [{
                    min_value: this.defaultTime.min,
                    max_value: this.defaultTime.max,
                    is_default: true
                }]
                if(this.timerConfig.length>0){
                    this.timerConfig.forEach(config=>{
                        powerStrategy.push({
                            min_value: config.min,
                            max_value: config.max,
                            start_time: config.timeRange[0],
                            end_time: config.timeRange[1],
                            is_default: false
                        })
                    })
                }
                let params = []
                this.powerList.forEach(item=>{
                    params.push({
                        power_port:item.id,
                        power_strategy:powerStrategy
                    })
                })
                this.loading = true
                this.$ajax.post("api/v1/cedar/add_power_strategy/",params)
                    .then(response=>{
                        this.showChargingStrategy = false;
                        this.$refs.powerPortList.refresh()
                        this.$refs.powerPortList.resetPowerList()
                        this.loading = false
                        this.$Message.error("充电策略配置成功")
                    }).catch(error=>{
                        if (config.DEBUG) console.log(error)
                        this.loading = false
                        if(error.response.status>=500)
                            this.$Message.error("服务器错误")
                        else
                            this.$Message.error({content:error.response.data.description,duration:6})
                })
            },
        }
    }
</script>

<style scoped>
    /deep/.charging-box .ivu-input-number .ivu-input-number-handler-wrap{
        display: none;
    }
    .charging-box{
        margin: 20px;
    }
</style>
