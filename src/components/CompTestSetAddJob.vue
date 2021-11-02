<template>
    <div>
        <Row>
            <comp-filter ref="jobFilter" @on-change="onJobFilterChange"></comp-filter>
        </Row>
        <Row>
            <comp-job-list ref="jobList" :prop-auto-load="true" :prop-multi-select="true" :prop-not-inner="true" @get-job-count="getJobCount"></comp-job-list>
        </Row>
    </div>
</template>

<script>
    import config from "../lib/config"
    import utils from "../lib/utils"
    import CompFilter from "../components/CompFilter"
    import CompJobList from "../components/CompJobList"

    export default{
        components:{ CompFilter, CompJobList },
        data(){
            return{

            }
        },
        methods:{
            getSelection(){
                return this.$refs.jobList.getSelection()
            },
            onJobFilterChange(selected){
                this.$refs.jobList.refreshWithParam("&" + this.selectedDetail(selected))
            },
            // Page "Choose job"
            selectedDetail(selected){
                let conditions = []
                Object.keys(selected).forEach(key=>{
                    let condition = []  // store id data like [1,2,3]
                    if(key==="type"){    //key = cabinet_type时，condition=>name
                        selected[key].forEach(item=>{
                            condition.push(item.type)
                        })
                    }else {
                        selected[key].forEach(item=>{
                            condition.push(item.id)
                        })
                    }
                    // 不统一的命名额外处理
                    if(key==="job_test_area") key = "test_area"
                    else if(key==="phone_model") key = "phone_models"
                    else if(key==="reefuser") key = "author"

                    condition.forEach(item=>{
                        item = key+"__id="+item
                    })

                    let conditionStr = ""
                    if(key==="type"){
                        conditionStr = "cabinet_type__in=ReefList["+condition.join("{%,%}")+"]"
                    }else {
                        conditionStr = key+"__id__in="+"ReefList["+condition.join("{%,%}")+"]"
                    }
                    conditions.push(conditionStr)
                })

                let param = conditions.join("&")
                return param
            },
            getJobCount(number){
                this.$emit("get-job-count",number)
            }
        },
        mounted(){
        }
    }
</script>
<style scoped>

</style>
