<template>
    <div>
        <Table :columns="modelColumn" :data="data" border></Table>

        <Page :total="dataTotal" :current="currentPage" :page-size="pageSize" simple style="margin-top:20px;text-align: center "/>

        <Spin size="large" fix v-if="showLoading"></Spin>


        <Modal v-model="showSimModal" footer-hide :mask-closable="false">
            <comp-add-sim-msg ref="editSim" @after-succrss="showSimModal=false;getData"></comp-add-sim-msg>
        </Modal>

    </div>
</template>

<script>
    import config from "../lib/config"
    import CompAddSimMsg from "./CompAddSimCardMsg"

    export default {
        name: "CompSimList",
        components:{ CompAddSimMsg },
        data(){
            return{
                modelColumn:[
                    {
                        title: "运营商",
                        key: "operator",
                        filters: [
                            {
                                label: '中国移动',
                                value: 1
                            },
                            {
                                label: '中国联通',
                                value: 2
                            },
                            {
                                label: '中国电信',
                                value: 3
                            }
                        ],
                        filterMethod (value, row) {
                            this.operatorList = value
                            // this.onPageChange(1)
                        }
                    },
                    {
                        title: "手机号",
                        key: "phone_number",
                    },
                    {
                        title: "是否Volte",
                        key: "is_Volte",
                        filters: [
                            {
                                label: '是',
                                value: true
                            },
                            {
                                label: '否',
                                value: false
                            }
                        ],
                        filterMethod (value, row) {
                            this.volteList = value
                            // this.onPageChange(1)
                        }
                    },
                    {
                        title: "资源状态",
                        key: "status",
                        filters: [
                            {
                                label: '占用',
                                value: true
                            },
                            {
                                label: '未占用',
                                value: false
                            }
                        ],
                        filterMethod (value, row) {
                            this.statusList = value
                            // this.onPageChange(1)
                        }
                    },
                    {
                        title: "关联设备/僚机",
                        key: "device",
                        sortable: true,
                    },
                    {
                        title: "历史关联",
                        key: "history",
                    },
                    {
                        title: "操作",
                        key: "action",
                        align: 'center',
                        width:120,
                        render: (h, params) => {
                            return h('div', [
                                h('span', {
                                    class: 'mouse-hover',
                                    style: {
                                        marginRight: '15px',
                                        cursor: 'pointer',
                                    },
                                    on: {
                                        click: () => {
                                            this.showSimModal = true
                                            this.$refs.editSim.setData(params.row)
                                        }
                                    }
                                }, '编辑'),
                                h('span', {
                                    style: {
                                        cursor: 'pointer'
                                    },
                                    on: {
                                        click: () => {

                                        }
                                    }
                                }, '移除')
                            ]);
                        }
                    }
                ],
                data:[{
                    operator:"中国移动",
                    phone_number:12555598425,
                    is_Volte:true,
                    status:true,
                    device:"不知道",
                    history:"no",
                }],
                operatorList:[],
                volteList:[],
                statusList:[],
                showLoading:false,
                pageSize:config.DEFAULT_PAGE_SIZE,
                showSimModal:false,

                dataTotal:0,
                currentPage:1,




            }
        },
        methods:{
            getData(){
                console.log("取回数据");
            }
        }
    }
</script>

<style>
    .mouse-hover:hover{
        color: #1bbc9c;
    }
</style>
<style scoped>
    /deep/.ivu-modal-close{
        margin: 18px;
    }
</style>