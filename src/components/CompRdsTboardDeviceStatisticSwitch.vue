<template>
    <div>
        <Input class="search-x" search enter-button="Search" clearable v-model="keyword" @on-change="onChange" placeholder="输入设备名称..." style="margin-bottom: 16px" />
        <comp-rds-tboard-statistic-table ref="statisticTable" :prop-tboard="tboard" prop-type="device" @on-row-click="onRowClick"></comp-rds-tboard-statistic-table>
        <!-- RDS  数据 部分 -->
        <Divider orientation="left" style="margin-bottom: 16px" v-show="showRdsCard">测试结果</Divider>
        <Card :bordered="false" :dis-hover="true" style="overflow:hidden;" v-if="showRdsCard">
            <p style="font-size: 12px"><span>设备：【{{ device.name }}】</span><span v-show="job.name" style="margin-left: 20px;">用例：【{{ job.name }}】</span></p>
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
                keyword:'',
                invalidList:[],
                updateRds:"",

            }
        },
        methods:{
            //  搜 索
            onChange(){
                let conditions = {}
                if(this.keyword.trim())
                    conditions.contains= this.keyword.trim()
                this.$refs.statisticTable._setUrlParam(conditions)
                this.$refs.statisticTable.onPageChange(1)
            },
            onRowClick(row,index){
                this.showRdsCard = true
                if(index===undefined){
                    this.job = row
                    this.device = {
                        id: row.label_id,
                        name:row.label_name
                    }
                }
                else{
                    this.device = row
                    this.job = {}
                }
                this.getInvalidList()
                this.updateRds =this.device.id + " "+ this.job.id
            },
            // 无 效 类 型
            getInvalidList(){
                let obj = { tboard_id: this.tboard,device_id: this.device.id}
                if(this.job.id)
                    obj.job_id = this.job.id
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
    /deep/.search-x .ivu-input-icon-clear{
        margin-right: 75px!important;
    }
</style>
