<template>
    <div class="container">
        <Split v-model="split1" min="200px" max="300px">
            <div slot="left" class="split-pane">
                <Table highlight-row :columns="logColumns" :data="logData"  :height="890" @on-row-click="showLogContent">

                </Table>
            </div>
            <div slot="right" class="split-pane">
                <Card style="height: 890px;margin-left: 5px;">
                    <p slot="title">{{ flieName }}</p>
                    <div class="log-content" style="height: 800px;overflow: auto" @scroll="scrollBottom">
                        <div>
                            {{ fileContent }}
                        </div>
                        <div v-show="scrollMore" style="position: relative;height: 50px;" @click="getNextContent">
                            <Spin fix>
                                <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                                <div>Loading</div>
                            </Spin>
                        </div>
                    </div>
                </Card>
                <Spin size="large" fix v-if="showLoading"></Spin>
            </div>
        </Split>
    </div>
</template>

<script>
    import utils from "../lib/utils"
    import config from "../lib/config"

    export default {
        data(){
            return{
                logColumns:[
                    {
                        title:"日志文件",
                        key:"filename",
                    }
                ],
                logData:[],
                split1:0.3,
                fileContent:"",
                flieName:"",
                showLoading:false,
                scrollMore:false,
            }

        },
        methods:{
            getFileList(){
                let coralUrl = utils.getCoralUrl(config.ADMIN_PORT);
                this.$ajax
                    .post(coralUrl,{
                        requestName:"getCoralLogList"
                    }).then(response=>{
                        let logList = response.data;
                        logList.forEach(file=>{
                            this.logData.push({filename:file});
                        })
                        this.showLogContent(this.logData[0]);
                    }).catch(error=>{
                        if (config.DEBUG) console.log(error)
                        this.$Message.error("数据加载失败！");
                    })
            },
            showLogContent(row){
                this.showLoading = true;
                this.fileContent = ""
                let coralUrl = utils.getCoralUrl(config.ADMIN_PORT)+"/"+row.filename + "?fromBeginning=1 ";
                //    0：接着读     1：从头读
                this.$ajax
                    .get(coralUrl)
                    .then(response=>{
                        this.flieName = row.filename;
                        this.fileContent = response.data;
                        this.showLoading = false;
                    })
                    .catch(error=>{
                        if (config.DEBUG) console.log(error)
                        this.$Message.error("读取数据失败！")
                        this.showLoading = false;
                    })
            },
            getNextContent(){
                this.showLoading = true;
                let coralUrl = utils.getCoralUrl(config.ADMIN_PORT)+"/"+this.flieName + "?fromBeginning=0 ";
                this.$ajax
                    .get(coralUrl)
                    .then(response=>{
                        this.fileContent += response.data;
                        this.showLoading = false;
                        this.scrollMore = false
                    })
                    .catch(error=>{
                        this.showLoading = false;
                        this.scrollMore = false
                        if (config.DEBUG) console.log(error)
                        if(error.response.statusText==="file read to end"){
                            this.$Message.warning("没有更多内容了！")
                            return
                        }
                        this.$Message.error("读取数据失败！")
                    })
            },
            //监听滚动条是否下拉到底部
            scrollBottom(){
                // 滚动到页面底部时，请求下一部分内容
                let scroll = this.$el.querySelector('.log-content')
                //滚动条滚动的距离    scroll.scrollTop
                //窗体高度    scroll.offsetHeight
                //整个文本的高度    scroll.scrollHeight
                if(scroll.offsetHeight + scroll.scrollTop - scroll.scrollHeight >= -1){
                    this.scrollMore = true
                    this.$nextTick(function () {
                        this.getNextContent()
                    })
                }
            }


        },
        created(){
            this.getFileList();
        }
    }
</script>

<style>
    .container{
        height: 910px;
        border: 1px solid #dcdee2;
    }
    .split-pane{
        padding: 10px;
    }
    .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
</style>