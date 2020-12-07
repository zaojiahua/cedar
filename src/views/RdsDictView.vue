<template>
    <div>
        <pre>{{ content }}</pre>
    </div>
</template>


<script>
    import config from "../lib/config"
    export default {
        data(){
            return{
                content:{}
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
            }
        },
        mounted(){
            if(this.$route.query.hasOwnProperty("id")) {
                this.refresh(this.$route.query.id)
            }
        }
    }
</script>