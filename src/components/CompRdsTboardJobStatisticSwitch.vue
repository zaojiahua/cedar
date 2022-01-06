<template>
    <div>
        <comp-filter-switch @on-change="onJobFilterParams" :prop-tboard="tboard"></comp-filter-switch>
        <comp-rds-tboard-statistic-table ref="statisticTable" :prop-tboard="tboard" @on-row-click="onRowClick"></comp-rds-tboard-statistic-table>
        <!-- RDS  数据 部分 -->
        <Divider orientation="left" style="margin-bottom: 16px" v-show="showRdsCard">测试结果</Divider>
        <Card :bordered="false" :dis-hover="true" style="overflow:hidden;" v-if="showRdsCard">
            <p style="font-size: 12px"><span>用例：【{{ job.name }}】</span><span v-show="device.name" style="margin-left: 20px;">设备：【{{ device.name }}】</span></p>
            <comp-rds-card-group-list :prop-device-id="device.id"
                                      :prop-job-id="job.id"
                                      :update-rds="updateRds"
                                      :prop-tboard-id="tboard"
                                      :invalid-list="invalidList"
                                      @rds-mouse-enter="onRdsMouseEnter"
                                      @rds-mouse-leave="onRdsMouseLeave">
            </comp-rds-card-group-list>
        </Card>
    </div>

</template>

<script>
    import CompFilterSwitch from "./CompFilterSwitch"
    import CompRdsTboardStatisticTable from "./CompRdsTboardStatisticTable"
    import CompRdsCard from "./CompRdsCard";
    import CompRdsCardGroupList from "./CompRdsCardGroupList";

    export default {
        components:{ CompFilterSwitch, CompRdsTboardStatisticTable, CompRdsCard, CompRdsCardGroupList },
        props:{
            tboard:{
                type:Number,
                default:null
            },
        },
        data(){
            return{
                showRdsCard:false,
                device:{},
                job:{},
                invalidList:[],
                updateRds:"",
            }
        },
        methods:{
            onJobFilterParams(params){
                this.$refs.statisticTable._setUrlParam(params)
                this.$refs.statisticTable.refresh()
            },
            onRowClick(row,index){
                this.showRdsCard = true
                if(index===undefined){
                    this.device = row
                    this.job = {
                        id: row.label_id,
                        name:row.label_name
                    }
                }
                else{
                    this.job = row
                    this.device = {}
                }
                this.getInvalidList()
                this.updateRds =this.job.id + " "+ this.device.id
            },
            // 无 效 类 型
            getInvalidList(){
                let obj = { tboard_id: this.tboard,job_id: this.job.id}
                if(this.device.id)
                    obj.device_id = this.device.id
                this.$ajax.post("api/v1/cedar/filter_invalid_rds/",obj)
                .then(response=>{
                    this.invalidList = response.data
                }).catch(error=>{
                    this.$Message.error("获取无效类型出错")
                })
            },
            // RDS 相 关
            onRdsMouseEnter(rds) {
                this.$emit("rds-mouse-enter",rds)
            },
            onRdsMouseLeave() {
                this.$emit("rds-mouse-leave")
            },
        }
    }
</script>

<style scoped>

</style>
