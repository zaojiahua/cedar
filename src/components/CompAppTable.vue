<template>
    <div>
        <Table :columns="appColumn" :data="data" border></Table>

        <Page :total="dataTotal" :current="currentPage" :page-size="pageSize" simple style="margin-top:20px;text-align: center "/>

        <Spin size="large" fix v-if="showLoading"></Spin>


        <Modal v-model="showAppModal" footer-hide :mask-closable="false">
            <comp-add-app-card-msg ref="editApp" @after-succrss="showAppModal=false;getData"></comp-add-app-card-msg>
        </Modal>

    </div>
</template>

<script>
    import config from "../lib/config"
    import CompAddAppCardMsg from "./CompAddAppCardMsg"

    export default {
        name: "CompAppTable",
        components:{ CompAddAppCardMsg },
        data(){
            return{
                appColumn:[
                    {
                        title: "App",
                        key: "app_name",
                        filters: [

                        ],
                        filterMethod (value, row) {

                        }
                    },
                    {
                        title: "账号",
                        key: "account_number",
                        sortable:true
                    },
                    {
                        title: "用户名",
                        key: "user_name",
                        sortable:true
                    },
                    {
                        title: "密码",
                        key: "password",
                    },
                    {
                        title: "绑定手机号",
                        key: "phone_number",
                    },
                    {
                        title: "头像",
                        key: "picture",
                    },
                    {
                        title: "好友",
                        key: "friends",
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
                        title: "最大设备数",
                        key: "login_number",
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
                                            this.showAppModal = true
                                            this.$refs.editApp.setData(params.row)
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
                    app_name:"微信",
                    account_number:"fvx125896214656",
                    user_name:"微信1号测试员",
                    password:"12589625",
                    phone_number:12555598425,
                    picture:"你",
                    friends:"他",
                    status:true,
                    device:"不知道",
                    history:"no",
                    login_number:3,
                }],
                operatorList:[],
                volteList:[],
                statusList:[],
                showLoading:false,
                pageSize:config.DEFAULT_PAGE_SIZE,
                showAppModal:false,

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