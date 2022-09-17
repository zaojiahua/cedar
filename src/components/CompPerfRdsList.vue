<template>
    <div>
        <!--<RadioGroup v-model="groupType" type="button" style="margin-top: 20px;">-->
            <!--<Radio style="width: 100px;text-align: center;margin-bottom: 12px" :label="0">成功RDS</Radio>-->
            <!--<Radio style="width: 100px;text-align: center;margin-bottom: 12px" :label="1">失败RDS</Radio>-->
        <!--</RadioGroup>-->

        <comp-perf-rds-card ref="perfRdsCard" v-show="groupType===0" :is-min="isMin" :prop-job-id="propJobId" :prop-tboard-id="propTboardId" :prop-tboard-id-list="propTboardIdList" :prop-time-range="propTimeRange" :prop-auto-load="false"></comp-perf-rds-card>
        <!--<comp-perf-rds-card v-show="groupType===1" :is-min="isMin" :propResult="1" :prop-job-id="propJobId" :prop-tboard-id="propTboardId" :prop-tboard-id-list="propTboardIdList"></comp-perf-rds-card>-->
    </div>

</template>

<script>
    import CompPerfRdsCard from "./CompPerfRdsCard";

    import config from "../lib/config";
    import utils from "../lib/utils";

    export default {
        name: "CompRdsList",
        components: { CompPerfRdsCard, },
        props: {
            propTboardId: {  // 单个tboard
                type: Number,
                default: null
            },
            propTboardIdList:{   //tboard 列表  id
                type: Array,
                default: ()=>{return []}
            },
            propJobId: {
                type: Number,
                default: null
            },
            propTimeRange:{
                type: String,
                default: ""
            },
            isMin:{
                type: Boolean,
                default: false
            }
        },
        data: function () {
            return {
                groupType:0,
            }
        },
        methods: {

        },
        watch:{
            propTimeRange: {
                handler: function(val){
                           console.log(val)
                },
                immediate: true
            }
        },
        created() {

        }
    }
</script>

<style scoped>
    .ivu-radio-group-button .ivu-radio-wrapper-checked {
        border-color: #1bbc9c!important;
        background: #1bbc9c!important;
        color: #fff!important;
    }
    .ivu-radio-group-button .ivu-radio-wrapper-checked:hover {
        color: #fff!important;
    }
</style>
