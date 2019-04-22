<template>
    <Card style="margin-bottom: 16px;" dis-hover>
        <Divider orientation="left">{{ propDeviceLabel }}</Divider>
        <Row type="flex" style="margin-bottom: 16px;" align="bottom">
            <Button style="margin-right: 16px;">选取任务</Button>
            <Tag closable>TBoard1</Tag>
        </Row>
        <Row type="flex" style="margin-bottom: 16px;" align="bottom">
            <Button style="margin-right: 16px;">选取用例</Button>
            <Tag closable>Job1</Tag>
            <Tag closable>Job1</Tag>
            <Tag closable>Job1</Tag>
        </Row>
        <div>
            <div style="height: 16px; width: 16px; background-color: #1bbc9c; display: inline-block; margin-right: 2px; cursor: pointer;"
                 v-for="item in rdsData.rds" :key="item.id"></div>
            <Button style="width: 100%; margin-top: 8px;" v-if="rdsData.showMoreData" @click="showMoreRds(propDeviceId)">加载更多</Button>
        </div>
    </Card>
</template>

<script>
    import config from "../lib/config";
    import utils from "../lib/utils";


    export default {
        name:"CompRdsList",
        props:{
            propDeviceLabel:{
                type:String,
                default:"",
            },
            propDeviceId:{
                type:Number,
                default:null,
            },
        },
        data :function () {
            return{
                rdsData:{},
            }
        },
        methods:{
            getRdsByDevice(){
                let Obj = {};
                this.$ajax
                    .get("api/v1/cedar/rds/?fields="+
                        "id,"+
                        "end_time,"+
                        "start_time,"+
                        "job_assessment_value,"+
                        "device,device.id,device.device_label,device.device_name,"+
                        "job,job.id,job.job_label,job.job_name,"+
                        "tboard,tboard.id,tboard.board_name"+
                        "&offset=0&limit=100"+
                        "&device__id="+this.propDeviceId)
                    .then(response=>{
                        Obj.device_id = this.propDeviceId;
                        Obj.device_label = this.propDeviceLabel;
                        Obj.rds = response.data.rdss;
                        this.$ajax
                            .get("api/v1/cedar/rds/?fields="+
                                "id,"+
                                "end_time,"+
                                "start_time,"+
                                "job_assessment_value,"+
                                "device,device.id,device.device_label,device.device_name,"+
                                "job,job.id,job.job_label,job.job_name,"+
                                "tboard,tboard.id,tboard.board_name"+
                                "&offset=99&limit=1"+
                                "&device__id="+this.propDeviceId)
                            .then(response=>{
                                Obj.showMoreData = response.data.rdss.length > 0;
                                this.rdsData = Obj;
                            }).catch(reason=>{
                                if (config.DEBUG) console.log(reason)
                                this.$Message.error("数据加载失败！")
                        })
                    }).catch(error=>{
                        if (config.DEBUG) console.log(error)
                        this.$Message.error("数据加载失败!")
                    })
            },
            showMoreRds(device_id){
                let offsetIndex = this.rdsData.rds.length;
                this.$ajax
                    .get("api/v1/cedar/rds/?fields="+
                        "id,"+
                        "end_time,"+
                        "start_time,"+
                        "job_assessment_value,"+
                        "device,device.id,device.device_label,device.device_name,"+
                        "job,job.id,job.job_label,job.job_name,"+
                        "tboard,tboard.id,tboard.board_name" +
                        "&offset="+offsetIndex+"&limit=100"+
                        "&device__id="+device_id
                    ).then(response=>{
                    if(response.data.rdss.length>0){
                        this.rdsData.rds = this.rdsData.rds.concat(response.data.rdss);
                    }
                    else {
                        this.rdsData.showMoreData=false;
                        this.$Message.info("没有更多数据了！");
                    }
                }).catch(error=>{
                    if (config.DEBUG) console.log(error)
                })
            }

        },
        created(){
            this.getRdsByDevice()
        }
    }
</script>

<style scoped>

</style>