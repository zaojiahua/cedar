<template>
    <div>
        <div style="margin-bottom: 24px;text-align: right;">
            <!--<Input v-model="keyword" style="width: 300px;float:left;" clearable search enter-button="Search" placeholder="输入用例名称" />-->
            <Button @click="onOpenSetModal">{{$t('perfDataView.set_btn')}}</Button>
        </div>
        <Table ref="table" :columns="tableColumns" :data="data" :loading="loading" border
               @on-selection-change="onSelectionChange" @on-row-click="onRowClick"></Table>

        <Modal v-model="showStandardModal" footer-hide :closable="false" width="350">
            <Card>
                <p style="margin:16px 0;">{{$t('perfDataView.set_tip')}}</p>
                <Row>
                    <Select v-model="rules.operator" style="width:80px">
                        <Option value=">"> > </Option>
                        <Option value=">="> >= </Option>
                        <Option value="<"> < </Option>
                        <Option value="<="> <= </Option>
                        <Option value="="> = </Option>
                    </Select>
                    <InputNumber :precision="3" :min="0" v-model="rules.number" :max="1000000"  style="margin-left: 16px;width: 120px"
                                 :formatter="value => `${parseFloat(Math.floor(value*1000)/1000)}`" />
                </Row>
                <Row style="margin-top: 30px;">
                    <Button @click="showStandardModal=false" style="margin-right: 30px;">{{$t('public.btn_cancel')}}</Button>
                    <Button type="primary" @click="setStandard">{{$t('public.btn_ok')}}</Button>
                </Row>
            </Card>
        </Modal>

    </div>
</template>

<script>
    import utils from "../lib/utils"
    const exportDataSerializer = [
        {
            job_name: "string",
            data_name: "string",
            rule: "string",
        }
    ]

    export default {
        name: "CompPerfTboardExportList",
        data(){
            return{
                tableColumns:[
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: this.$t('jobList.job_name'),
                        key: 'job_name',
                        sortable: true
                    },
                    {
                        title: this.$t('perfDataView.data_name'),
                        key: 'data_name',
                        sortable: true
                    },
                    {
                        title: this.$t('perfDataView.rule'),
                        key: 'rule'
                    }
                ],
                data:utils.validate(exportDataSerializer,{}),
                loading:false,
                keyword:"",
                selectionJob:[],
                showStandardModal:false,
                rules:{
                    operator:null,
                    number:null,
                }
            }
        },
        methods:{
            // 获取当前tboard 需要导出的数据
            refresh(tboardId){
                this.selectionJob = []
                this.loading = true
                this.$ajax.get("api/v1/cedar/perf_data_preview/?tboard="+tboardId)
                    .then(response=>{
                        this.loading = false
                        this.data = utils.validate(exportDataSerializer,response.data)
                        this.data.forEach(item=>{
                            item.rule = item.rule ? item.rule : ""
                        })
                    }).catch(error=>{
                        this.loading = false
                        if(error.response.status>=500)
                            this.$Message.error({content:this.$t('public.error_500')})
                        else
                            this.$Message.error({content:error.response.data.description,duration:5})
                    })
            },
            onRowClick(row, index){
                this.$refs.table.toggleSelect(index)
            },
            getData(){
                return this.data;
            },
            onSelectionChange(selection){
                this.selectionJob = selection
            },
            onOpenSetModal(){
                if(this.selectionJob.length===0){
                    this.$Message.warning(this.$t('perfDataView.sel_tip'))
                    return
                }
                this.rules = {
                    operator:null,
                    number:null,
                }
                this.showStandardModal=true
            },
            // 设 置 标 准
            setStandard(){
                if((!this.rules.operator&&this.rules.number!==null)||(this.rules.operator&&this.rules.number===null)){
                    this.$Message.warning(this.$t('perfDataView.warning_2'))
                    return
                }
                let rule = this.rules.operator+this.rules.number
                this.selectionJob.forEach(item=>{
                    for (let i = 0; i <= this.data.length; i++) {
                        if((item.job_name===this.data[i].job_name)&&(item.data_name===this.data[i].data_name)){
                            this.data[i].rule = rule ? rule : ""
                            return
                        }
                    }
                })
                this.selectionJob = []
                this.$refs.table.selectAll(false)
                this.showStandardModal = false
            }
        }
    }
</script>

<style scoped>

</style>
