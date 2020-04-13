<template>
    <div>
        <Layout :style="{minHeight: '100vh'}">
            <Header class="header" style="padding-left:0px;">
                <Menu mode="horizontal" theme="dark" active-name="0" style="background-color: transparent">
                    <div class="layout-logo">
                        <b>ANGELREEF</b>
                        <span>®</span>
                    </div>

                    <div class="layout-nav">
                        <comp-reef-usage></comp-reef-usage>
                        <MenuItem name="0" :to="{name: 'personal-data'}">
                            Hi! {{ username }}
                        </MenuItem>
                        <MenuItem name="1" :to="{name: 'setting'}">
                            设置
                            <Icon type="ios-settings-outline"  size="24"/>
                        </MenuItem>
                        <MenuItem name="2" @click.native="getSysVersion">
                            关于TMach
                            <Icon type="ios-help-circle-outline" size="24"/>
                        </MenuItem>
                        <MenuItem name="3" @click.native="logout">
                            登出
                            <Icon type="ios-exit-outline" size="24">
                            </Icon>
                        </MenuItem>
                    </div>
                </Menu>
            </Header>
            <Layout>
                <Sider collapsible :collapsed-width="78" v-model="isCollapsed" style="width:200px;padding-bottom: 48px">
                    <Menu theme="dark" style="background-color: transparent; width: inherit;" :class="menuClass" :active-name="$route.name">
                        <MenuItem v-if="permissions.includes('apiv1.user_management')" name="user-management" :to="{name: 'user-management'}">
                            <Tooltip content="用户管理" placement="right" :disabled="!isCollapsed">
                                <Icon type="md-person" size="24"/>
                            </Tooltip>
                            <span>用户管理</span>
                        </MenuItem>
                        <MenuItem v-if="permissions.includes('apiv1.upgrade_system')" name="sys-upgrade" :to="{name: 'system-upgrade'}">
                            <Tooltip content="系统升级" placement="right" :disabled="!isCollapsed">
                                <Icon type="md-sync" size="24"/>
                            </Tooltip>
                            <span>系统升级</span>
                        </MenuItem>
                        <MenuItem v-if="permissions.includes('apiv1.view_system_log')" name="log-files" :to="{name: 'log-files'}">
                            <Tooltip content="日志文件" placement="right" :disabled="!isCollapsed">
                                <Icon type="md-filing" size="24"/>
                            </Tooltip>
                            <span>日志文件</span>
                        </MenuItem>
                        <MenuItem name="job-management" :to="{name: 'job-management'}">
                            <Tooltip content="用例管理" placement="right" :disabled="!isCollapsed">
                                <Icon type="ios-briefcase-outline" size="24"/>
                            </Tooltip>
                            <span>用例管理</span>
                        </MenuItem>
                        <MenuItem name="create-tboard" :to="{name: 'create-tboard'}">
                            <Tooltip content="新建任务" placement="right" :disabled="!isCollapsed">
                                <Icon type="ios-add-circle-outline" size="24"/>
                            </Tooltip>
                            <span>新建任务</span>
                        </MenuItem>
                        <MenuItem name="tboard-management" :to="{name: 'tboard-management'}">
                            <Tooltip content="我的任务" placement="right" :disabled="!isCollapsed">
                                <Icon type="ios-folder-open-outline" size="24"/>
                            </Tooltip>
                            <span>我的任务</span>
                        </MenuItem>
                        <MenuItem name="rds-management" :to="{name: 'rds-management'}">
                            <Tooltip content="测试数据" placement="right" :disabled="!isCollapsed">
                                <Icon type="ios-pie-outline" size="24"/>
                            </Tooltip>
                            <span>测试数据</span>
                        </MenuItem>
                        <MenuItem name="device-management" :to="{name: 'device-management'}">
                            <Tooltip content="设备管理" placement="right" :disabled="!isCollapsed">
                                <Icon type="ios-phone-portrait" size="24"/>
                            </Tooltip>
                            <span>设备管理</span>
                        </MenuItem>
                        <MenuItem name="clean-center" :to="{name: 'clean-center'}">
                            <Tooltip content="清理中心" placement="right" :disabled="!isCollapsed">
                                <Icon type="ios-trash" size="24"/>
                            </Tooltip>
                            <span>清理中心</span>
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
                        <b slot="label">Reef版本：</b>
                        <p>{{ versionInfo.reef_version }}</p>
                    </FormItem>
                    <FormItem>
                        <b slot="label">Coral版本：</b>
                        <p>{{ versionInfo.coral_version }}</p>
                    </FormItem>
                    <FormItem>
                        <b slot="label">Cedar版本：</b>
                        <p>{{ versionInfo.cedar_version }}</p>
                    </FormItem>
                    <FormItem>
                        <b slot="label">Pacific版本：</b>
                        <p>{{ versionInfo.pacific_version }}</p>
                    </FormItem>
                    <FormItem>
                        <b slot="label">TMach版本：</b>
                        <p>{{ versionInfo.TMach_version }}</p>
                    </FormItem>
                </Form>
                <p slot="footer" style="text-align: center">
                    <Button type="primary"  @click="showModal = false">关闭</Button>
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

    const versionSerializer = {
        TMach_version:"string",
        cedar_version:"number",
        coral_version:"number",
        pacific_version:"string",
        reef_version:"string",
    }

    export default {
        components:{ CompReefUsage },
        data () {
            return {
                isCollapsed: true,
                notification: 0,
                showModal:false,
                versionInfo:utils.validate(versionSerializer,{}),
                permissions:  sessionStorage.permissions === undefined ? "" : sessionStorage.permissions,
                showVersionLoading:false,
                username:localStorage.username,
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
                    title: "您确定要登出?",
                    onOk(){
                        this.$Loading.start()
                        main.$router.push({name: "login"})
                        this.$Message.success("登出成功!")
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
                let coralUrl = "http://"+config.UPDATE_HOST+":"+config.ADMIN_PORT;
                this.$ajax.post(coralUrl,{
                    requestName:'getTMachVersionInfo'
                }).then(response=>{
                    this.showVersionLoading = false;
                    this.versionInfo = utils.validate(versionSerializer,response.data);
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
                            msg = "请确认您的网路"
                        } else {
                            msg = reason.response.status
                        }
                        this.$Notice.error({
                            title: "取得用户权限失败: "+msg
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
        width: 200px;
        float: left;
        position: relative;
        top: 0px;
        left: 0px;
        text-align: center;
        border-bottom: #5b5b5b 1px solid;
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
        right:0px;
    }
    .menu-item span{
        display: inline-block;
        overflow: hidden;
        width: 69px;
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
</style>