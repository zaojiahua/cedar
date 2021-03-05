<template>
    <div>
        <Drawer v-model="showTboardDetail" width="60" :closable="false" transfer>
            <Comp-perf-tboard-detail ref="perfTboardDetail"></Comp-perf-tboard-detail>
        </Drawer>
        <Modal v-model="showJobDetail" transfer :closable="false" footer-hide :styles="{top: '16px'}">
            <comp-job-detail ref="jobDetail" :prop-close-btn="false"></comp-job-detail>
        </Modal>

        <div v-if="step===1">
            <DatePicker v-model="filterDateRange" @on-change="onDateChange" type="daterange" placeholder="测试开始时间" :transfer="true" :clearable="false"></DatePicker>
            <p style="color: rgb(194, 194, 194);margin-top: 10px;margin-bottom: 30px;">默认选择最近七天的数据 </p>

            <comp-tboard-list ref="tboardList" :prop-show-header="false" :prop-multi-select="true" :prop-is-perf="true" :prop-filter-date-range="filterDateRange"
                              @on-row-click="onTboardRowClick">
            </comp-tboard-list>

            <Row style="margin-top: 40px;text-align: center">
                <Button type="primary" @click="onTboardSelect">下一步</Button>
            </Row>
        </div>

        <div v-if="step===2">
            <comp-perf-job-list :prop-tboard-ids="tboardsIdList" @on-row-click="onJobSelect"></comp-perf-job-list>
            <Row style="margin-top: 40px;text-align: center">
                <Button type="primary" @click="onPrevStep1" style="margin-right: 40px;">上一步</Button>
                <Button type="primary" @click="onNextStep3">下一步</Button>
            </Row>
        </div>

        <div v-if="step===3">
            <Tabs type="card" v-model="analyze" name="inside" class="analyze" style="overflow: visible">
                <TabPane label="机型分析" name="phone_model_analyze" tab="inside" >
                    <div style="padding:16px;background-color: #fff;margin-bottom: 20px;">
                        <Row>
                            <span style="display: inline-block;border-left: 3px solid #1bbc9c;padding-left: 10px;width: 100px">测试用例</span>
                            <Button @click="showJobDetail=true;$refs.jobDetail.refresh(job.id)">
                                {{job.job_name}}
                            </Button>
                            <DatePicker style="margin-left: 20px;" class="disabled-i" disabled v-model="filterDateRange" type="daterange" :transfer="true" :clearable="false"></DatePicker>

                            <div style="float: right;">
                                <Button class="jobBtn" @click="onReJobSelect">重选用例</Button>
                                <Button type="primary" style="margin-left: 20px" @click="onReSelect">重选机型</Button>
                            </div>
                        </Row>
                        <Row style="margin-top: 20px">
                            <span style="display: inline-block;border-left: 3px solid #1bbc9c;padding-left: 10px;width: 100px">测试机型</span>
                            <Cascader class="disabled-i" :disabled="!showAnalyzeBtn" style="width: 200px;display: inline-block;margin-right: 16px" :data="cascaderData" v-model="cascaderSelect[i-1]" v-for="i in cascaderIndex"></Cascader>
                            <Button v-show="showAnalyzeBtn" @click="onAddCascader"> + </Button>
                        </Row>
                    </div>
                    <Row v-show="showAnalyzeBtn" style="margin-top: 40px;text-align: center"><Button type="primary" @click="onAnalyzeClick">机型分析</Button></Row>
                    <comp-phone-model-analyze v-if="analyzeCardIndex===1" :prop-phone-model-list="cascaderSelect"
                                              :prop-job-id="job.id" :prop-tboard-id-list="tboardsIdList"></comp-phone-model-analyze>
                    <comp-phone-model-analyze-more v-if="analyzeCardIndex===2" :prop-phone-model-list="cascaderSelect" :prop-job-name="job.job_name"
                                                   :prop-job-id="job.id" :prop-tboard-id-list="tboardsIdList"></comp-phone-model-analyze-more>
                </TabPane>

                <TabPane label="ROM分析" name="rom_analyze" tab="inside">

                </TabPane>
            </Tabs>
        </div>

    </div>

</template>

