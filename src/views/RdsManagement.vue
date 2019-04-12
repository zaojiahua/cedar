<template>
    <Card>
        <comp-filter :prop-rds-filter="true" ref="jobFilter" @on-change="onJobFilterChange"></comp-filter>
        <Row style="margin-bottom: 20px">
            <Col span="16">
                <Button class="filter-btn">选取设备</Button>
                <Button class="filter-btn">选取用例</Button>
                <DatePicker type="daterange" placeholder="选择创建日期范围" :transfer="true"></DatePicker>
            </Col>
            <Col span="8" style="text-align: center">
                <Tag class="tip" type="dot" color="#1bbc9c">通过</Tag>
                <Tag class="tip" type="dot" color="#ffae25">未通过</Tag>
                <Tag class="tip" type="dot" color="#bdc3c7">无效</Tag>
            </Col>

        </Row>
        <comp-rds-list ref="rdsList" @showRdsInfo="showRdsInfo"></comp-rds-list>

        <Drawer v-model="showRdsDetail" :draggable="true" :closable="false" width="50">
            <comp-rds-detail ref="rdsDetail" @delRdsOne="delRdsOne"></comp-rds-detail>
        </Drawer>
    </Card>
</template>

<script>
    import CompDeviceList from "../components/CompDeviceList";
    import CompFilter from "../components/CompFilter";
    import CompJobList from "../components/CompJobList";
    import CompJobDetail from  "../components/CompJobDetail";
    import CompRdsList from  "../components/CompRdsList";
    import CompRdsDetail from  "../components/CompRdsDetail";

    export default {
        components:{CompDeviceList,CompFilter,CompJobList,CompJobDetail,CompRdsList,CompRdsDetail },
        data(){
            return{
                showRdsDetail:false,
            }
        },
        methods:{
            selectedDetail(selected){
                let conditions = []
                Object.keys(selected).forEach(key=>{
                    let condition = []
                    if(key==="phone_model"){
                        selected[key].forEach(item=>{
                            condition.push(item.phone_model_name)
                        })
                        conditions.push("device__"+key+"__phone_model_name__in="+"ReefList["+condition.join("{%,%}")+"]");
                    }else if(key==="android_version"){
                        selected[key].forEach(item=>{
                            condition.push(item.version)
                        })
                        conditions.push("device__android_version__version__in="+"ReefList["+condition.join("{%,%}")+"]");
                    }else if(key==="custom_tag"){
                        selected[key].forEach(item=>{
                            condition.push(item.custom_tag_name)
                        })
                        conditions.push("job__custom_tag__custom_tag_name__in=ReefList["+condition.join("{%,%}")+"]");
                    } else if(key==="job_assessment_value"){
                        selected[key].forEach(item=>{
                            if(item.job_assessment==="通过"){
                                item.job_assessment_value = "0"
                            }else if(item.job_assessment==="未通过"){
                                item.job_assessment_value = "1"
                            }else if(item.job_assessment==="无效"){
                                item.job_assessment_value="-1"
                            }
                            condition.push(item.job_assessment_value)
                        })
                        conditions.push("job_assessment_value__in=ReefList["+condition.join("{%,%}")+"]");
                    }
                })
                let param = conditions.join("&")
                return param
            },
            onJobFilterChange(selected){
                let param = this.selectedDetail(selected)
                this.$refs.rdsList.collapseDataChange();
                this.$refs.rdsList.refresh(
                    "api/v1/cedar/get_rds_group_by_device_label/?"+param
                )
            },
            showRdsInfo(rdsId){
                this.showRdsDetail = true;
                this.$refs.rdsDetail.refresh(rdsId);
            },
            delRdsOne(flag){
                this.showRdsDetail = flag;
                this.$refs.rdsList.delRdsDataOne();
            }
        }
    }
</script>

<style scoped>
    .filter-btn{
        margin-right: 16px;
    }
    .tip{
        border: none!important;
        cursor: default;
    }
</style>