<template>
    <Upload :data="updateData" :action="updateUrl" :on-error="handleUploadError" :on-success="handleUploadSuccess">
        <Button icon="ios-cloud-upload-outline">导入系统升级包</Button>
    </Upload>
</template>

<script>
    import utils from "../lib/utils"
    import config from "../lib/config"

    export default {
        data(){
            return{
                updateData:{
                    requestName:"setNewZip"
                },
                updateUrl:""
            }
        },
        methods:{
            handleUploadError(){

            },
            handleUploadSuccess(){

            },
        },
        created(){
            this.updateUrl = utils.getCoralUrl(config.ADMIN_PORT)
        }
    }
</script>

<style scoped>

</style>