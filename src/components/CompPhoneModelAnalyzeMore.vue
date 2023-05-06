<template>
    <div style="padding: 16px;background-color: #fff;">
        <Divider orientation="left">{{$t('perfDataView.title_1')}}</Divider>
        <comp-perf-line-chart ref="histogram" :job-id="propJobId" :prop-phone-models="propPhoneModelList" :prop-tboard-ids="propTboardIdList"
                              @on-chart-click="onChartClick"></comp-perf-line-chart>

        <Divider orientation="left">{{$t('perfDataView.title_2')}}</Divider>
        <comp-perf-box-plot-chart ref="boxPlot" :job-id="propJobId" :prop-phone-models="propPhoneModelList" :prop-tboard-ids="propTboardIdList"></comp-perf-box-plot-chart>

        <Divider orientation="left">{{$t('perfDataView.title_3')}}</Divider>
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
                        title: this.$t('perfDataView.title_4'),
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
                        title: this.$t('perfDataView.jobColumn_3')+'[s]',
                        key: 'median',
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: this.$t('perfDataView.jobColumn_1')+'[s]',
                        key: 'avg',
                        align: 'center',
                        className: 'avgColumn',
                        sortable: true
                    },
                    {
                        title: this.$t('perfDataView.jobColumn_2')+'[s]',
                        key: 'max',
                        align: 'center',
                        sortable: true
                    },

                    {
                        title: this.$t('perfDataView.title_5'),
                        key: 'success_num',
                        align: 'center'
                    },
                    {
                        title: this.$t('perfDataView.title_6'),
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
                    this.$Message.error(this.$t('perfDataView.error_4'))
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
