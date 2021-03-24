<template>
    <div>
        <Drawer v-model="showRdsDetail" :closable="false" width="50" transfer>
            <comp-rds-detail ref="rdsDetail" :prop-asses="true" @delRdsOne="delRdsOne"></comp-rds-detail>
        </Drawer>
        <Card style="margin-bottom: 16px;" dis-hover>
            <Row type="flex">
                <Spin v-show="loadingData" size="large" style="position: absolute; width: 100%; height: inherit; left: 50%;"></Spin>
                <div :class="loadingData ? 'opacity-row' : ''">
                    <div class="rds-box"
                         v-for="(item,index) in rdsData" :key="item.id" :class="getRdsColorClass(item.job_assessment_value)" @mouseenter="onRdsMouseEnter(item)"
                         @mouseleave="onRdsMouseLeave" @click="onRdsBoxClick(item,index)">
                        <Icon v-if="item.isAsses && (item.assesNum===4)" type="md-help" color="#fff" />
                        <Icon v-else type="md-help" color="#00000000" />
                    </div>
                </div>
            </Row>
        </Card>
    </div>

</template>

<script>
    import config from "../lib/config";
    import utils from "../lib/utils";

    import CompRdsDetail from "./CompRdsDetail";

    // const pageSize = config.LARGE_PAGE_SIZE

    const getRdsSerializer = {
        rdss: [
            {
                id: "number",
                job_assessment_value: "string",
                job: {
                    id: "number",
                    job_name: "string",
                },
                device: {
                    id: "number",
                    device_name: "string",
                }
            }
        ]
    }

    export default {
        name: "CompAssesRdsCard",
        components: { CompRdsDetail },
        props: {
            propTboardId: {  // tboard data with id and board_name
                type: Number,
                default: null
            },
        },
        data: function () {
            return {
                dataOffset: 0,
                rdsData: [],
                loadingData: false,
                showRdsDetail: false,
                rdsIndex:null,
            }
        },
        methods: {
            onRdsMouseEnter(item) {
                this.$emit('rds-mouse-enter', item)
            },
            onRdsMouseLeave() {
                this.$emit('rds-mouse-leave')
            },
            loadMoreData() {
                this.loadingData = true
                this.$ajax.get("api/v1/cedar/filter_rds_validity/?" +
                    "&tboard=" + this.propTboardId +
                    "&ordering=-start_time")
                    .then(response=>{
                        this.loadingData = false
                        this.rdsData = utils.validate(getRdsSerializer, response.data).rdss

                        this.rdsData = [
                                    {
                                        "device":{
                                            "id":19,
                                            "device_name":null
                                        },
                                        "id":322,
                                        "job":{
                                            "id":3879,
                                            "job_name":"testRotate"
                                        },
                                        "job_assessment_value":"0",
                                        isAsses:true,
                                        assesNum:4,
                                    },
                            {
                                "device":{
                                    "id":19,
                                    "device_name":null
                                },
                                "id":341,
                                "job":{
                                    "id":3879,
                                    "job_name":"testRotate"
                                },
                                "job_assessment_value":"0",
                                isAsses:true,
                                assesNum:3,
                            },
                            {
                                "device":{
                                    "id":19,
                                    "device_name":null
                                },
                                "id":34,
                                "job":{
                                    "id":3879,
                                    "job_name":"testRotate"
                                },
                                "job_assessment_value":"-2",
                                isAsses:false,
                                assesNum:0,
                            },
                            {
                                "device":{
                                    "id":19,
                                    "device_name":null
                                },
                                "id":3,
                                "job":{
                                    "id":3879,
                                    "job_name":"testRotate"
                                },
                                "job_assessment_value":"1",
                                isAsses:true,
                                assesNum:4,
                            },
                            {
                                "device":{
                                    "id":19,
                                    "device_name":null
                                },
                                "id":311,
                                "job":{
                                    "id":3879,
                                    "job_name":"testRotate"
                                },
                                "job_assessment_value":"0",
                                isAsses:true,
                                assesNum:4,
                            },
                            {
                                "device":{
                                    "id":19,
                                    "device_name":null
                                },
                                "id":11,
                                "job":{
                                    "id":3879,
                                    "job_name":"testRotate"
                                },
                                "job_assessment_value":"1",
                                isAsses:false,
                                assesNum:4,
                            }
                                ]


                    })
                    .catch(error=>{
                        if (config.DEBUG) console.log(error)
                        this.$Message.error("RDS数据加载失败!")
                        this.loadingData = false
                    })
            },

            onRdsBoxClick(rds,rdsIndex){
                this.showRdsDetail = true
                this.$refs.rdsDetail.refresh(rds.id,rds.job.id)
                this.rdsIndex=rdsIndex;
            },
            delRdsOne(){
                this.showRdsDetail = false;
                this.rdsData.splice(this.rdsIndex, 1)   /////////////
            },
            getRdsColorClass(type) {
                if (type === "0") return "success"
                if (type === "1") return "failed"
                return "invalid"
            },
        },
        watch:{

        },
        created() {
            this.loadMoreData()
        }
    }
</script>

<style scoped>
    .rds-box {
        height: 24px;
        width: 24px;
        display: inline-block;
        margin-right: 2px;
        cursor: pointer;
        text-align: center;
        border: #00000000 1px solid;
    }

    .rds-box:hover {
        border: #000000 1px solid;
    }

    .opacity-row {
        opacity: 0.5;
    }
    .success{
        background-color: #1bbc9c;
    }
    .failed{
        background-color: #FFAE25;
    }
    .invalid{
        background-color: #BDC3C7;
    }
</style>