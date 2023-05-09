<template>
    <div>
        <Card :title="data.board_name + '(' + data.id + ')'" dis-hover>
            <!--<a :href="xls_url" slot="extra" style="float:right;margin-top: -5px;">-->
                <!--<Button type="primary">导出数据</Button>-->
            <!--</a>-->
            <Button slot="extra" style="float:right;margin-top: -5px;" type="primary" @click="onOpenExportData">{{$t('perfDataView.btn_view')}}</Button>
            <Form :label-width="105">
                <FormItem>
                    <b slot="label">{{$t('tboardList.board_name')}}:</b>
                    <Input disabled class="disabled-input" :value="data.board_name"></Input>
                </FormItem>
                <FormItem>
                    <b slot="label">{{$t('tboardDetail.testJob')}}:</b>
                    <ButtonGroup>
                        <Button v-for="job in data.job_data" :key="job.job_id" @click="showJobDetail=true;$refs.jobDetail.refresh(job.job_id)">{{job.job_num}}</Button>
                    </ButtonGroup>
                </FormItem>
                <FormItem>
                    <b slot="label">{{$t('tboardDetail.testDev')}}:</b>
                    <ButtonGroup>
                        <Button v-for="(id,index) in data.device_id" :key="index" @click="showDeviceDetail=true;$refs.deviceDetail.refresh(id)">
                            {{data.device_name[index]}}
                        </Button>
                    </ButtonGroup>
                </FormItem>
                <FormItem>
                    <b slot="label">{{$t('functionalTest.tboardRepeatTime')}}:</b>
                    <Input disabled class="disabled-input" :value="data.repeat_time"></Input>
                </FormItem>
                <FormItem>
                    <b slot="label">{{$t('tboardDetail.username')}}:</b>
                    <Input disabled class="disabled-input" :value="data.author_name"></Input>
                </FormItem>
                <FormItem>
                    <b slot="label">{{$t('tboardDetail.end_time')}}:</b>
                    <Input disabled class="disabled-input" :value="data.end_time"></Input>
                </FormItem>
            </Form>
        </Card>

        <Row style="margin-top: 40px">
            {{$t('tboardDetail.testDev')}}：
            <Select v-model="deviceSelected" style="width:200px"  title="device">
                <Option v-for="(id,index) in data.device_id" :value="id" :key="index">{{ data.device_name[index] }}</Option>
            </Select>
        </Row>
        <Card v-for="(job,index) in data.job_data" :key="job.job_id" style="margin-top: 20px;">
            <Divider orientation="left">{{$t('tboardDetail.testJob')}}{{ index+1 }}：{{ job.job_num }}</Divider>
            <comp-perf-group-view-list ref="perfViewList" :index="index" :job="job" :tboard-id="data.id" :device-id="deviceSelected"></comp-perf-group-view-list>
        </Card>

        <div></div>

        <Modal v-model="showExport" transfer :closable="false" fullscreen>
            <comp-perf-tboard-export-list ref="exportList"></comp-perf-tboard-export-list>
            <div slot="footer">
                <Button type="text" @click="showExport=false">{{$t('public.btn_cancel')}}</Button>
                <Button type="primary" @click="exportPerfExcel">{{$t('perfDataView.export')}}</Button>
            </div>
        </Modal>
        <Modal v-model="showDeviceDetail" transfer :closable="false" footer-hide :styles="{top: '16px'}">
            <comp-device-detail ref="deviceDetail"></comp-device-detail>
        </Modal>
        <Modal v-model="showJobDetail" transfer :closable="false" footer-hide :styles="{top: '16px'}">
            <comp-job-detail ref="jobDetail" :prop-close-btn="false"></comp-job-detail>
        </Modal>
        <Spin size="large" fix v-if="showLoading"></Spin>
    </div>
</template>

<script>
    import CompDeviceDetail from "../components/CompDeviceDetail";
    import CompJobDetail from "../components/CompJobDetail";
    import CompPerfGroupViewList from "../components/CompPerfGroupViewList";
    import CompPerfTboardExportList from "../components/CompPerfTboardExportList";

    import config from "../lib/config";
    import utils from "../lib/utils";

    export default {
        components: { CompDeviceDetail, CompJobDetail, CompPerfGroupViewList, CompPerfTboardExportList, },
        data() {
            return {
                data:{},
                showLoading:false,
                showJobDetail:false,
                showDeviceDetail:false,
                jobColumn:[
                    {
                        title: this.$t('perfDataView.jobColumn_1') + '[s]',
                        key: 'avg',
                        align: 'center',
                        className: 'avgColumn'
                    },
                    {
                        title: this.$t('perfDataView.jobColumn_2') + '[s]',
                        key: 'max',
                        align: 'center'
                    },
                    {
                        title: this.$t('perfDataView.jobColumn_3') + '[s]',
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
                groupView:1,
                deviceSelected:'',
                showExport:false,
            }
        },
        computed:{
            xls_url (){
                return  `http://${config.REEF_HOST}:${config.REEF_PORT}/api/v1/cedar/get_xls_data/?tboard=${this.data.id}`
            }
        },
        methods: {
            refresh(tboardId) {
                this.showLoading = true;
                this.$ajax.get("api/v1/cedar/get_tboard_perf_dtail_data/?tboard=" + tboardId)
                    .then(response => {
                        this.data = response.data
                        this.deviceSelected = this.data.device_id[0]
                        let hash = {};
                        // job_data 用例信息去重
                        this.data.job_data = response.data.job_data.reduce(function(item, next) {
                            hash[next.job_num] ? '' : hash[next.job_num] = true && item.push(next);
                            return item
                        }, [])
                        // 刷新所有性能图表
                        this.$nextTick(function () {
                            if (this.$refs.perfViewList) {
                                this.$refs.perfViewList.forEach(group => {
                                    group.groupView = 1
                                })
                            }
                        })
                        this.showLoading = false;
                    }).catch(reason => {
                        if (config.DEBUG) console.log(reason)
                        this.$Message.error(this.$t('public.loadFail'))
                        this.showLoading = false;
                })
            },
            onOpenExportData(){
                this.showExport = true
                this.$refs.exportList.refresh(this.data.id)
            },
            exportPerfExcel(){
                //  要导出的数据
                let dataList = this.$refs.exportList.getData()
                if(dataList.length===0){
                    this.$Message.warning(this.$t('perfDataView.warning_1'))
                    return
                }
                let exportData = {}
                dataList.forEach(item=>{
                    if(exportData[item.job_name]){
                        exportData[item.job_name] = Object.assign(exportData[item.job_name],{[item.data_name] : item.rule})
                    }else {
                        exportData[item.job_name]={[item.data_name] : item.rule}
                    }
                })
                this.$ajax.get("api/v1/cedar/get_xls_data/?tboard="+this.data.id+"&job_res_rule="+JSON.stringify(exportData))
                    .then(response=>{
                        this.showExport = false
                        window.open("http://"+config.REEF_HOST+":"+config.REEF_PORT +'/media/'+ response.data)
                        this.$Message.success(this.$t('tboardDetail.exportErr_2'))
                    }).catch(error=>{
                        if(error.response.status>=500)
                            this.$Message.error({content:this.$t('public.error_500')})
                        else
                            this.$Message.error({content:error.response.data.description,duration:3})
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
