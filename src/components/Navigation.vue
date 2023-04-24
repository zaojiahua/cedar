<template>
    <div>
        <Layout :style="{minHeight: '100vh'}">
            <Header class="header" style="padding-left:0px;">
                <Menu mode="horizontal" theme="dark" active-name="0" style="background-color: transparent">
                    <div class="layout-logo">
                        <b>TMach</b>
                        <span>®</span>
                    </div>

                    <div class="layout-nav">
                        <comp-reef-usage></comp-reef-usage>
                        <MenuItem name="0" :to="{name: 'personal-data'}">
                            {{ username }}
                        </MenuItem>
                        <Submenu name="1">
                            <template slot="title">
                                {{$t('navbar.setting.name')}}
                            </template>
                            <div class="box">
                                <MenuItem name="1-1" :to="{name: 'TGuard-management'}">{{$t('navbar.setting.TGuard')}}</MenuItem>
                                <MenuItem name="1-2" :to="{name: 'setting'}">{{$t('navbar.setting.page')}}</MenuItem>
                                <MenuItem name="1-3"  @click.native="getSysVersion">{{$t('navbar.setting.about')}}</MenuItem>
                            </div>
                        </Submenu>
                        <MenuItem name="3" @click.native="logout">
                            {{$t('navbar.loginOut')}}
                            <Icon type="ios-exit-outline" size="24"></Icon>
                        </MenuItem>
                    </div>
                </Menu>
            </Header>
            <Layout>
                <Sider collapsible :collapsed-width="78" v-model="isCollapsed" style="width:200px;padding-bottom: 48px;border-top: #5b5b5b 1px solid;">
                    <Menu theme="dark" style="background-color: transparent; width: inherit;" :class="menuClass" :active-name="$route.name">
                        <MenuItem v-if="permissions.includes('apiv1.user_management')" name="user-management" :to="{name: 'user-management'}">
                            <Tooltip :content="$t('navbar.user')" placement="right" :disabled="!isCollapsed">
                                <Icon type="md-person" size="24"/>
                            </Tooltip>
                            <span>{{$t('navbar.user')}}</span>
                        </MenuItem>
                        <!--<MenuItem v-if="permissions.includes('apiv1.upgrade_system')" name="system-upgrade" :to="{name: 'system-upgrade'}">-->
                            <!--<Tooltip :content="$t('navbar.sys')" placement="right" :disabled="!isCollapsed">-->
                                <!--<Icon type="md-sync" size="24"/>-->
                            <!--</Tooltip>-->
                            <!--<span>{{$t('navbar.sys')}}</span>-->
                        <!--</MenuItem>-->
                        <!--<MenuItem v-if="permissions.includes('apiv1.view_system_log')" name="log-files" :to="{name: 'log-files'}">-->
                            <!--<Tooltip content="日志文件" placement="right" :disabled="!isCollapsed">-->
                                <!--<Icon type="md-filing" size="24"/>-->
                            <!--</Tooltip>-->
                            <!--<span>日志文件</span>-->
                        <!--</MenuItem>-->
                        <MenuItem name="job-management" :to="{name: 'job-management'}">
                            <Tooltip :content="$t('navbar.job')" placement="right" :disabled="!isCollapsed">
                                <Icon type="ios-briefcase-outline" size="24"/>
                            </Tooltip>
                            <span>{{$t('navbar.job')}}</span>
                        </MenuItem>
                        <MenuItem name="testSet-management" :to="{name: 'testSet-management'}">
                            <Tooltip :content="$t('navbar.testSet')" placement="right" :disabled="!isCollapsed">
                                <Icon type="ios-cube-outline" size="24" />
                            </Tooltip>
                            <span>{{$t('navbar.testSet')}}</span>
                        </MenuItem>
                        <MenuItem name="create-tboard" :to="{name: 'create-tboard'}">
                            <Tooltip :content="$t('navbar.create')" placement="right" :disabled="!isCollapsed">
                                <Icon type="ios-add-circle-outline" size="24"/>
                            </Tooltip>
                            <span>{{$t('navbar.create')}}</span>
                        </MenuItem>
                        <MenuItem name="tboard-management" :to="{name: 'tboard-management'}">
                            <Tooltip :content="$t('navbar.tboard')" placement="right" :disabled="!isCollapsed">
                                <Icon type="ios-list-box-outline" size="24" />

                                <!--<Icon type="ios-folder-open-outline" size="24"/>-->
                            </Tooltip>
                            <span>{{$t('navbar.tboard')}}</span>
                        </MenuItem>
                        <MenuItem name="rds-management" :to="{name: 'rds-management'}">
                            <Tooltip :content="$t('navbar.rds')" placement="right" :disabled="!isCollapsed">
                                <Icon type="ios-pie-outline" size="24"/>
                            </Tooltip>
                            <span>{{$t('navbar.rds')}}</span>
                        </MenuItem>
                        <MenuItem name="perf-data-management" :to="{name: 'perf-data-management'}">
                            <Tooltip :content="$t('navbar.perf')" placement="right" :disabled="!isCollapsed">
                                <Icon type="ios-pulse" size="24"/>
                            </Tooltip>
                            <span>{{$t('navbar.perf')}}</span>
                        </MenuItem>
                        <MenuItem name="device-management" :to="{name: 'device-management'}">
                            <Tooltip :content="$t('navbar.device')" placement="right" :disabled="!isCollapsed">
                                <Icon type="ios-phone-portrait" size="24"/>
                            </Tooltip>
                            <span>{{$t('navbar.device')}}</span>
                        </MenuItem>
                        <MenuItem name="clean-center" :to="{name: 'clean-center'}">
                            <Tooltip :content="$t('navbar.clean')" placement="right" :disabled="!isCollapsed">
                                <Icon type="ios-trash" size="24"/>
                            </Tooltip>
                            <span>{{$t('navbar.clean')}}</span>
                        </MenuItem>
                        <MenuItem name="abnormal-statistics" :to="{name: 'abnormal-statistics'}">
                            <Tooltip :content="$t('navbar.abnormal')" placement="right" :disabled="!isCollapsed">
                                <Icon type="ios-warning-outline" size="24"/>
                            </Tooltip>
                            <span>{{$t('navbar.abnormal')}}</span>
                        </MenuItem>
                    </Menu>
                </Sider>
                <Content style="padding:16px;">
                    <router-view></router-view>
                </Content>
            </Layout>
            <Modal v-model="showModal" :closable="false" :mask-closable="false"  width="360">
                <p slot="header" style="text-align:center">
                    <span style="font-size: 28px;color: #1bbc9c">TMach</span>
                </p>
                <Form :label-width="120">
                    <FormItem>
                        <b slot="label">{{$t('navbar.reef')}}：</b>
                        <p>{{ reef_version }}</p>
                    </FormItem>
                    <FormItem>
                        <b slot="label">{{$t('navbar.cedar')}}：</b>
                        <p>3.8</p>
                    </FormItem>
                </Form>
                <p slot="footer" style="text-align: center">
                    <Button type="primary"  @click="showModal = false">{{$t('public.btn_close')}}</Button>
                </p>
                <Spin size="large" fix v-if="showVersionLoading"></Spin>
            </Modal>
        </Layout>
    </div>
