<template>
    <div>
        <Card :title="propJobName" dis-hover>
            <Form :label-width="80">
                <FormItem>
                    <b slot="label">{{$t('perfDataView.tit')}}:</b>
                    <Input disabled class="disabled-input" :value="propPhoneModel[4]"></Input>
                </FormItem>
                <FormItem>
                    <b slot="label">{{$t('deviceList.rom_version')}}:</b>
                    <Input disabled class="disabled-input" :value="propPhoneModel[5]"></Input>
                </FormItem>
            </Form>
        </Card>

        <Card style="margin-top: 20px;">
            <Divider orientation="left">{{$t('perfDataView.title')}}</Divider>
            <Table border :columns="jobColumn" :data="tableData"></Table>
            <comp-perf-histogram style="margin-top: 20px;" ref="histogram" :job-id="jobId" :propPhoneModels="phoneModel" :prop-canvas-id="2"
                                 @on-chart-click="onChartClick" @after-load-data="afterLoadData"
            ></comp-perf-histogram>
            <comp-perf-rds-list ref="perfRdsList" v-if="timeRange" :is-min="isMin" :prop-job-id="jobId" :prop-tboard-id-list="propTboardIds" :prop-time-range="timeRange"></comp-perf-rds-list>
        </Card>
    </div>
</template>

<script>
    import CompDeviceDetail from "../components/CompDeviceDetail";
    import CompJobDetail from "../components/CompJobDetail";
    import CompPerfHistogram from "../components/CompPerfHistogram";
    import CompPerfRdsList from "../components/CompPerfRdsList";

    import config from "../lib/config";
    import utils from "../lib/utils";


    export default {
        components: { CompDeviceDetail, CompJobDetail, CompPerfHistogram, CompPerfRdsList },
        props:{
            jobId:{
                type: Number
            },
            propJobName:{
                type: String
            },
            propPhoneModel:{
                type: Array,
                default: ()=>{return []}
            },
            propTboardIds:{
                type: Array,
                default: ()=>{return []}
            }
        },
        data() {
            return {
                tableData:[],
                showJobDetail:false,
                showDeviceDetail:false,
                jobColumn:[
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
                isMin:false,
                minTime:null,
                timeRange:"",
                phoneModel:[]
            }
        },
        methods: {
            refresh(tboardId) {
                this.getPerfTableData(tboardId)
                this.phoneModel = []
                this.phoneModel.push( [].concat(this.propPhoneModel[2],this.propPhoneModel[3]))
                this.$nextTick(function () {
                    this.$refs.histogram.refresh(tboardId)
                })
            },
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
            //table
            getPerfTableData(tboardId){
                this.$ajax.get("api/v1/cedar/get_single_device_table_data/?tboard=" + tboardId +
                    "&job=" + this.jobId + "&phone_model_obj=" + this.propPhoneModel[2] + "&rom_version_obj=" + this.propPhoneModel[3])
                    .then(response=>{
                        this.tableData = [].concat(response.data)
                    }).catch(error=>{
                        if(config.DEBUG) console.log(error)
                        this.$Message.error(this.$t('perfDataView.error_4'))
                })
            }

        }
    }
</script>

<style scoped>
    .disabled-input >>> input {
        background-color: #0000;
        color: #515a6e;
        border: #eee dotted 1px;
    }
    /deep/ .ivu-table td.avgColumn{
        background-color: #FFAE25;
    }

</style>
