<template>
    <div>
        <div class="container_left">
            <b>测试集目录</b>
            <Tree ref="tree" :data="treeData" show-checkbox @on-select-change="onTreeClick" @on-check-change="onTreeSelect"></Tree>
        </div>
        <div class="container_right">
            <p style="margin-bottom: 5px">测试集名称：{{ testName }}</p>
            <comp-test-set-job-table ref="jobTable"></comp-test-set-job-table>
            <Row style="text-align: right;">
                <Button style="margin-right: 20px;width: 90px;" @click="onBack">上一步</Button>
                <Button type="primary" @click="nextStep" :loading="showLoadingBtn">下一步( {{ selectedSet.length }} )</Button>
            </Row>
        </div>
    </div>
</template>

<script>
    import config from "../lib/config"
    import utils from "../lib/utils";
    import CompTestSetJobTable from "../components/CompTestSetJobTable"

    export default {
        components:{ CompTestSetJobTable },
        data(){
            return{
                treeData: [ ],
                testName:"",
                selectedSet:[],
                showLoadingBtn:false,
            }
        },
        methods:{
            refresh(){
                this.$ajax.get("api/v1/cedar/test_gather/?fields=id,name,job_count&ordering=-update_time")
                    .then(response=>{
                        let data = response.data.test_gather
                        // 去除空的测试集
                        data = data.filter(item=>{
                            return item.job_count>0
                        })
                        let children = []
                        data.forEach((item,index)=>{
                            if(index===0)
                                children.push({
                                    id:item.id,
                                    title:item.name,
                                    selected:true
                                })
                            else
                                children.push({
                                    id:item.id,
                                    title:item.name
                                })
                        })
                        this.treeData = [{
                            title: '全部测试集',
                            expand: true,
                            children: children
                        }]
                        this.testName = this.treeData[0].children[0].title
                        this.$nextTick(()=>{
                            this.$refs.jobTable.refresh(this.treeData[0].children[0].id)
                        })
                    }).catch(error=>{
                        if(config.DEBUG) console.log(error)
                        this.$Message.error({content:"测试集信息获取失败"+error.response.data.description,duration:6})
                })
            },
            onTreeClick(select,item){
                if(select.length===0)
                    return
                if(item.expand!== undefined )
                    return
                this.testName = item.title
                this.$refs.jobTable.refresh(item.id)
            },
            onTreeSelect(select,item){
                this.selectedSet = select.filter(item=>{
                    return item.expand === undefined
                })
            },
            nextStep(){
                if(this.selectedSet.length===0){
                    this.$Message.warning("请至少选择一个测试集！")
                    return
                }
                this.showLoadingBtn = true
                let ids = []
                this.selectedSet.forEach(item=>{
                    ids.push(item.id)
                })
                this.$ajax.post('api/v1/cedar/merge_test_gather/',{
                    test_gathers:ids
                }).then(response=>{
                    this.showLoadingBtn = false
                    this.$emit("on-next-step",response.data.job_label_list,this.selectedSet)
                }).catch(error=>{
                    this.showLoadingBtn = false
                    if(config.DEBUG) console.log(error)
                    this.$Message.error({content:"用例信息合并失败"+error.response.data.description,duration:6})
                })
            },
            onBack(){
                let _this = this
                this.$Modal.confirm({
                    title:"提示",
                    content:"返回上一步将不会保存已选测试集，是否继续？",
                    onOk(){
                        _this.$emit("on-back")
                    }
                })
            }

        },
        created(){
            this.refresh()
        }
    }
</script>

<style scoped>
    /deep/.ivu-checkbox-wrapper + span, .ivu-checkbox + span{
        text-overflow: ellipsis;
        width: 205px;
        overflow: hidden;
        white-space: nowrap;
        /*width: 220px;*/
        /*text-overflow:inherit;*/
        /*overflow: visible;*/
        /*white-space: pre-line;*/
    }
    /deep/.ivu-page:after{
        display: none;
    }
    .container_left{
        float: left;
        width: 300px;
        padding: 10px;
        max-height: 1000px;
        overflow: auto;
        border: 1px solid #dcdcdc;
    }
    .container_right{
        margin-left: 310px;
    }
</style>
