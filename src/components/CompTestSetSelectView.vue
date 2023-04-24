<template>
    <div>
        <div class="container_left">
            <b>{{$t('testSetSelView.tit')}}</b>
            <Tree v-if="showTree" ref="tree" :data="treeData" show-checkbox @on-select-change="onTreeClick" @on-check-change="onTreeSelect"></Tree>
            <p v-else style="color: #FF9900;margin-top: 10px">{{$t('public.noData')}}</p>
        </div>
        <div class="container_right">
            <p style="margin-bottom: 5px">{{$t('testSetSelView.name')}}：{{ testName }}</p>
            <comp-test-set-job-table ref="jobTable" :prop-multi-select="false"></comp-test-set-job-table>
            <Row style="text-align: right;">
                <Button style="margin-right: 20px;width: 90px;" @click="onBack">{{$t('public.btn_prev')}}</Button>
                <Button type="primary" @click="nextStep" :loading="showLoadingBtn">{{$t('public.btn_next')}}( {{ selectedSet.length }} )</Button>
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
                showTree:true,
            }
        },
        methods:{
            refresh(){
                this.$ajax.all([
                    this.$ajax.get("api/v1/cedar/test_gather/?fields=id,name,job_count&ordering=-update_time"),
                    this.$ajax.get("api/v1/cedar/test_project/?fields=id,name,test_gather_count,test_gather.id,test_gather.name,test_gather.job_count"),
                ]).then(this.$ajax.spread((all_resp,project_resp) => {
                    //  处 理 全 部 测 试 集
                    let data = all_resp.data.test_gather
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

                    //  处 理 项 目 层 级 的 测 试 集
                    let project = project_resp.data.test_project
                    // 去 除 空 的 项 目 里 面 空 的 测 试 集
                    project.forEach(pro=>{
                        pro.test_gather = pro.test_gather.filter(item=>{
                            return item.job_count>0
                        })
                    })
                    project = project.filter(item=>{
                        return item.test_gather.length>0
                    })
                    let projectData = []
                    project.forEach(item=>{
                        let projectChildren = []
                        item.test_gather.forEach(test=>{
                            projectChildren.push({
                                id:test.id,
                                title:test.name
                            })
                        })
                        projectData.push({
                            title: item.name,
                            expand: false,
                            children: projectChildren
                        })
                    })

                    this.treeData = [{
                        title: this.$t('testSetManagement.allTestSet'),
                        expand: true,
                        children: children
                    }].concat(projectData)
                    if(this.treeData[0].children.length>0){
                        this.showTree = true
                        this.testName = this.treeData[0].children[0].title
                        this.$nextTick(()=>{
                            this.$refs.jobTable.refresh(this.treeData[0].children[0].id)
                        })
                    }else {
                        this.showTree = false
                    }
                }))
                .catch(error=>{
                    if (config.DEBUG) console.log(error)
                    this.$Message.error({content:this.$t('testSetSelView.getErr'),duration:5})
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
                    this.$Message.warning(this.$t('testSetSelView.selOne'))
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
                    this.$Message.error({content:this.$t('testSetSelView.error')+error.response.data.description,duration:6})
                })
            },
            onBack(){
                let _this = this
                this.$Modal.confirm({
                    title:this.$t('public.modal_info'),
                    content:this.$t('testSetSelView.modalTit'),
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