<script>
    import CompTboardList from "../components/CompTboardList";
    import CompPerfJobList from "../components/CompPerfJobList";
    import CompJobDetail from "../components/CompJobDetail";
    import CompPerfTboardDetail from "../components/CompPerfTboardDetail";
    import CompPhoneModelAnalyze from "../components/CompPhoneModelAnalyze";
    import CompPhoneModelAnalyzeMore from "../components/CompPhoneModelAnalyzeMore";

    import config from "../lib/config";
    import utils from "../lib/utils";


    export default {
        components: { CompTboardList, CompPerfTboardDetail, CompPerfJobList, CompJobDetail, CompPhoneModelAnalyze, CompPhoneModelAnalyzeMore  },
        data() {
            return {
                filterDateRange:[new Date(new Date(new Date().getTime()-24*60*60*1000*6).setHours(0,0,0,0)), new Date()],
                showTboardDetail:false,
                tboards:[],           //选取的tboard
                tboardsIdList:[],
                tboardsSelection:[],    //用于记录已勾选任务的位置
                step:1,
                job:null,      //选取的job
                analyze:"phone_model_analyze",
                showJobDetail:false,
                cascaderData:[],           //联级选择框吃的数据源
                cascaderIndex: 1,          //多少个联级选择框
                cascaderSelect: [],        //联级选择框选择的数据
                showAnalyzeBtn:true,
                analyzeCardIndex:null,
            }
        },
        methods: {
            onDateChange(){
                this.$refs.tboardList.refresh()
            },
            onTboardRowClick(row, index) {
                this.showTboardDetail = true
                this.$refs.perfTboardDetail.refresh(row.id)
            },
            //选取任务  下一步
            onTboardSelect(){
                this.tboardsSelection = this.$refs.tboardList.getThisSelection()
                this.tboards = this.$refs.tboardList.getSelection()
                if(this.tboards.length===0){
                    this.$Message.warning("请先选择至少一个任务!")
                    return
                }
                this.step = 2
                let ids = []
                this.tboards.forEach(item=>{
                    ids.push(item.id)
                })
                this.tboardsIdList = ids
            },
            //选取job
            onJobSelect(row,index){
                this.job = row
            },
            //  下一步  去分析
            onNextStep3(){
                if(!this.job){
                    this.$Message.warning("请选择一个用例进行分析！")
                    return
                }
                this.step = 3
                this.getCascaderData()
            },
            // 回到第一步，选取任务
            onPrevStep1(){
                this.step = 1
                this.$nextTick(function () {
                    this.$refs.tboardList.setSelection(this.tboardsSelection)
                })
            },
            // 多选机型  增加联级选择框
            onAddCascader(){
                if(this.cascaderIndex<5)
                    this.cascaderIndex++
                else
                    this.$Message.warning("最多添加5个机型进行分析！")
            },
            // 获取机型/Rom 数据源
            getCascaderData(){
                this.$ajax.get("api/v1/cedar/get_perf_data_phone_model_data/?tboard="+ this. tboardsIdList.join(",") +"&job=" + this.job.id)
                    .then(response=>{
                        let list = []
                        response.data.forEach(item=>{
                            let childList = []
                            item.rom_version_data.forEach(rom=>{
                                childList.push({
                                    value: rom.rom_version_id,
                                    label: rom.rom_version__version,
                                })
                            })
                            list.push({
                                    value: item.phone_model_id,
                                    label: item.phone_model_name,
                                    children: childList
                                })
                        })
                        this.cascaderData = list
                    }).catch(error=>{
                        if(config.DEBUG) console.log(error)
                        this.$Message.error("机型信息加载失败")
                })
            },
            //点击机型分析按钮以进行机型分析
            onAnalyzeClick(){
                // 先去除空值，看实际选择的value是否为空
                for (let i = this.cascaderSelect.length-1; i >= 0; i--) {
                    if(this.cascaderSelect[i].length===0)
                        this.cascaderSelect.splice(i,1)
                }
                if(this.cascaderSelect.length===0){
                    this.$Message.warning("请先选择至少一个机型进行分析！")
                    return
                }
                //是否为空判断完之后，再看是否重复
                let list = []
                let arr = this.cascaderSelect.map((item) => {
                    return item.join();
                })
                for (let i=0; i<arr.length;i++) {
                    if(list.indexOf(arr[i])===-1)
                        list.push(arr[i])
                    else {
                        this.$Message.warning("已选机型中有重复机型，请重新选择再进行下一步！")
                        return
                    }
                }

                //全部判断通过之后进入下一步
                this.showAnalyzeBtn = false
                if(this.cascaderSelect.length===1)
                    this.analyzeCardIndex = 1
                else
                    this.analyzeCardIndex = 2
            },
            //重选机型进行分析
            onReSelect(){
                this.showAnalyzeBtn = true
                this.analyzeCardIndex = null
                this.cascaderSelect = []
                this.cascaderIndex = 1
            },
            //重选job
            onReJobSelect(){
                this.job = null
                this.step = 2
                this.onReSelect()
            }
        }
    }
</script>

<style scoped>
    /deep/ .analyze .ivu-tabs-bar{
        margin-bottom: 0;
    }
    .disabled-i >>> input {
        background-color: #0000;
        color: #515a6e;
    }
    .jobBtn{
        color: #1bbc9c;
        border-color: #1bbc9c;
    }
</style>