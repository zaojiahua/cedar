<template>
    <Card dis-hover>
        <p>
            <Button type="error" @click="delRds()">{{$t('public.btn_del')}}</Button>
            <ButtonGroup style="float: right;">
                <Button @click="onBtnClick(true)">{{$t('rdsDetail.prev')}}</Button>
                <Button @click="onBtnClick(false)">{{$t('rdsDetail.next')}}</Button>
            </ButtonGroup>
            <Button v-if="propPerfRds&&rdsInfo.job.job_second_type==='TimeJob'" type="primary" @click="goRdsPhotos" style="margin-left: 24px;">{{$t('rdsDetail.photos')}}</Button>
            <Button v-if="rdsInfo.job.job_second_type==='SmoothJob'&&(rdsInfo.result!==$t('tboardDetail.invalid'))" type="primary" @click="goRdsFramePhotos" style="margin-left: 24px;">{{$t('rdsDetail.photos')}}</Button>
        </p>
        <Form :label-width="120">
            <Divider>{{$t('rdsDetail.rdsInfo')}}</Divider>
            <FormItem>
                <b slot="label">ID:</b>
                <Input v-model="rdsInfo.id" class="disabled-input" disabled></input>
            </FormItem>
            <FormItem>
                <b slot="label">{{$t('rdsDetail.start_time')}}:</b>
                <Input v-model="rdsInfo.start_time" class="disabled-input" disabled></input>
            </FormItem>
            <FormItem>
                <b slot="label">{{$t('rdsDetail.end_time')}}:</b>
                <Input v-model="rdsInfo.end_time" class="disabled-input" disabled></input>
            </FormItem>
            <FormItem>
                <b slot="label">{{$t('rdsDetail.runTime')}}:</b>
                <Input v-model="rdsInfo.runTime" class="disabled-input" disabled></input>
            </FormItem>
            <FormItem>
                <b slot="label">{{$t('rdsDetail.result')}}:</b>
                <Input v-model="rdsInfo.result" class="disabled-input" disabled></input>
            </FormItem>
            <FormItem v-if="propPerfRds&&rdsInfo.job_duration!==null">
                <b slot="label">{{$t('rdsDetail.job_duration')}}:</b>
                <Input v-model="rdsInfo.job_duration+'s'" class="disabled-input" disabled></input>
            </FormItem>
            <FormItem v-if="rdsInfo.job.job_second_type==='SmoothJob'">
                <b slot="label">{{$t('rdsDetail.lose_frame_point')}}:</b>
                <Input v-model="rdsInfo.lose_frame_point" class="disabled-input" disabled></input>
            </FormItem>
            <FormItem>
                <b slot="label">rdsDict:</b>
                <Input v-model="rdsInfo.rds_dict" class="disabled-input" disabled></input>
                <Button size="small" style="float: right;margin-top: 10px;" type="primary" @click="openRdsDict">{{$t('rdsDetail.view')}}</Button>
            </FormItem>
            <Divider>{{$t('rdsDetail.jobInfo')}}</Divider>
            <FormItem>
                <b slot="label">{{$t('rdsDetail.label')}}ID:</b>
                <Input v-model="rdsInfo.job.job_label" class="disabled-input" disabled></input>
            </FormItem>
            <FormItem>
                <b slot="label">{{$t('jobList.job_name')}}:</b>
                <Input v-model="rdsInfo.job.job_name" class="disabled-input" disabled></input>
            </FormItem>
            <FormItem>
                <b slot="label">{{$t('jobList.username')}}:</b>
                <Input v-model="rdsInfo.job.author.username" class="disabled-input" disabled></input>
            </FormItem>
            <FormItem>
                <b slot="label">{{$t('rdsDetail.from')}}:</b>
                <Input v-model="rdsInfo.tboard.board_name" class="disabled-input" disabled></input>
            </FormItem>
            <Divider>{{$t('rdsDetail.devInfo')}}</Divider>
            <FormItem>
                <b slot="label">{{$t('deviceList.device_name')}}:</b>
                <Input v-model="rdsInfo.device.device_name" class="disabled-input" disabled></input>
            </FormItem>
            <FormItem>
                <b slot="label">{{$t('deviceList.device_label')}}:</b>
                <Input v-model="rdsInfo.device.device_label" class="disabled-input" disabled></input>
            </FormItem>
            <FormItem>
                <b slot="label">{{$t('rdsDetail.customName')}}:</b>
                <Input v-model="rdsInfo.device.custom_number" class="disabled-input" disabled></input>
            </FormItem>
            <FormItem>
                <b slot="label">{{$t('deviceList.android_version')}}:</b>
                <Input v-model="rdsInfo.device.android_version.version" class="disabled-input" disabled></input>
            </FormItem>
            <FormItem>
                <b slot="label">{{$t('deviceList.rom_version')}}:</b>
                <Input v-model="rdsInfo.device.rom_version.version" class="disabled-input" disabled></input>
            </FormItem>
            <div>
                <comp-temperature-histogram v-if="showTemperatures" :device-id="rdsInfo.device.id" ref="histogram"></comp-temperature-histogram>
            </div>
            <Divider>{{$t('rdsDetail.otherInfo')}}</Divider>
            <FormItem>
                <b slot="label">{{$t('rdsDetail.log')}}:</b>
                <p v-if="showLogTip" style="color: #FF9900">{{$t('rdsDetail.noLog')}}</p>
                <ButtonGroup v-show="rdsInfo.logList.length>0" style="margin-bottom: 8px">
                    <Button v-for="files in rdsInfo.logList" :key="files.id" @click="viewLogFile(files.log_file,files.file_name)">{{ files.file_name }}</Button>
                </ButtonGroup>
                <Row v-show="rdsInfo.logList.length>0">
                    <Button size="small" type="primary" ghost @click="downloadAllFile">{{$t('rdsDetail.downLoad')}}</Button>
                </Row>
                <Divider v-show="rdsInfo.logList.length>0"></Divider>
                <Row v-show="rdsInfo.zipList.length>0">
                    <ButtonGroup>
                        <Button v-for="files in rdsInfo.zipList" style="margin-bottom: 8px;" :key="files.id" @click="downloadLog(files.log_file)">{{ files.file_name }}</Button>
                    </ButtonGroup>
                </Row>
            </FormItem>
            <FormItem>
                <b slot="label">{{$t('rdsDetail.rom')}}:</b>
                <p v-if="!rdsInfo.rom_version_const" style="color: #FF9900">{{$t('public.noData')}}</p>
                <Input v-show="rdsInfo.rom_version_const" v-model="rdsInfo.rom_version_const" class="disabled-input" disabled></input>
            </FormItem>
            <FormItem>
                <b slot="label">{{$t('rdsDetail.app')}}:</b>
                <p v-if="rdsInfo.app_info.length===0" style="color: #FF9900">{{$t('public.noData')}}</p>
                <div v-show="rdsInfo.app_info.length>0">
                    <Input v-for="item in rdsInfo.app_info" v-model="item.app_version+'('+item.package_name+')'" class="disabled-input" style="margin-bottom: 10px" disabled></input>
                </div>
            </FormItem>
        </Form>
        <div style="color: #515a6e;padding-left: 48px;font-size: 12px">
            <b style="cursor: default">{{$t('rdsDetail.pic')}}:</b><b style="cursor: default" v-if="!showScreenTip">{{$t('rdsDetail.pic_1')}}{{rdsscreenshot.length}} {{$t('rdsDetail.pic_2')}}</b>
            <label v-if="showScreenTip" style="color: #FF9900">{{$t('rdsDetail.noPic')}}</label>
            <br>
            <img style="margin: 5px; cursor: pointer;" v-for="(img,index) in rdsscreenshot" :key="img.id" :src=baseUrl+img.thumbs_file :alt=img.file_name :title=img.file_name @click="viewOriginalImg(img,index)">
        </div>
        <!--<div style="color: #515a6e;padding-left: 48px;font-size: 12px;margin-top: 16px" v-show="isReferenceShow">-->
            <!--<b style="cursor: default">查看查参考图片:</b><b style="cursor: default">共 {{jobResFile.length}} 张</b>-->
            <!--<br>-->
            <!--<img style="margin: 5px; cursor: pointer;max-width: 200px;border: 1px solid #ccc" v-for="(img,index) in jobResFile" :key="index" :src=baseUrl+img.file :alt=img.name>-->
        <!--</div>-->
        <Spin size="large" fix v-if="showSpin"></Spin>
        <Modal v-model="showImgModal" :fullscreen="true" footer-hide style="text-align: center">
            <Icon type="ios-arrow-dropleft-circle" size="60"  style="position: fixed;top: 45%;left: 5%;cursor: pointer;opacity: 0.4" @click="prevBtn"/>
            <img :src=baseUrl+imgInfo.img_file :alt="imgInfo.file_name" style="max-height: 92%;max-width: 100%;">
            <Icon type="ios-arrow-dropright-circle" size="60" style="position: fixed;top: 45%;right: 5%;cursor: pointer;opacity: 0.4" @click="nextBtn"/>
            <p style="font-size: 20px"> {{ imgInfo.file_name }} </p>
            <p style="font-size: 20px"> {{ imgIndex+1 }} / {{ rdsscreenshot.length }} </p>
        </Modal>
        <Modal v-model="showRdsLogModal" :fullscreen="true" :title="logName" :ok-text="$t('rdsDetail.down')" @on-ok="downloadLog">
            <comp-view-log-file ref="viewLogFile"></comp-view-log-file>
        </Modal>
        <Modal v-model="showRdsPhotosModal" :fullscreen="true" :closable="false">
            <comp-perf-rds-photos v-if="showRdsPhotosModal" :prop-rds-id="rdsInfo.id" ref="rdsPhotos"></comp-perf-rds-photos>
            <div slot="footer">
                <Button type="text" @click="showRdsPhotosModal=false">{{$t('public.btn_cancel')}}</Button>
                <Button type="primary" @click="savePoint">{{$t('public.btn_ok')}}</Button>
            </div>
        </Modal>
        <!-- 丢帧点 -->
        <Modal v-model="showRdsFramePhotosModal" :fullscreen="true" :closable="false">
            <comp-perf-frame-rds-photos v-if="showRdsFramePhotosModal" :prop-rds-id="rdsInfo.id" ref="rdsFramePhotos"></comp-perf-frame-rds-photos>
            <div slot="footer">
                <Button type="text" @click="showRdsFramePhotosModal=false">{{$t('public.btn_cancel')}}</Button>
                <Button type="primary" @click="saveFramePoint">{{$t('public.btn_ok')}}</Button>
            </div>
        </Modal>
    </Card>
