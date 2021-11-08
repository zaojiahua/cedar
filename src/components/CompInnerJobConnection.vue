<template>
    <div>
        <row style="margin: 16px 0;font-weight: bold">用例名称：{{ innerName }}</row>
        <Table stripe :columns="columns" :data="data" border></Table>
        <Page simple :page-size="pageSize" :total="totalCount" :current="currentPage" @on-change="onPageChange" style="margin-top:20px;text-align: center"></Page>
    </div>
</template>

<script>
    import config from "../lib/config";
    import utils from "../lib/utils";

    export default {
        data(){
            return{
                totalCount: 0,
                offset: 0,
                currentPage: 1,
                columns: [
                    {
                        title: '序号',
                        width: 100,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('span', params.index + 1)
                            ])
                        }
                    },
                    {
                        title: '关联用例',
                        key: 'job_name',
                    },
                    {
                        title: '维护人员',
                        key: 'author',
                    },
                ],
                data: [],
                pageSize:config.DEFAULT_PAGE_SIZE,
                job_label:"",
                job_label_list:[],
                innerName:"",
            }
        },
        methods:{
            setInnerName(name){
                this.innerName = name
            },
            setInnerLabel(label,list){
                this.job_label = label
                this.job_label_list = list
            },
            refresh(label,labelList){
                if(label&&labelList)
                    this.setInnerLabel(label,labelList)
                this.$ajax.post('api/v1/cedar/search_job/?limit='+this.pageSize+'&offset='+this.offset,{
                    job:this.job_label,
                    job_list:this.job_label_list
                }).then(response=>{
                    this.totalCount = Number(response.headers['total-count'])
                    this.data = response.data
                }).catch(error=>{
                    if(config.DEBUG) console.log(error)
                    this.$Message.error({content:"inner关联信息获取失败"+error.response.data.name,duration:6})
                })
            },
            onPageChange (page) {
                this.offset = this.pageSize * (page - 1)
                this.currentPage = page
                this.refresh()
            },
        },
        created(){
            this.pageSize = utils.getPageSize();
        }
    }
</script>

<style>

</style>
