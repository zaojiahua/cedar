<template>
    <Card dis-hover>
        <p>
            <Button type="error" @click="delRds()">删除</Button>
        </p>
        <Form :label-width="120">
            <Divider>RDS信息</Divider>
            <FormItem>
                <b slot="label">ID：</b>
                <Input v-model="rdsInfo.id" class="disabled-input" disabled></input>
            </FormItem>
            <FormItem>
                <b slot="label">启动时间：</b>
                <Input v-model="rdsInfo.start_time" class="disabled-input" disabled></input>
            </FormItem>
            <FormItem>
                <b slot="label">结束时间：</b>
                <Input v-model="rdsInfo.end_time" class="disabled-input" disabled></input>
            </FormItem>
            <FormItem>
                <b slot="label">测试结果：</b>
                <Input v-model="rdsInfo.result" class="disabled-input" disabled></input>
            </FormItem>
            <FormItem>
                <b slot="label">rdsDict：</b>
                <Input v-model="rdsInfo.rds_dict" class="disabled-input" disabled></input>
                <Button size="small" style="float: right;margin-top: 10px;" type="primary" @click="openRdsDict">查看详情</Button>
            </FormItem>
            <Divider>用例信息</Divider>
            <FormItem>
                <b slot="label">用例ID：</b>
                <Input v-model="rdsInfo.job.job_label" class="disabled-input" disabled></input>
            </FormItem>
            <FormItem>
                <b slot="label">用例名称：</b>
                <Input v-model="rdsInfo.job.job_name" class="disabled-input" disabled></input>
            </FormItem>
            <FormItem>
                <b slot="label">来自任务：</b>
                <Input v-model="rdsInfo.tboard.board_name" class="disabled-input" disabled></input>
            </FormItem>
            <Divider>设备信息</Divider>
            <FormItem>
                <b slot="label">自定义名称：</b>
                <Input v-model="rdsInfo.device.device_name" class="disabled-input" disabled></input>
            </FormItem>
            <FormItem>
                <b slot="label">设备编号：</b>
                <Input v-model="rdsInfo.device.phone_model.phone_model_name" class="disabled-input" disabled></input>
            </FormItem>
            <FormItem>
                <b slot="label">安卓版本：</b>
                <Input v-model="rdsInfo.device.android_version.version" class="disabled-input" disabled></input>
            </FormItem>
            <FormItem>
                <b slot="label">ROM版本：</b>
                <Input v-model="rdsInfo.device.rom_version.version" class="disabled-input" disabled></input>
            </FormItem>
            <div>
                <comp-temperature-histogram v-if="showTemperatures" :device-id="rdsInfo.device.id" ref="histogram"></comp-temperature-histogram>
            </div>
            <Divider>其他信息</Divider>
            <FormItem>
                <b slot="label">日志文件：</b>
                <p v-if="showLogTip" style="color: #FF9900">暂无日志文件信息</p>
                <ButtonGroup>
                    <Button v-for="files in rdsInfo.rdslog" :key="files.id" @click="viewLogFile(files.log_file,files.file_name)">{{ files.file_name }}</Button>
                </ButtonGroup>
            </FormItem>
        </Form>
        <div style="color: #515a6e;padding-left: 48px;font-size: 12px">
            <b style="cursor: default">截图：</b><b style="cursor: default" v-if="!showScreenTip">共 {{rdsInfo.rdsscreenshot.length}} 张</b>
            <label v-if="showScreenTip" style="color: #FF9900">暂无截图信息</label>
            <br>
            <img style="margin: 5px; cursor: pointer;" v-for="(img,index) in rdsInfo.rdsscreenshot" :key="img.id" :src=baseUrl+img.thumbs_file :alt=img.file_name @click="viewOriginalImg(img.id,index)">
        </div>
        <div style="color: #515a6e;padding-left: 48px;font-size: 12px;margin-top: 16px" v-show="isReferenceShow">
            <b style="cursor: default">查看查参考图片：</b><b style="cursor: default">共 {{jobResFile.length}} 张</b>
            <br>
            <img style="margin: 5px; cursor: pointer;max-width: 200px;border: 1px solid #ccc" v-for="(img,index) in jobResFile" :key="index" :src=baseUrl+img.file :alt=img.name>
        </div>
        <Spin size="large" fix v-if="showSpin"></Spin>
        <Modal v-model="showImgModal" :fullscreen="true" footer-hide style="text-align: center">
            <Icon type="ios-arrow-dropleft-circle" size="60"  style="position: fixed;top: 45%;left: 5%;cursor: pointer;opacity: 0.4" @click="prevBtn"/>
            <img :src=baseUrl+imgInfo.img_file :alt="imgInfo.file_name" style="max-height: 92%;max-width: 100%;">
            <Icon type="ios-arrow-dropright-circle" size="60" style="position: fixed;top: 45%;right: 5%;cursor: pointer;opacity: 0.4" @click="nextBtn"/>
            <p style="font-size: 20px"> {{ imgInfo.file_name }} </p>
            <p style="font-size: 20px"> {{ imgIndex+1 }} / {{ rdsInfo.rdsscreenshot.length }} </p>
        </Modal>
        <Modal v-model="showRdsLogModal" :fullscreen="true" :title="logName" ok-text="下载" @on-ok="downloadLog">
            <comp-view-log-file ref="viewLogFile"></comp-view-log-file>
        </Modal>
    </Card>
