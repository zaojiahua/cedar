<template>
    <div>
        <div class="sel-box" v-if="testIndex===0">
            <h3 class="sel-tip">请先确定任务类型</h3>
            <div style="text-align: center">
                <div class="sel-grey-box" style="margin-right: 30px;" @click="testIndex=1">
                    <Icon type="ios-photos-outline" size="50" />
                    <p>功能测试任务</p>
                </div>
                <div class="sel-grey-box" @click="testIndex=2">
                    <Icon type="ios-speedometer-outline" size="50" />
                    <p>性能测试任务</p>
                </div>
            </div>
        </div>
        <comp-creat-functional-test v-if="testIndex===1" @on-back-click="onSelectTestBack"></comp-creat-functional-test>

        <comp-creat-performance-test v-if="testIndex===2" @on-back-click = onSelectTestBack></comp-creat-performance-test>
    </div>

</template>

<script>
    import CompCreatFunctionalTest from  "../components/CompCreatFunctionalTest"
    import CompCreatPerformanceTest from  "../components/CompCreatPerformanceTest"





    import CompDeviceList from "../components/CompDeviceList";
    import CompFilter from "../components/CompFilter";
    import CompJobList from "../components/CompJobList";
    import CompJobDetail from  "../components/CompJobDetail"
    import config from "../lib/config";
    import utils from "../lib/utils";
    import main from "../main";


    export default {
        components: {CompCreatFunctionalTest, CompCreatPerformanceTest, CompJobList, CompDeviceList, CompFilter,CompJobDetail},
        data() {
            return {
              testIndex:0,

            }
        },
        methods: {
            onSelectTestBack(){
                this.testIndex = 0
            },
        }
    }
</script>

<style scoped>
    .sel-box{
        background-color: #fff;
        height: calc(100vh - 100px);
        border-radius: 5px;
        box-shadow: rgb(242, 242, 242) 2px 2px 5px;
    }
    .sel-tip{
        padding-top: 150px;
        color: rgb(170, 170, 170);
        text-align: center;
    }
    .sel-grey-box{
        display: inline-block;
        padding-top: 15px;
        width: 120px;
        height: 120px;
        background-color: #f2f2f2;
        margin-top: 30px;
        color: #969696;
        cursor: pointer;
    }
    .sel-grey-box p{
        margin-top: 12px;
    }

</style>

