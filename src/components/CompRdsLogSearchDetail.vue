<template>
    <div>
        <Card>
            <pre>
                {{logContent }}
            </pre>
        </Card>
        <Spin size="large" fix v-if="showLoading"></Spin>
    </div>
</template>

<script>
    import config from "../lib/config";
    export default {
        data(){
            return{
                logContent:"",
                showLoading:false,
            }
        },
        methods:{
            refresh(url){
                this.showLoading = true;
                this.$ajax.get(url)
                    .then(response=>{
                        this.showLoading = false;
                        this.logContent = response.data;
                    })
                    .catch(error=>{
                        if(config.DEBUG) console.log(error)
                        this.$Message.error("日志文件读取失败")
                        this.showLoading = false;
                    })
            }
        }
    }
</script>

<style scoped>
    pre{
        white-space: pre-wrap;
        overflow-wrap: break-word;
    }
</style>