</template>
<script>
    import main from "../main"
    import utils from "../lib/utils"
    import config from "../lib/config"
    import CompReefUsage from "./CompReefUsage"

    export default {
        components:{ CompReefUsage },
        data () {
            return {
                isCollapsed: true,
                notification: 0,
                showModal:false,
                reef_version:"",
                permissions:  sessionStorage.permissions === undefined ? "" : sessionStorage.permissions,
                showVersionLoading:false,
                username:sessionStorage.username,
                capacity:{
                    free: 0,
                    total: 0,
                    used: 0,
                }
            };
        },
        computed:{
            menuClass(){
                return [
                    'menu-item',
                    this.isCollapsed ? 'collapsed-menu' : ''
                ]
            },
        },
        methods: {
            logout(){
                this.$Modal.confirm({
                    title: this.$t('navbar.loginOutTit'),
                    onOk(){
                        this.$Loading.start()
                        main.$router.push({name: "login"})
                        this.$Message.success(this.$t('navbar.loginOutSuccess'))
                        this.$Loading.finish()
                    },
                    onCancel(){
                        this.$Modal.remove()
                    }
                })

            },
            getSysVersion(){
                this.showModal = true;
                this.showVersionLoading = true;
                this.$Loading.start();
                this.$ajax.get("api/v1/cedar/get_reef_version/").then(response=>{
                    this.showVersionLoading = false;
                    this.reef_version = response.data;
                    this.$Loading.finish();
                }).catch(error=>{
                    this.showVersionLoading = false;
                    this.$Loading.error();
                    if(config.DEBUG) console.log(error);
                })
            },
        },
        created(){
            if(sessionStorage.permissions === undefined){
                this.$ajax
                    .get("api/v1/permissions/")
                    .then(response=>{
                        sessionStorage.permissions = response.data
                        this.permissions = sessionStorage.permissions
                    })
                    .catch(reason=>{
                        sessionStorage.permissions = []
                        let msg = ""
                        if(reason.response === undefined){
                            msg = localStorage.getItem("lang")==='zh' ? "请确认您的网络" : 'Please confirm your network'
                        } else {
                            msg = reason.response.status
                        }
                        this.$Notice.error({
                            title: localStorage.getItem("lang")==='zh' ? "取得用户权限失败: ":"Failed to get user permissions: "+msg
                        })
                    })
            }else {
                this.permissions = sessionStorage.permissions
            }
        }
    }
</script>
<style scoped>
    .header{
        height:64px;
        overflow: hidden;
    }
    .layout-logo{
        height: 64px;
        width: 150px;
        float: left;
        position: relative;
        top: 0px;
        left: 0px;
        text-align: center;
    }
    .layout-nav{
        margin: 0 auto;
        margin-right: 20px;
        float: right;
    }
    .layout-logo b{
        color:#1bbc9c;
        font-size:24px;
        font-weight: 900;
        letter-spacing: 1px;
    }
    .layout-logo span{
        color:#1bbc9c;
        position: absolute;
        font-size: 20px;
        font-weight: 900;
        top:-10px;
        right:10px;
    }
    .menu-item span{
        display: inline-block;
        overflow: hidden;
        width: 120px;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: bottom;
        transition: width .2s ease .2s;
    }
    .menu-item i{
        transform: translateX(0px);
        transition: font-size .2s ease, transform .2s ease;
        vertical-align: middle;
        font-size: 16px;
    }
    .collapsed-menu span{
        width: 0px;
        transition: width .2s ease;
    }
    .collapsed-menu i{
        transform: translateX(5px);
        transition: font-size .2s ease .2s, transform .2s ease .2s;
        vertical-align: middle;
        font-size: 22px;
    }
    .ivu-tooltip{
        margin-right: 6px;
    }
    .box{
        position: fixed;
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0 1px 6px rgba(0,0,0,0.2);
    }
</style>