</template>

<script>
    import config from "../lib/config";
    import utils from "../lib/utils";
    import CompTemperatureHistogram from "./CompTemperatureHistogram";
    import CompViewLogFile from "./CompViewLogFile";
    import CompPerfRdsPhotos from "./CompPerfRdsPhotos_1";
    import CompPerfFrameRdsPhotos from "./CompPerfRdsPhotosFrame";

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
        runTime: "string",
        id: "number",
        job: {
            id: "number",
            job_label: "string",
            job_name: "string",
            job_second_type:"string",
            author: {
                username: "string"
            }
        },
        job_assessment_value: "string",
        rdslog: [{
            id:"number",
            log_file:"string",
            file_name:"string"
        }],
        logList:[{
            id:"number",
            log_file:"string",
            file_name:"string"
        }],
        zipList:[{
            id:"number",
            log_file:"string",
            file_name:"string"
        }],
        rdsscreenshot: [{
            id:"number",
            thumbs_file:"string",
            file_name:"string"
        }],
        job_duration:"string",
        original_job_duration:"string",
        lose_frame_point:"string",
        start_time: "string",
        rom_version_const:"string",
        app_info: [{
            app_version: "number",
            package_name: "string"
        }],
        tboard: {
            id: "number",
            board_name: "string"
        }
    }
    const rdsscreenshotSerializer = [{
        id:"number",
        thumbs_file:"string",
        file_name:"string",
        img_file:"string",
        rds:"number"
    }]
    const imgSerializer = {
        id:"number",
        thumbs_file:"string",
        file_name:"string",
        img_file:"string",
        rds:"number"
    }


    export default {
        components:{ CompTemperatureHistogram, CompViewLogFile, CompPerfRdsPhotos, CompPerfFrameRdsPhotos },
        props:{
            propPerfRds:{
                type:Boolean,
                default:false
            }
        },
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
                isReferenceShow:false,
                showRdsPhotosModal:false,
                showRdsFramePhotosModal:false,
                rdsscreenshot:utils.validate(rdsscreenshotSerializer,[]),
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
                        "job,job.job_name,job.id,job.job_label,job.job_second_type,job.author,job.author.username," +
                        "device,device.id,device.device_name,device.device_label,device.custom_number,"+
                        "device.phone_model,device.phone_model.id,device.phone_model.phone_model_name,"+
                        "device.android_version,device.android_version.id,device.android_version.version,"+
                        "device.rom_version,device.rom_version.id,device.rom_version.version,"+
                        "rdslog,rdslog.id,rdslog.log_file,rdslog.file_name,"+
                        "rdsscreenshot,rdsscreenshot.id,rdsscreenshot.thumbs_file,rdsscreenshot.file_name,"+
                        "tboard,tboard.id,tboard.board_name,"+
                        "start_time,"+
                        "end_time,"+
                        "rom_version_const," +
                        "app_info,"+
                        "job_duration,lose_frame_point,original_job_duration," +
                        "job_assessment_value," +
                        "rds_dict")
                    .then(response=>{
                        this.showSpin=false;
                        this.rdsInfo = utils.validate(rdsSerializer,response.data);
                        this.rdsInfo.job_duration = this.rdsInfo.job_duration ? this.rdsInfo.job_duration : null
                        this.rdsInfo.rds_dict = JSON.stringify(this.rdsInfo.rds_dict);
                        this.rdsInfo.lose_frame_point = this.rdsInfo.lose_frame_point ? this.rdsInfo.lose_frame_point + ".jpg" : this.$t('rdsDetail.no');
                        let logList=[], zipList=[]
                        this.rdsInfo.rdslog.forEach(item=>{
                            let arr = item.file_name.split(".")
                            if(arr[arr.length-1]==="zip"){    // or arr.pop()
                                zipList.push(item)
                            }else{
                                logList.push(item)
                            }
                        })
                        this.rdsInfo.logList = logList
                        this.rdsInfo.zipList = zipList
                        if(this.rdsInfo.rds_dict === "null") this.rdsInfo.rds_dict = "";
                        if(this.rdsInfo.job_assessment_value==="0"){
                            this.rdsInfo.result = this.$t('tboardDetail.pass');
                        }else if(this.rdsInfo.job_assessment_value==="1"){
                            this.rdsInfo.result = this.$t('tboardDetail.fail');
                            this.isReferenceShow = true
                        }else{
                            this.rdsInfo.result = this.$t('tboardDetail.invalid');
                            this.isReferenceShow = true
                        }
                        if(this.rdsInfo.rdslog.length===0)
                            this.showLogTip=true;
                        this.showTemperatures=true;
                        let endTime = this.rdsInfo.end_time;
                        if(this.rdsInfo.end_time===null){
                            endTime = new Date().format("yyyy-MM-dd hh:mm:ss");
                        }
                        this.$nextTick(function () {
                            this.$refs.histogram.refresh(this.rdsInfo.start_time,endTime)
                        })
                        this.rdsInfo.runTime = this.diffTime(this.rdsInfo.start_time,this.rdsInfo.end_time)
                    })
                    .catch(error=>{
                        this.showSpin=false;
                        if (config.DEBUG) console.log(error)
                        let errorMsg = "";
                        if (error.response.status >= 500) {
                            errorMsg = this.$t('public.error_500')
                        } else {
                            errorMsg = this.$t('rdsDetail.err_1')
                        }
                        this.$Message.error(errorMsg)
                    })
                this.$ajax.get("api/v1/cedar/get_sort_rds_screenshot/?reverse=false&rds=" + rdsId)
                    .then(response=>{
                        this.rdsscreenshot = response.data
                        if(this.rdsscreenshot.length===0)
                            this.showScreenTip=true;
                    })
                    .catch(error=>{
                        if (config.DEBUG) console.log(error)
                        let errorMsg = "";
                        if (error.response.status >= 500) {
                            errorMsg = this.$t('public.error_500')
                        } else {
                            errorMsg = this.$t('rdsDetail.err_2')
                        }
                        this.$Message.error(errorMsg)
                    })
                // this.$ajax.get("api/v1/cedar/job_res_file/?type=png&job_id="+jobId)
                //     .then(response=>{
                //         this.jobResFile = response.data.job_res_files
                //     })
                //     .catch(error=>{
                //         if (config.DEBUG) console.log(error)
                //         let errorMsg = "";
                //         if (error.response.status >= 500) {
                //             errorMsg = "服务器错误！"
                //         } else {
                //             errorMsg = "数据读取失败！"
                //         }
                //         this.$Message.error(errorMsg)
                //     })
            },
            delRds(){
                let root = this;
                this.$Modal.confirm({
                    title: root.$t('public.modal_warn'),
                    content: root.$t('rdsDetail.tips'),
                    onOk(){
                        this.$ajax
                            .delete("api/v1/cedar/rds/"+root.rdsInfo.id+"/")
                            .then(response=>{
                                this.$Message.success(root.$t('public.delSuccess'));
                                root.$emit("delRdsOne",false);
                            })
                            .catch(error=>{
                                if (config.DEBUG) console.log(error)
                                let errorMsg = "";
                                if (error.response.status >= 500) {
                                    errorMsg = root.$t('public.error_500')
                                } else {
                                    errorMsg = root.$t('public.delFail')
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
            downloadLog(path){
                if(path){
                    window.open(this.baseUrl+path)
                    return
                }
                //  非zip文件下载  （特别针对txt文件）
                this.$ajax.get(this.path, {responseType: 'blob'}).then(res => {
                    let blob = new Blob([res.data]);
                    let url = window.URL.createObjectURL(blob);
                    let a = document.createElement("a");
                    a.href = url;
                    a.download = this.logName;
                    a.click();
                    window.URL.revokeObjectURL(url);
                })
                // window.open(this.baseUrl+this.path)
            },
            //一 键 全 部 下 载
            downloadAllFile(){
                this.rdsInfo.logList.forEach(item=>{
                    this.$ajax.get(item.log_file, {responseType: 'blob'}).then(res => {
                        let blob = new Blob([res.data]);
                        let url = window.URL.createObjectURL(blob);
                        let a = document.createElement("a");
                        a.href = url;
                        a.download = item.file_name;
                        a.click();
                        window.URL.revokeObjectURL(url);
                    })
                })
            },
            viewOriginalImg(img,index){
                this.imgIndex = index
                this.showImgModal = true;
                this.imgInfo = img
            },
            nextBtn(){
                if(this.rdsscreenshot[this.imgIndex+1]){
                    this.imgIndex++
                    this.imgInfo = this.rdsscreenshot[this.imgIndex]
                }
            },
            prevBtn(){
                if(this.imgIndex===0)
                    return
                this.imgIndex--
                this.imgInfo = this.rdsscreenshot[this.imgIndex]
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
            },
            //启动时间测试图集
            goRdsPhotos(){
                this.showRdsPhotosModal = true
                this.$nextTick(function () {
                    this.$refs.rdsPhotos.refresh(this.rdsInfo.id)
                })
            },
            //丢帧点测试图集
            goRdsFramePhotos(){
                this.showRdsFramePhotosModal = true
                this.$nextTick(function () {
                    this.$refs.rdsFramePhotos.refresh(this.rdsInfo.id)
                })
            },
            //    保存起始结束点
            savePoint(){
                let Obj = this.$refs.rdsPhotos.getPointMsg()
                if(!Obj.startPoint||!Obj.endPoint){
                    this.$Message.warning({content:this.$t('rdsDetail.tips_1'),duration:5})
                    return
                }
                if(Obj.ads_start_point&&Obj.ads_end_point){
                    if(Obj.ads_start_point>=Obj.ads_end_point){
                        this.$Message.warning({content:this.$t('rdsPhotosAdsTime.tips_1'),duration:5})
                        return
                    }
                    if( (Obj.ads_start_point<=Obj.startPoint) || (Obj.ads_start_point>=Obj.endPoint) || (Obj.ads_end_point<=Obj.startPoint) || (Obj.ads_end_point>=Obj.endPoint)){
                        this.$Message.warning({content:this.$t('rdsPhotosAdsTime.tips_2'),duration:5})
                        return
                    }
                }else if(!Obj.ads_start_point&&!Obj.ads_end_point){
                    //不需要校验
                }else {
                    this.$Message.warning({content:this.$t('rdsPhotosAdsTime.tips_3'),duration:5})
                    return
                }
                this.$refs.rdsPhotos.showLoading = true
                console.log(Obj)
                this.$ajax.patch("api/v1/cedar/rds/" + this.rdsInfo.id + "/",{
                    job_duration: Obj.job_duration,  //减去广告时间
                    start_point: Obj.startPoint,
                    end_point: Obj.endPoint,
                    ads_start_point:Obj.ads_start_point,
                    ads_end_point:Obj.ads_end_point,
                    original_job_duration:Obj.original_job_duration,  // 原始时间
                }).then(response=>{
                    this.rdsInfo.job_duration = Obj.job_duration
                    this.$Message.success(this.$t('rdsDetail.success'))
                    this.$refs.rdsPhotos.showLoading = false
                    this.showRdsPhotosModal = false

                }).catch(error=>{
                    this.$refs.rdsPhotos.showLoading = false
                    if (config.DEBUG) console.log(error)
                    this.$Message.error(this.$t('rdsDetail.fail'))
                })
            },
            //  保存丢帧点
            saveFramePoint(){
                let Obj = this.$refs.rdsFramePhotos.getPointMsg()
                this.$refs.rdsFramePhotos.showLoading = true
                console.log(Obj)
                this.$ajax.patch("api/v1/cedar/rds/" + this.rdsInfo.id + "/",{
                    lose_frame_point:Obj.lose_frame_point_index,
                    job_assessment_value:Obj.lose_frame_point_index ? "1" : "0"
                }).then(response=>{
                    this.rdsInfo.result = Obj.lose_frame_point_index ? this.$t('tboardDetail.fail') : this.$t('tboardDetail.pass')
                    this.rdsInfo.lose_frame_point = Obj.lose_frame_point_index ? Obj.lose_frame_point_index+'.jpg' : this.$t('rdsDetail.no')
                    this.$Message.success(this.$t('rdsDetail.success'))
                    this.$refs.rdsFramePhotos.showLoading = false
                    this.showRdsFramePhotosModal = false
                }).catch(error=>{
                    if (config.DEBUG) console.log(error)
                    this.$Message.error(this.$t('rdsDetail.fail'))
                })
            },
            // 上一个下一个按钮 分发事件 true:上一个  false:下一个
            onBtnClick(isPrev){
                if(isPrev){
                    this.$emit("on-left-rds")
                }else {
                    this.$emit("on-right-rds")
                }
            },
            //键盘左右切换事件
            onKeyUpEvent(event) {
                if(this.showImgModal){
                    // 查看参考图
                    if (event.keyCode === 37) {  //左 ←
                        this.prevBtn()
                    } else if (event.keyCode === 39) {  //右 →
                        this.nextBtn()
                    }
                }else {
                    // 切换 RDS
                    // if(!this.showRdsPhotosModal&&!this.showRdsFramePhotosModal){
                        if (event.keyCode === 37) {  //左 ←
                            this.$emit("on-left-rds")
                        } else if (event.keyCode === 39) {  //右 →
                            this.$emit("on-right-rds")
                        }
                    // }
                }
            },
            // 计算 RDS 运行时长
            diffTime(start,end){
                if(end===null)
                    end = new Date()
                let date = new Date(end).getTime() - new Date(start).getTime();   //时间差的毫秒数
                // //计算出小时数
                let hours=Math.floor(date/(3600*1000))
                //计算相差分钟数
                let leave=date%(3600*1000)        //计算小时数后剩余的毫秒数
                let minutes=Math.floor(leave/(60*1000))
                //计算相差秒数
                let leave2=leave%(60*1000)      //计算分钟数后剩余的毫秒数
                let seconds=Math.round(leave2/1000)
                return (hours ? hours +this.$t('rdsDetail.hours') : "") + (minutes ? minutes+this.$t('rdsDetail.minutes') : "") + (seconds? seconds+this.$t('rdsDetail.seconds'): "")
            }
        },
        created() {
            window.addEventListener('keyup', this.onKeyUpEvent)
        },
        beforeDestroy() {
            window.removeEventListener('keyup', this.onKeyUpEvent)
        }
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
