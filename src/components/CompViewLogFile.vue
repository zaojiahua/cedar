<template>
    <div>
        <pre>
            {{ logContent }}
        </pre>
        <Spin size="large" fix v-if="showSpin"></Spin>
    </div>
</template>

<script>
    import config from "../lib/config";

    export default {
        name:"CompViewLogFile",
        data(){
            return{
                logContent: "",
                showSpin: false,
            }
        },
        methods:{
            refresh(path){
                this.showSpin = true;
                this.$ajax.get(path)
                    .then(response=>{
                        this.showSpin = false;
                        this.logContent = response.data
                    })
                    .catch(error=>{
                        this.showSpin = false;
                        if(config.DEBUG) console.log(error)
                        this.$Message.error(this.$t('rdsLogSearch.error_2'))
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
