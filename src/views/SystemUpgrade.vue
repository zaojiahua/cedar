<template>
    <Card style="text-align: center">
        <Upload :data="updateData" :action="updateUrl" :on-error="handleUploadError" :on-success="handleUploadSuccess" :format="['zip','rar']" :on-format-error="handleFormatError">
            <Button icon="ios-cloud-upload-outline">导入系统升级包</Button>
        </Upload>
    </Card>

</template>

<script>
    import utils from "../lib/utils"
    import config from "../lib/config"

    export default {
        data(){
            return{
                updateData:{
                    requestName:"getZipFile"
                },
                updateUrl:""
            }
        },
        methods:{
            handleUploadError(error){
                this.$Message.error("文件上传失败，请确认后重试！")
                if (config.DEBUG) console.log(error)
            },
            handleUploadSuccess(response){
                if(response.success){
                    let root = this;
                    this.$Modal.success({
                        title: "Success",
                        content: "文件上传成功，点击确定进行系统更新，并重启系统!",
                        onOk() {
                            root.$Message.info("正在准备升级系统，请稍后！");
                            root.$ajax.post(root.updateUrl,{
                                requestName:"VersionUpdate"
                            }).then(response=>{
                                if(config.DEBUG) console.log(response.data)
                            }).catch(error=>{
                                if(config.DEBUG) console.log(error)
                                root.$Message.error("系统升级失败，请检查后重试！")
                            })
                        }
                    })
                }else if(response.wrong){
                    this.$Notice.error({
                        title:"文件格式错误",
                        desc:"请选择正确的压缩包文件（zip或rar格式）"+response.wrong
                    })
                }
            },
            handleFormatError(){
                this.$Notice.error({
                    title:"文件格式错误",
                    desc:"请选择正确的压缩包文件（zip或rar格式）"
                })
            }
        },
        created(){
            this.updateUrl = "http://"+config.UPDATE_HOST+":"+config.ADMIN_PORT;
        }
    }
</script>

<style scoped>

</style>