<template>
    <div>
        <Card :bordered="false" style="box-shadow:2px 2px 5px #f2f2f2" class="content">
            <b style="border-left: 3px solid #1bbc9c;padding-left: 10px;font-size: 16px">{{ data.board_name }}（ {{data.end_time===null?"进行中":"已完成"}} ）</b><span style="color: #979797;font-size: 12px"> x{{data.repeat_time}}轮</span>
            <Row class="t-font" style="margin-top: 5px;">
                <span class="dot"></span><span>{{ data.author.username }}</span>
                <span class="tit">创建</span><span>{{ data.board_stamp }}</span>
                <span class="tit">截止</span><span>{{ data.end_time!==null?data.end_time:new Date().format("yy-MM-dd hh:mm:ss")}}</span>
                <span class="tit" style="margin-left: 50px"><span class="dot"></span>历时</span><span>{{ diffTime(data.board_stamp,data.end_time) }}</span>
            </Row>

            <Row style="margin: 30px 0;">
                <span style="border-left: 3px solid #1bbc9c;padding-left: 10px;">人工评定RDS汇总</span>
                <p style="float: right;font-size: 12px">
                    <span class="rds-tag-border"><span class="dot-rds" style="background: #1bbc9c;"><Icon type="md-help" /></span>待评定</span>
                    <span class="rds-tag-border"><span class="dot-rds" style="background: #1bbc9c;"></span>通过</span>
                    <span class="rds-tag-border"><span class="dot-rds" style="background: #FFAE25;"></span>未通过</span>
                    <span class="rds-tag-border"><span class="dot-rds" style="background: #BDC3C7;"></span>无效</span>
                </p>
            </Row>
            <comp-asses-rds-card :prop-tboard-id="propTboardId"
                                 @rds-mouse-enter="onRdsMouseEnter"
                                 @rds-mouse-leave="onRdsMouseLeave">

            </comp-asses-rds-card>
        </Card>

        <div  v-show="tipData.id"  style="float: right;margin-top: -123px; background-color: #434343; border-radius: 5px;opacity: 0.9; color: #ebf7ff; padding: 8px;">
            <span>ID：</span>
            <span>{{tipData.id}}</span>
            <br>
            <span>设备名称：</span>
            <span>{{tipData.device.device_name}}</span>
            <br>
            <span>用例名称：</span>
            <span>{{tipData.job.job_name}}</span>
            <br>
            <span>结果：</span>
            <span>{{tipData.job_assessment_value}}</span>
            <br>
            <span>剩余评定次数：</span>
            <span>{{tipData.assesNum}}</span>
        </div>
    </div>

</template>

<script>
    import config from "../lib/config";
    import utils from "../lib/utils";
    import CompAssesRdsCard from "./CompAssesRdsCard"


    const getTboardSerializer = {
        id: "number",
        board_stamp: "date",
        board_name: "string",
        author:{
            id: "number",
            username: "string"
        },
        end_time: "date",
        repeat_time:"number",
    }
    const tipDataSerializer = {
        id: "number",
        device: {
            device_name: "string"
        },
        job: {
            job_name: "string"
        },
        job_assessment_value: "string",
        assesNum:"number"
    }


    export default {
        name: "CompAssessRdsView",
        components:{ CompAssesRdsCard },
        props:{
            propTboardId:{
                type: Number,
            }
        },
        data(){
            return{
                data:utils.validate(getTboardSerializer, {}),
                tipData:utils.validate(tipDataSerializer, null),
            }
        },
        methods:{
            getTboardInfo(){
                this.$ajax.get("/api/v1/cedar/tboard/"+ this.propTboardId +"/?fields=id,board_name," +
                    "repeat_time," +
                    "author,author.id,author.username," +
                    "board_stamp," +
                    "end_time")
                    .then(response=>{
                        this.data = response.data
                        console.log(this.data)
                    })
                    .catch(error=>{
                        if(config.DEBUG) console.log(error)
                        this.$Message.error("获取待评定任务信息失败！")
                    })
            },
            diffTime(start,end){
                if(end===null)
                    end = new Date()
                let date = new Date(end).getTime() - new Date(start).getTime();   //时间差的毫秒数
                // //计算出小时数
                let hours=Math.floor(date/(3600*1000))
                //计算相差分钟数
                let leave=date%(3600*1000)        //计算小时数后剩余的毫秒数
                let minutes=Math.floor(leave/(60*1000))
                //计算相差秒数
                let leave2=leave%(60*1000)      //计算分钟数后剩余的毫秒数
                let seconds=Math.round(leave2/1000)
                return hours+" 小时 "+minutes+" 分钟"+seconds+" 秒"
            },
            onRdsMouseEnter(rds) {
                this.tipData = utils.validate(tipDataSerializer, rds)
            },
            onRdsMouseLeave() {
                this.tipData = utils.validate(tipDataSerializer, null)
            },

        },
        created(){
            this.getTboardInfo()
        }
    }
</script>

<style scoped>
    .tit{
        color: #979797;
        margin: 0 10px 0 20px;
    }
    .t-font span{
        font-size: 12px;
    }
    .dot{
        background: #ccc;
        display: inline-block;
        width: 8px;
        height: 8px;
        margin-right: 10px;
        border-radius: 50%
    }
    .dot-rds{
        display: inline-block;
        width: 14px;
        height: 14px;
        text-align: center;
        color: #fff;
        margin-right: 8px;
        border-radius: 50%;
        vertical-align: -0.125em;
    }
    .dot-rds>>>.ivu-icon{
        vertical-align: 0;
    }
    .rds-tag-border{
        border: 1px solid #e8eaec;
        padding: 5px 10px;
        margin-left: 10px;
        border-radius: 5px;
    }
</style>