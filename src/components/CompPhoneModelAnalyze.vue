<template>
    <div style="padding: 16px;background-color: #fff;">
        <Divider orientation="left">{{$t('perfDataView.title')}}</Divider>
        <Table border :columns="column" :data="tableData"></Table>
        <comp-perf-histogram style="margin-top: 20px;" ref="histogram" :job-id="propJobId" :prop-phone-models="propPhoneModelList" :prop-canvas-id="1"
                             @on-chart-click="onChartClick" @after-load-data="afterLoadData"
        ></comp-perf-histogram>

        <comp-perf-rds-list ref="perfRdsList" v-if="timeRange" :is-min="isMin" :prop-tboard-id-list="propTboardIdList" :prop-job-id="propJobId" :prop-time-range="timeRange"></comp-perf-rds-list>
    </div>

</template>

<script>
    import CompPerfHistogram from "../components/CompPerfHistogram";
    import CompPerfRdsList from "../components/CompPerfRdsList";
    import config from "../lib/config";

    export default {
        components: {CompPerfHistogram, CompPerfRdsList},
        props:{
            propJobId:{
                type: Number,
                default:null
            },
            propTboardIdList:{   //tboard 列表  id
                type: Array,
                default: ()=>{return []}
            },
            propPhoneModelList:{
                type: Array,
                default: ()=>{return []}
            }
        },
        data(){
            return{
                column:[
                    {
                        title: this.$t('perfDataView.jobColumn_1')+'[s]',
                        key: 'avg',
                        align: 'center',
                        className: 'avgColumn'
                    },
                    {
                        title: this.$t('perfDataView.jobColumn_2')+'[s]',
                        key: 'max',
                        align: 'center'
                    },
                    {
                        title: this.$t('perfDataView.jobColumn_3')+'[s]',
                        key: 'median',
                        align: 'center'
                    },
                    {
                        title: this.$t('perfDataView.jobColumn_4'),
                        key: 'success_num',
                        align: 'center'
                    },
                    {
                        title: this.$t('perfDataView.jobColumn_5'),
                        key: 'failed_num',
                        align: 'center'
                    },
                ],
                tableData:[],
                timeRange:"",
                isMin:false,
                minTime:null,
            }
        },
        methods:{
            getTableData(){
                let phone_model = []
                let rom = []
                this.propPhoneModelList.forEach(item=>{
                    phone_model.push(item[0])
                    rom.push(item[1])
                })
                this.$ajax.get("api/v1/cedar/get_single_device_table_data/?" +
                    "tboard="+ this.propTboardIdList.join(",") +
                    "&job="+ this.propJobId +
                    "&phone_model_obj="+ phone_model.join(",") +
                    "&rom_version_obj="+ rom.join(","))
                    .then(response=>{
                        this.tableData = [].concat(response.data)
                    }).catch(error=>{
                        if(config.DEBUG) console.log(error)
                        this.$Message.error(this.$t('perfDataView.error_4'))
                })
            },
            //图表的点击操作  echarts click
            afterLoadData(item){
                this.timeRange = item
                if(this.timeRange){
                    this.minTime = parseFloat(this.timeRange.split("-")[0])
                    this.isMin = true
                }
            },
            onChartClick(item){
                this.timeRange = item
                let min = parseFloat(this.timeRange.split("-")[0])
                this.isMin = this.minTime===min
            },
        },
        mounted(){
            this.getTableData()
            this.$refs.histogram.refresh(this.propTboardIdList.join(","))
        }
    }

</script>

<style scoped>
    /deep/ .ivu-table td.avgColumn{
        background-color: #FFAE25;
    }

</style>
