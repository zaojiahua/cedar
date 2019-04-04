<template>
    <div class="container">
        <Split v-model="split1" min="200px" max="300px">
            <div slot="left" class="split-pane">
                <Table highlight-row :columns="logColumns" :data="logData"  height="890px" @on-row-click="showLogContent">

                </Table>
            </div>
            <div slot="right" class="split-pane">
                <Card style="height: 890px;margin-left: 5px;">
                    <p slot="title">{{ flieName }}</p>
                    <Input :rows="38" class="view-log" type="textarea" disabled v-model="fileContent"></Input>
                </Card>
            </div>
        </Split>
    </div>
</template>

<script>
    import utils from "../lib/utils"
    import config from "../lib/config"

    const serializer = ["string"];
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
            }

        },
        methods:{
            getFileList(){
                let coralUrl = utils.getCoralUrl(config.ADMIN_PORT);
                this.$ajax
                    .post(coralUrl,{
                        requestName:"getCoralLogList"
                    }).then(response=>{
                        let logList = utils.validate(serializer, response.data);
                        logList.forEach(file=>{
                            this.logData.push({filename:file});
                        })
                    }).catch(error=>{
                        this.$Message.error("数据加载失败！");
                    })
            },
            showLogContent(row){
                let coralUrl = utils.getCoralUrl(config.ADMIN_PORT)+"/"+row.name;
                this.$ajax
                    .get(coralUrl)
                    .then(response=>{
                        this.flieName = row.filename;
                        this.fileContent = response.data;
                    })
                    .catch(error=>{
                        console.log(error);
                        this.$Message.error("读取数据失败！")
                    })
            },
            showFirstContent(){
                this.flieName = this.logData[1].filename;
                let coralUrl = utils.getCoralUrl(config.ADMIN_PORT)+"/"+this.flieName;
                this.$ajax
                    .get(coralUrl)
                    .then(response=>{
                        this.fileContent = response.data;
                    })
                    .catch(error=>{
                        console.log(error);
                        this.$Message.error("读取数据失败！")
                    })
            }
        },
        created(){
            this.getFileList();
            this.showFirstContent();
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
    .ivu-input[disabled] {
        background-color: #fff;
        cursor: default;
        color: #515a6e;
    }
</style>