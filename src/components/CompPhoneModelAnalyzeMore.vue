<template>
    <div style="padding: 16px;background-color: #fff;">
        <Divider orientation="left">各机型启动时间均值对比</Divider>
        <comp-perf-line-chart ref="histogram" :job-id="propJobId" :prop-phone-models="propPhoneModelList" :prop-tboard-ids="propTboardIdList"
                              @on-chart-click="onChartClick"></comp-perf-line-chart>

        <Divider orientation="left">各机型启动时间分布对比</Divider>
        <comp-perf-box-plot-chart ref="boxPlot" :job-id="propJobId" :prop-phone-models="propPhoneModelList" :prop-tboard-ids="propTboardIdList"></comp-perf-box-plot-chart>

        <Divider orientation="left">详细数据</Divider>
        <Table border :columns="column" :data="tableData"></Table>

        <Drawer v-model="showLineChartDetail" width="60" :closable="false" transfer>
            <comp-perf-line-chart-detail v-if="showLineChartDetail" ref="lineChartDetail" :prop-job-name="propJobName" :job-id="propJobId" :prop-phone-model="lineChartSelected" :prop-tboard-ids="propTboardIdList"></comp-perf-line-chart-detail>
        </Drawer>
    </div>

</template>

<script>
    import CompPerfLineChart from "../components/CompPerfLineChart";
    import CompPerfLineChartDetail from "../components/CompPerfLineChartDetail";
    import CompPerfBoxPlotChart from "../components/CompPerfBoxPlotChart";
    import config from "../lib/config"

    export default {
        components: { CompPerfLineChart, CompPerfBoxPlotChart, CompPerfLineChartDetail },
        props:{
            propJobId:{
                type: Number,
                default:null
            },
            propJobName:{
                type: String,
                default:""
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
                        title: '厂商-机型',
                        key: 'phone_model_name',
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: 'ROM Version',
                        key: 'rom_version_name',
                        align: 'center'
                    },
                    {
                        title: '中位数[s]',
                        key: 'median',
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: '平均值[s]',
                        key: 'avg',
                        align: 'center',
                        className: 'avgColumn',
                        sortable: true
                    },
                    {
                        title: '最大值[s]',
                        key: 'max',
                        align: 'center',
                        sortable: true
                    },

                    {
                        title: '启动成功次数',
                        key: 'success_num',
                        align: 'center'
                    },
                    {
                        title: '启动失败次数',
                        key: 'failed_num',
                        align: 'center'
                    },
                ],
                tableData:[],
                showLineChartDetail:false,
                lineChartSelected:[],
            }
        },
        methods:{
            //获取详细信息
            getTableData(){
                let phone_models = []
                this.propPhoneModelList.forEach(item=>{
                    phone_models.push(item.join("."))
                })
                this.$ajax.get("api/v1/cedar/get_perf_data_chart/?tboard="+ this.propTboardIdList.join(",") +
                    "&job="+ this.propJobId +
                    "&model_rom_version="+ phone_models.join(",") +
                    "&sizer=table_chart"
                ).then(response=>{
                    this.tableData = response.data
                }).catch(error=>{
                    if(config.DEBUG) console.log(error)
                    this.$Message.error("表格数据加载失败!")
                })
            },
            //折线图的点击操作  echarts click
            onChartClick(item){
                this.lineChartSelected = item
                this.showLineChartDetail = true
                this.$nextTick(function () {
                    this.$refs.lineChartDetail.refresh(this.propTboardIdList.join(","))
                })
            },
        },
        mounted(){
            this.$refs.histogram.refresh(this.propTboardIdList.join(","))
            this.$refs.boxPlot.refresh(this.propTboardIdList.join(","))
            this.getTableData()
        }
    }

</script>

<style scoped>

</style>
