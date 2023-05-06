<template>
    <div>
        <div style="margin: 20px 0;">
            <Select v-model="resultRange" multiple style="width:230px" @on-change="invalidType='';filterType=''" :transfer="true" :placeholder="$t('rdsDeviceStatistic.selTip_1')">
                <Option value="0"> {{$t('tboardDetail.pass')}} </Option>
                <Option value="1"> {{$t('tboardDetail.fail')}} </Option>
                <Option value="-1"> {{$t('tboardDetail.invalid')}} </Option>
            </Select>
            <Select v-model="invalidType" v-show="resultRange.length===1&&resultRange[0]==='-1'&&invalidList.length>0" clearable style="width:230px;margin-left: 16px;" :transfer="true" :placeholder="$t('rdsDeviceStatistic.selTip_2')">
                <Option v-for="item in invalidList" :value="item.job_assessment_value"> {{ item.job_assessment_value }} ({{ item.count }}) </Option>
            </Select>
            <Select v-model="filterType" v-show="resultRange.length===1&&resultRange[0]==='1'" clearable style="width:230px;margin-left: 16px;" :transfer="true" :placeholder="$t('rdsTboardDeviceStatistic.tips_1')">
                <Option value="serious">{{$t('rdsDeviceStatistic.seriousFail')}}</Option>
            </Select>
            <p style="float: right;margin-top: -2px;">
                <Tag type="dot" color="#1bbc9c">{{$t('tboardDetail.pass')}}</Tag>
                <Tag type="dot" color="#FFAE25">{{$t('tboardDetail.fail')}}</Tag>
                <Tag type="dot" color="#F75F0D">{{$t('rdsDeviceStatistic.seriousFail')}}</Tag>
                <Tag type="dot" color="#BDC3C7">{{$t('tboardDetail.invalid')}}</Tag>
            </p>
            <div style="float: right;margin-right:20px;width:230px;">
                <Input class="search-box" v-model="rdsId" :number="true" search enter-button :placeholder="$t('rdsTboardDeviceStatistic.enter')" @on-search="rdsIdentify" @on-clear="onClearIdentify" :clearable="true"/>
            </div>
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
        <p v-show="!noMoreData" style="text-align: center" @click="onClickLoadMore"><Button>{{$t('rdsTboardDeviceStatistic.btn')}}</Button></p>
        <p v-show="noMoreData" style="text-align: center">{{$t('rdsDeviceStatistic.noMore')}}</p>
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
                rdsId:null,
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
            rdsIdentify(){
                if(typeof this.rdsId !== 'number'){
                    this.$Message.warning(this.$t('rdsTboardDeviceStatistic.tips_2'))
                    return
                }
                this.$refs.rdsCard._setSearchId(this.rdsId)
                this.$refs.rdsCard.showRdsIdentity(this.rdsId)
            },
            onClearIdentify(){
                this.rdsId = null
                this.$refs.rdsCard._setSearchId(this.rdsId)
                this.$refs.rdsCard.showRdsIdentity(this.rdsId)
            },
        }
    }
</script>

<style scoped>
/deep/.search-box .ivu-input-icon-clear{
    margin-right: 45px!important;
}
</style>
