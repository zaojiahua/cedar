<template>
    <!--<div>-->
        <div  class="demo-split">
            <Split v-model="split1">
                <div slot="left" class="demo-split-pane rds-box scroll-bar">
                    <comp-rds-dict-serialize :prop-data="content" :prop-pic-name="highLightFileName" :prop-pic-list="fileList" style="width: 100%;"
                                             @on-pic-name-click="onPicNameClick"></comp-rds-dict-serialize>
                </div>
                <div slot="right" class="demo-split-pane rds-box" style="padding: 0 0 0 10px">
                    <gallery v-show="fileList.length>0" :pic-url="fileList" :pic-name="highLightFileName" @on-pic-click="afterGalleryClick"></gallery>
                    <div v-show="fileList.length===0" style="text-align: center;margin-top: 200px">
                        <span style="font-size: 18px;">暂无图片!</span>
                    </div>
                </div>
            </Split>
    </div>
</template>


<script>
    import config from "../lib/config"
    import CompRdsDictSerialize from "../components/CompRdsDictSerialize"
    import Gallery from "../components/common/Gallery"

    export default {
        components:{ CompRdsDictSerialize, Gallery },
        data(){
            return{
                content:[],
                split1: 0.35,
                fileList:[],
                highLightFileName:"",
            }
        },
        methods:{
            refresh(id){
                this.$ajax
                    .get("api/v1/cedar/rds/"+id+"/?fields=id,rds_dict")
                    .then(response=>{
                        this.content = response.data.rds_dict
                    }).catch(error=>{
                        if (config.DEBUG) console.log(error)
                        let errorMsg = "";
                        if (error.response.status >= 500) {
                            errorMsg = "服务器错误！"
                        } else {
                            errorMsg = "rdsDict读取失败！"
                        }
                        this.$Message.error(errorMsg)
                    })
            },
            getFileList(rdsId){
                this.$ajax.get("api/v1/cedar/get_sort_rds_screenshot/?reverse=false&rds=" + rdsId)
                    .then(response=>{
                        this.fileList = response.data
                        this.highLightFileName = ""
                        if(this.fileList.length>0)
                            this.highLightFileName = this.fileList[0].file_name
                    })
                    .catch(error=>{
                        if (config.DEBUG) console.log(error)
                        let errorMsg = "";
                        if (error.response.status >= 500) {
                            errorMsg = "服务器错误！"
                        } else {
                            errorMsg = "截图获取失败！"
                        }
                        this.$Message.error(errorMsg)
                    })
            },
            afterGalleryClick(file){
                this.highLightFileName = file.file_name
            },
            onPicNameClick(picName){
                this.highLightFileName = picName
            }
        },
        mounted(){
            if(this.$route.query.hasOwnProperty("id")) {
                this.refresh(this.$route.query.id)
                this.getFileList(this.$route.query.id)
            }
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
