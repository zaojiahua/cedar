<template>
    <div>
        <div style="margin: 20px 0;">
            <Select v-model="resultRange" multiple style="width:230px" @on-change="invalidType='';filterType=''" :transfer="true" placeholder="请选择测试结果类型">
                <Option value="0"> 成功 </Option>
                <Option value="1"> 失败 </Option>
                <Option value="-1"> 无效 </Option>
            </Select>
            <Select v-model="invalidType" v-show="resultRange.length===1&&resultRange[0]==='-1'&&invalidList.length>0" clearable style="width:230px;margin-left: 16px;" :transfer="true" placeholder="请选择无效类型">
                <Option v-for="item in invalidList" :value="item.job_assessment_value"> {{ item.job_assessment_value }} ({{ item.count }}) </Option>
            </Select>
            <Select v-model="filterType" v-show="resultRange.length===1&&resultRange[0]==='1'" clearable style="width:230px;margin-left: 16px;" :transfer="true" placeholder="请选择失败类型">
                <Option value="serious">严重失败</Option>
            </Select>
            <p style="float: right">
                <Tag type="dot" color="#1bbc9c">成功</Tag>
                <Tag type="dot" color="#FFAE25">失败</Tag>
                <Tag type="dot" color="#F75F0D">严重失败</Tag>
                <Tag type="dot" color="#BDC3C7">无效</Tag>
            </p>
        </div>
        <comp-rds-card ref="rdsCard"
                       :prop-device-id="propDeviceId"
                       :prop-job-id="propJobId"
                       :update-rds="updateRds"
                       :prop-tboard-id="propTboardId"
                       :prop-result-range="resultRange"
                       :prop-invalid-type="invalidType"
                       :prop-filter-type="filterType"
                       @after-load-data="afterLoadData"
                       @rds-mouse-enter="onRdsMouseEnter"
                       @rds-mouse-leave="onRdsMouseLeave">
        </comp-rds-card>
        <div v-show="scrollMore" style="position: relative;height: 50px;">
            <Spin fix>
                <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                <div>Loading</div>
            </Spin>
        </div>
        <p v-show="!noMoreData" style="text-align: center" @click="onClickLoadMore"><Button>点击加载更多</Button></p>
        <p v-show="noMoreData" style="text-align: center">暂无更多数据</p>
    </div>
</template>

<script>
    import CompRdsCard from "./CompRdsCard";

    export default {
        name: "CompRdsCardGroupList",
        components:{ CompRdsCard },
        props:{
            propDeviceId: {
                type: Number,
                default: null
            },
            propJobId: {
                type: Number,
                default: null
            },
            propTboardId: {
                type: Number,
                default: null
            },
            updateRds:{
                type: String,
                default: ""
            },
            invalidList:{
                type:Array,
                default: ()=>{return []}
            }
        },
        data(){
            return{
                resultRange:[],
                invalidType:'',
                filterType:'',
                scrollMore:false,
                noMoreData:false,
            }
        },
        methods:{
            // RDS 相 关
            afterLoadData(flag){
                this.scrollMore = false
                this.noMoreData = !flag
            },
            onRdsMouseEnter(rds) {
                this.$emit("rds-mouse-enter",rds)
            },
            onRdsMouseLeave() {
                this.$emit("rds-mouse-leave")
            },
            onClickLoadMore(){
                this.scrollMore = true
                this.$refs.rdsCard.loadMoreData(false)
            },
        }
    }
</script>

<style scoped>

</style>
