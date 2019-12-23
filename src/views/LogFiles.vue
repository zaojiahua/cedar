<template>
    <div class="container">
        <Split v-model="split1" min="200px" max="300px">
            <div slot="left" class="split-pane">
                <Table highlight-row :columns="logColumns" :data="logData" @on-row-click="showLogContent">

                </Table>
                <Page :current="currentPage" :total="dataTotal" :page-size="pageSize" simple @on-change="onPageChange"
                      style="margin-top:20px;text-align: center "/>
            </div>
            <div slot="right" class="split-pane">
                <Card style="height: 820px;margin-left: 5px;">
                    <p slot="title">{{ flieName }}</p>
                    <div class="log-content" style="height: 730px;overflow: auto" @scroll="scrollBottom">
                        <div>
                            <pre style="white-space: pre-wrap;overflow-wrap: break-word;">{{ fileContent }}</pre>
                        </div>
                        <div v-show="scrollMore" style="position: relative;height: 50px;" @click="getNextContent">
                            <Spin fix>
                                <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                                <div>Loading</div>
                            </Spin>
                        </div>
                        <div v-if="atLast" style="    text-align: center;color: #FF9900;">已到最后部分，没有更多内容了！</div>
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
                currentPage:1,
                offset: 0,
                pageSize:15,
                dataTotal:0,
                contentOffset:0,
                loadFlag:true,
                atLast:false,
            }

        },
        methods:{
            getFileList(){
                let coralUrl = utils.getCoralUrl(5000);
                coralUrl = coralUrl +
                    "/log/list/?" +
                    "&limit=" + this.pageSize +
                    "&offset=" + this.offset
                this.$ajax
                    .get(coralUrl,)
                    .then(response=>{
                        let list = [];
                        this.dataTotal = parseInt(response.headers["total-count"])
                        let logList = response.data;
                        logList.forEach(file=>{
                            list.push({filename:file});
                        })
                        this.logData = list
                        this.showLogContent(this.logData[0]);
                    }).catch(error=>{
                        if (config.DEBUG) console.log(error)
                        this.$Message.error("数据加载失败！");
                    })
            },
            showLogContent(row){
                this.showLoading = true;
                this.fileContent = ""
                let coralUrl = utils.getCoralUrl(5000)+"/log/content/"+row.filename + "/?limit=1&offset=0 ";
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
                this.contentOffset++
                this.showLoading = true;
                let coralUrl = utils.getCoralUrl(5000)+"/log/content/"+this.flieName + "/?limit=1&offset= " + this.contentOffset;
                this.$ajax
                    .get(coralUrl)
                    .then(response=>{
                        this.fileContent += response.data;
                        this.showLoading = false;
                        this.scrollMore = false
                        this.loadFlag = true
                    })
                    .catch(error=>{
                        this.showLoading = false;
                        this.scrollMore = false
                        this.contentOffset--
                        if (config.DEBUG) console.log(error)
                        if(error.response.data==="file read to end"){
                            this.$Message.warning("没有更多内容了！")
                            this.atLast = true;
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
                    this.$nextTick(function () {
                        if(this.loadFlag){
                            this.scrollMore = true
                            this.loadFlag = false
                            this.getNextContent()
                        }
                    })
                }
            },
            onPageChange(page) {
                this.offset = this.pageSize * (page-1)
                this.currentPage = page
                this.getFileList()
            }

        },
        created(){
            this.getFileList();
        }
    }
</script>

<style>
    .container{
        height: 840px;
        border: 1px solid #dcdee2;
    }
    .split-pane{
        padding: 10px;
    }
    .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
</style>