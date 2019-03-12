<template>
    <div>
        <Layout>
            <Header class="header" style="padding-left:0px;">
                <Menu mode="horizontal" theme="dark" active-name="1" style="background-color: transparent">
                    <div class="layout-logo">
                        <!--<img src="../assets/logo.png" alt="logo" height="64px">-->
                        <b>ANGELREEF</b>
                        <span>®</span>
                    </div>
                    <div class="layout-nav">
                        <MenuItem name="0">
                            <Avatar>R</Avatar>
                            Raymond
                        </MenuItem>
                        <MenuItem name="1">
                            提醒
                            <Badge :count="3" :offset="[12,-4]">
                                <Icon type="ios-notifications-outline" size="24"/>
                            </Badge>
                        </MenuItem>
                        <MenuItem name="2">
                            关于TMach
                            <Icon type="ios-help-circle-outline" size="24"/>
                        </MenuItem>
                        <MenuItem name="3">
                            设置
                            <Icon type="ios-settings-outline" size="24"/>
                        </MenuItem>
                        <MenuItem name="4">
                            登出
                            <Icon type="ios-exit-outline" size="24">
                            </Icon>
                        </MenuItem>
                    </div>
                </Menu>
            </Header>
            <Layout style="position: absolute; top: 64px; left: 0px; right: 0px; bottom: 0px;">
                <Sider collapsible :collapsed-width="78" v-model="isCollapsed" style="width:200px;">
                    <Menu theme="dark" style="background-color: transparent; width: inherit;" :class="menuClass">
                        <MenuItem name='systemStatus'>
                            <Icon type="md-speedometer" size="24"/>
                            <span>系统状态</span>
                        </MenuItem>
                        <MenuItem name="jobMng">
                            <Icon type="ios-briefcase-outline" size="24"/>
                            <span>用例管理</span>
                        </MenuItem>
                        <MenuItem name="newTboard">
                            <Icon type="ios-add-circle-outline" size="24"/>
                            <span>新建任务</span>
                        </MenuItem>
                        <MenuItem name="tboardMng">
                            <Icon type="ios-folder-open-outline" size="24"/>
                            <span>我的任务</span>
                        </MenuItem>
                        <MenuItem name="rds">
                            <Icon type="ios-pie-outline" size="24"/>
                            <span>测试数据</span>
                        </MenuItem>
                        <MenuItem name="issue">
                            <Icon type="ios-bug-outline" size="24"/>
                            <span>缺陷管理</span>
                        </MenuItem>
                        <MenuItem name="deviceMng">
                            <Icon type="ios-phone-portrait" size="24"/>
                            <span>设备管理</span>
                        </MenuItem>

                    </Menu>
                </Sider>
                <Content style="padding:8px;">
                    {{isCollapsed}}
                </Content>
            </Layout>
        </Layout>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                isCollapsed: true
            };
        },
        computed:{
            menuClass(){
                return [
                    'menu-item',
                    this.isCollapsed ? 'collapsed-menu' : ''
                ]
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
</style>