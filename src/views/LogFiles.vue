<template>
    <div class="container">
        <Split v-model="split1" min="200px" max="300px">
            <div slot="left" class="split-pane">
                <Table highlight-row :columns="logColumns" :data="logData" height="890px">

                </Table>
            </div>
            <div slot="right" class="split-pane">
                <Card style="height: 890px;margin-left: 5px;">
                    <p slot="title">{{ flieName }}</p>
                    <Input :rows="38" class="view-log" type="textarea" disabled v-model="fileContent">
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
                logData:[
                    {
                        filename:"asdasda.log",
                    },
                    {
                        filename:"bfgb.log",
                    },
                    {
                        filename:"fgbfbdfb.log",
                    },
                    {
                        filename:"fdbfdbf.log",
                    },
                    {
                        filename:"fbdgbdf.log",
                    },
                    {
                        filename:"hre.log",
                    },
                    {
                        filename:"hdht.log",
                    }
                ],
                split1:0.3,
                fileContent:"dwdttgrdgse4",
                flieName:"asdada.log",
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
                        logList.forEach(filename=>{

                        })

                        // this.logData.push
                })
            }
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