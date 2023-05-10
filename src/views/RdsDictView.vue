<template>
    <!--<div>-->
        <div  class="demo-split">
            <Split v-model="split1">
                <div slot="left" class="demo-split-pane rds-box scroll-bar">
                    <Card dis-hover>
                        <Form :label-width="100">
                            <FormItem style="margin-bottom: 5px;">
                                <b slot="label">{{$t('tboardDetail.jobName')}}:</b>
                                <Input v-model="rdsInfo.job.job_name" class="disabled-input" disabled></input>
                            </FormItem>
                            <FormItem>
                                <b slot="label">{{$t('rdsDetail.devInfo')}}:</b>
                                <Input v-model="rdsInfo.device.device_name+'('+rdsInfo.device.device_label+')'" class="disabled-input" disabled></input>
                            </FormItem>
                        </Form>
                    </Card>
                    <comp-rds-dict-serialize :prop-data="content" :prop-pic-name="highLightFileName" style="width: 100%;margin-top: 10px"
                                             @on-pic-name-click="onPicNameClick"></comp-rds-dict-serialize>
                </div>
                <div slot="right" class="demo-split-pane rds-box" style="padding: 0 0 0 10px">
                    <gallery v-show="fileList.length>0" :pic-name="highLightFileName" :img-file="imgFile" @on-pic-click="afterGalleryClick"></gallery>
                    <div v-show="fileList.length===0" style="text-align: center;margin-top: 200px">
                        <span style="font-size: 18px;">{{$t('rdsInfoPage.noPic')}}</span>
                    </div>
                </div>
            </Split>
        </div>
</template>


<script>
    import config from "../lib/config"
    import utils from "../lib/utils"
    import CompRdsDictSerialize from "../components/CompRdsDictSerialize"
    import Gallery from "../components/common/Gallery"

    const rdsSerializer = {
        device: {
            id: "number",
            device_name: "string",
            device_label: "string"
        },
        id: "number",
        job: {
            id: "number",
            job_label: "string",
            job_name: "string",
        },
    }
    export default {
        components:{ CompRdsDictSerialize, Gallery },
        data(){
            return{
                content:[],
                split1: 0.35,
                fileList:[],
                highLightFileName:"",
                rdsInfo:utils.validate(rdsSerializer,{}),
                rdsId:null,
                imgFile:"",
                currentIndex:0,
            }
        },
        methods:{
            refresh(id){
                this.$ajax
                    .get("api/v1/cedar/rds/"+id+"/?fields=id,rds_dict," +
                        "device,device.id,device.device_name,device.device_label," +
                        "job,job.job_name,job.id,job.job_label")
                    .then(response=>{
                        this.content = response.data.rds_dict
                        this.rdsInfo = utils.validate(rdsSerializer,response.data)
                    }).catch(error=>{
                        if (config.DEBUG) console.log(error)
                        let errorMsg = "";
                        if (error.response.status >= 500) {
                            errorMsg = this.$t('public.error_500')
                        } else {
                            errorMsg = this.$t('rdsInfoPage.error_1')
                        }
                        this.$Message.error(errorMsg)
                    })
            },
            getFileList(rdsId){
                this.$ajax.get("api/v1/cedar/get_sort_rds_screenshot/?reverse=false&rds=" + rdsId)
                    .then(response=>{
                        this.fileList = response.data
                        this.highLightFileName = ""
                        this.currentIndex = 0
                        if(this.fileList.length>0){
                            this.highLightFileName = this.fileList[0].file_name
                            this.getImg(this.highLightFileName)
                        }
                    })
                    .catch(error=>{
                        if (config.DEBUG) console.log(error)
                        let errorMsg = "";
                        if (error.response.status >= 500) {
                            errorMsg = this.$t('public.error_500')
                        } else {
                            errorMsg = this.$t('rdsInfoPage.error_2')
                        }
                        this.$Message.error(errorMsg)
                    })
            },
            getImg(picName){
                this.$ajax.get("api/v1/cedar/rds_screenshot/?fields=file_name,img_file&rds=" + this.rdsId + "&file_name=" +picName)
                    .then(response=>{
                        this.imgFile = response.data.rdsscreenshots[0].img_file
                    })
                    .catch(error=>{
                        if (config.DEBUG) console.log(error)
                        this.imgFile = ""
                        let errorMsg = "";
                        if (error.response.status >= 500) {
                            errorMsg = this.$t('public.error_500')
                        } else {
                            errorMsg = this.$t('rdsInfoPage.error_2')
                        }
                        this.$Message.error(errorMsg)
                    })
            },
            afterGalleryClick(file){
                this.highLightFileName = file.file_name
            },
            onPicNameClick(picName){
                this.highLightFileName = picName
                this.getImg(picName)
                for (let i = 0; i < this.fileList.length; i++) {
                    if(this.fileList[i].file_name===picName){
                        this.currentIndex = i
                        return
                    }
                }
            },
            //键盘左右切换事件
            onKeyUpEvent(event) {
                if(this.fileList.length>0){
                    if (event.keyCode === 37) {  //左 ←
                        this.prevBtn()
                    } else if (event.keyCode === 39) {  //右 →
                        this.nextBtn()
                    }
                }
            },
            nextBtn(){
                if(this.fileList[this.currentIndex+1]){
                    this.currentIndex++
                    this.highLightFileName = this.fileList[this.currentIndex].file_name
                    this.imgFile = this.fileList[this.currentIndex].img_file
                }
            },
            prevBtn(){
                if(this.currentIndex===0)
                    return
                this.currentIndex--
                this.highLightFileName = this.fileList[this.currentIndex].file_name
                this.imgFile = this.fileList[this.currentIndex].img_file
            },
        },
        mounted(){
            if(this.$route.query.hasOwnProperty("id")) {
                this.refresh(this.$route.query.id)
                this.getFileList(this.$route.query.id)
                this.rdsId = this.$route.query.id
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
    .body-box{
        display: flex;
        flex-direction: row;
        height: 100%;
    }
    .rds-box{
        height: calc(100vh - 2px);
        overflow-y: auto
    }
    .demo-split{
        height: 100vh;
        border: 1px solid #dcdee2;
    }
    .demo-split-pane{
        padding: 10px;
    }
    .disabled-input >>> input {
        background-color: #0000;
        color: #515a6e;
        border: #eee dotted 1px;
    }
    /deep/.rds-box .ivu-form-item {
        margin-bottom: 0;
    }
    .scroll-bar::-webkit-scrollbar {/*滚动条整体样式*/
        width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
        height: 4px;
    }
    .scroll-bar::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
        border-radius: 5px;
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.1);
        background: rgba(0,0,0,0.2);
    }
    .scroll-bar::-webkit-scrollbar-track {/*滚动条里面轨道*/
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        border-radius: 0;
        background: rgba(0,0,0,0);
    }
</style>