</template>

<script>
    import config from "../lib/config";
    import utils from "../lib/utils";
    import CompTemperatureHistogram from "./CompTemperatureHistogram";
    import CompViewLogFile from "./CompViewLogFile";

    const rdsSerializer = {
        device: {
            id: "number",
            device_name: "string",
            android_version: {
                id: "number",
                version: "string"
            },
            phone_model: {
                id:"number",
                phone_model_name: "string"
            },
            rom_version: {
                id:"number",
                version: "string"
            }
        },
        end_time: "string",
        id: "number",
        job: {
            id: "number",
            job_label: "string",
            job_name: "string"
        },
        job_assessment_value: "string",
        rdslog: [{
            id:"number",
            log_file:"string",
            file_name:"string"
        }],
        rdsscreenshot: [{
            id:"number",
            thumbs_file:"string",
            file_name:"string"
        }],
        start_time: "string",
        tboard: {
            id: "number",
            board_name: "string"
        }
    }
    const imgSerializer = {
            id:"number",
            file_name:"string",
            img_file:"string"
        }


    export default {
        components:{ CompTemperatureHistogram, CompViewLogFile },
        data(){
            return{
                baseUrl:"http://"+config.REEF_HOST+":"+config.REEF_PORT,
                rdsInfo:utils.validate(rdsSerializer,{}),
                showSpin:false,
                showImgModal:false,
                imgInfo:utils.validate(imgSerializer,{}),
                showLogTip:false,
                showScreenTip:false,
                showTemperatures:false,
                showRdsLogModal:false,
                logName:"",
                path:"",
                imgIndex:null,
                jobResFile:[],
                isReferenceShow:false
            }
        },
        methods:{
            refresh(rdsId,jobId){
                this.showSpin=true;
                this.showLogTip=false;
                this.showScreenTip=false;
                this.isReferenceShow = false;
                this.$ajax
                    .get("api/v1/cedar/rds/"+rdsId+"/?fields="+
                        "id,"+
                        "job,job.job_name,job.id,job.job_label,"+
                        "device,device.id,device.device_name,"+
                        "device.phone_model,device.phone_model.id,device.phone_model.phone_model_name,"+
                        "device.android_version,device.android_version.id,device.android_version.version,"+
                        "device.rom_version,device.rom_version.id,device.rom_version.version,"+
                        "rdslog,rdslog.id,rdslog.log_file,rdslog.file_name,"+
                        "rdsscreenshot,rdsscreenshot.id,rdsscreenshot.thumbs_file,rdsscreenshot.file_name,"+
                        "tboard,tboard.id,tboard.board_name,"+
                        "start_time,"+
                        "end_time,"+
                        "job_assessment_value," +
                        "rds_dict")
                    .then(response=>{
                        this.showSpin=false;
                        this.rdsInfo = utils.validate(rdsSerializer,response.data);
                        this.rdsInfo.rds_dict = JSON.stringify(this.rdsInfo.rds_dict);
                        if(this.rdsInfo.rds_dict === "null") this.rdsInfo.rds_dict = "";
                        if(this.rdsInfo.job_assessment_value==="0"){
                            this.rdsInfo.result = "通过";
                        }else if(this.rdsInfo.job_assessment_value==="1"){
                            this.rdsInfo.result = "未通过";
                            this.isReferenceShow = true
                        }else{
                            this.rdsInfo.result = "无效";
                            this.isReferenceShow = true
                        }
                        if(this.rdsInfo.rdslog.length===0)
                            this.showLogTip=true;
                        if(this.rdsInfo.rdsscreenshot.length===0)
                            this.showScreenTip=true;
                        this.showTemperatures=true;
                        let endTime = this.rdsInfo.end_time;
                        if(this.rdsInfo.end_time===null){
                            endTime = new Date().format("yyyy-MM-dd hh:mm:ss");
                        }
                        this.$nextTick(function () {
                            this.$refs.histogram.refresh(this.rdsInfo.start_time,endTime)
                        })
                    })
                    .catch(error=>{
                        this.showSpin=false;
                        if (config.DEBUG) console.log(error)
                        let errorMsg = "";
                        if (error.response.status >= 500) {
                            errorMsg = "服务器错误！"
                        } else {
                            errorMsg = "数据读取失败！"
                        }
                        this.$Message.error(errorMsg)
                    })
                this.$ajax.get("api/v1/cedar/job_res_file/?type=png&job_id="+jobId)
                    .then(response=>{
                        this.jobResFile = response.data.job_res_files
                    })
                    .catch(error=>{
                        if (config.DEBUG) console.log(error)
                        let errorMsg = "";
                        if (error.response.status >= 500) {
                            errorMsg = "服务器错误！"
                        } else {
                            errorMsg = "数据读取失败！"
                        }
                        this.$Message.error(errorMsg)
                    })
            },
            delRds(){
                let root = this;
                this.$Modal.confirm({
                    title: "警告！",
                    content: "您确定要删除该RDS吗？",
                    onOk(){
                        this.$ajax
                            .delete("api/v1/cedar/rds/"+root.rdsInfo.id+"/")
                            .then(response=>{
                                this.$Message.success("删除成功！");
                                root.$emit("delRdsOne",false);
                            })
                            .catch(error=>{
                                if (config.DEBUG) console.log(error)
                                let errorMsg = "";
                                if (error.response.status >= 500) {
                                    errorMsg = "服务器错误！"
                                } else {
                                    errorMsg = "删除失败！"
                                }
                                this.$Message.error(errorMsg)
                            })
                    }
                });
            },
            viewLogFile(path,fileName){
                // window.open(this.baseUrl+path)
                this.showRdsLogModal = true;
                this.logName = fileName;
                this.path = path;
                this.$refs.viewLogFile.refresh(path)

            },
            downloadLog(){
                window.open(this.baseUrl+this.path)
                // document.location.href = this.baseUrl+this.path
            },
            viewOriginalImg(imgId,index){
                this.imgIndex = index
                this.showImgModal = true;
                this.getOriginalImg(imgId)
            },
            nextBtn(){
                if(this.rdsInfo.rdsscreenshot[this.imgIndex+1]){
                    this.imgIndex++
                    let imgId = this.rdsInfo.rdsscreenshot[this.imgIndex].id
                    this.showImgModal = true;
                    this.getOriginalImg(imgId)
                }
            },
            prevBtn(){
                if(this.imgIndex===0)
                    return
                this.imgIndex--
                let imgId = this.rdsInfo.rdsscreenshot[this.imgIndex].id
                this.showImgModal = true;
                this.getOriginalImg(imgId)
            },
            getOriginalImg(imgId){
                this.$ajax
                    .get("api/v1/cedar/rds_screenshot/"+imgId+"/?fields="+
                        "id,img_file,file_name")
                    .then(response=>{
                        this.imgInfo = utils.validate(imgSerializer,response.data);
                    }).catch(error=>{
                        if (config.DEBUG) console.log(error)
                        let errorMsg = "";
                        if (error.response.status >= 500) {
                            errorMsg = "服务器错误！"
                        } else {
                            errorMsg = "图片读取失败！"
                        }
                        this.$Message.error(errorMsg)
                })
            },
            openRdsDict(){
                let route = this.$router.resolve({
                    name: "rds-dict-view",
                    params: {content: JSON.parse(this.rdsInfo.rds_dict)},
                    query: {
                        id: this.rdsInfo.id
                    }
                })
                window.open(route.href, "_blank")
            }
        },
    }
</script>

<style scoped>
    .disabled-input >>> input {
        background-color: #0000;
        color: #515a6e;
        border: #eee dotted 1px;
    }
    .ivu-icon-ios-arrow-dropleft-circle:hover,.ivu-icon-ios-arrow-dropright-circle:hover{
        opacity: 1 !important;
    }
</style>