<template>
    <div style="float: left;width: 200px;height: 30px;color: #fff">
        <span style="float: right; height: 18px;margin-top: -6px;">已使用：{{capacity.used}} <span style="color: #999">{{usedText}}</span> / {{capacity.total}} <span style="color: #999">{{totalText}}</span></span>
        <Progress hide-info :percent=percent :stroke-width="5" />
    </div>
</template>

<script>
    import config from "../lib/config"
    export default  {
        data(){
            return{
                capacity:{
                    free: 0,
                    total: 0,
                    used: 0,
                },
                usedText:"GB",
                totalText:"GB",
                percent:0,
            }
        },
        methods:{
            getReefUsage(){
                this.$ajax.get("api/v1/cedar/get_reef_space_usage/?unit=GB")
                    .then(response=>{
                        this.percent = response.data.total=== 0 ? 0 : parseFloat((response.data.used/response.data.total*100).toFixed(2))
                        this.usedText = this.totalText = "GB"
                        this.capacity = response.data
                        if(response.data.total>=10240){
                            this.capacity.total = parseFloat((response.data.total/1024).toFixed(2));
                            this.totalText = "T"
                        }
                        if(response.data.used>=10240){
                            this.capacity.used =  parseFloat((response.data.total/1024).toFixed(2));
                            this.usedText = "T"
                        }
                    }).catch(error=>{
                        if(config.DEBUG) console.log(error)
                        this.$Message.error("取得容量信息失败")
                })
            }
        },
        created(){
            this.getReefUsage()
        }
    }
</script>