<template>
    <div>
        <Tabs>
            <TabPane label="原始数据">
                <Collapse simple v-model="value">
                    <Panel  v-for="(items,key,index) in rdsList" :name="index.toString()" ref="panelkey">
                        {{ key }}
                        <p slot="content"><span v-for="(item,index) in items" :key="item.id" @click="showRds(key,item.id,index,$event)" :class="[{'checked':index===currentIndex},getRdsColorClass(item.job_assessment_value)]"></span></p>
                    </Panel>
                </Collapse>

                    <!--<Collapse simple>-->
                        <!--<Panel  v-for="items in rdsDeviceList">-->
                            <!--{{ items }}-->
                            <!--<p slot="content"><span v-for="(item,index) in items" :key="item.id" @click="showRds(key,item.id,index,$event)" :class="[{'checked':index===currentIndex},getRdsColorClass(item.job_assessment_value)]"></span></p>-->
                        <!--</Panel>-->
                    <!--</Collapse>-->
            </TabPane>
            <TabPane label="数据统计">
                <div></div>
            </TabPane>
            <TabPane icon="ios-search">
                <Input search enter-button placeholder="请输入关键字..." style="width: 70%"/>
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
    import config from "../lib/config";
    import utils from "../lib/utils";

    const showRdsDeviceSerializer = [{
        device:{
            id:"number",
            device_label:"string"
        }
    }]

    export default {
        data(){
            return{
                value:"0",
                rdsList:{},
                currentIndex:null,
                currentKey:null,
                rdsDeviceList:[],
            }
        },
        methods:{
            showRds(key,id,index,e){
                console.log(key)
                console.log(id)
                console.log(index)
                this.$emit("showRdsInfo",id);
                //类似于原本的多选==========================//
                // console.log(e.target)
                // console.log(e.target.className)
                // let classlist = e.target.className.split(" ");
                // console.log(classlist)
                // if(classlist.indexOf("checked")===-1){
                //     e.target.className  += " checked"
                // }
                this.currentKey = key;
                this.currentIndex = index;
            },
            delRdsDataOne(){
                this.rdsList[this.currentKey].splice(this.currentIndex, 1);
            },
            getRdsColorClass(type) {
                if (type === "0") return "success"
                if (type === "1") return "failed"
                if (type === "-1") return "invalid"
                return "invalid"
            },
            _requestErrorHandle(reason){
                if (config.DEBUG) console.log(reason)
                this.$Message.error("数据加载失败")
            },
            _responseHandle(response){
                this.rdsList = response.data;
            },
            refresh(url){
                this.$ajax
                    .get(url)
                    .then(response=>{
                        this._responseHandle(response)
                    })
                    .catch(reason=>{
                        this._requestErrorHandle(reason);
                    })
            },
            getAllRdsDevice(){
                this.$ajax
                    .get("api/v1/cedar/rds/?fields=device,device.device_label")
                    .then(response=>{
                        let deviceObj = utils.validate(showRdsDeviceSerializer, response.data.rdss)
                        deviceObj.forEach(devices=>{
                            if(this.rdsDeviceList.indexOf(devices.device.device_label)===-1)
                                this.rdsDeviceList.push(devices.device.device_label)
                        })
                        console.log(this.rdsDeviceList)
                    })
                    .catch(error=>{
                        this._requestErrorHandle(error);
                    })
            },
            collapseDataChange(){
                let panelkey = this.$refs.panelkey;
                console.log(panelkey)
                for(let i=0; i<panelkey.length;i++){
                    panelkey[i].isActive = false;
                }
            }
        },
        created(){
            let url = "api/v1/cedar/get_rds_group_by_device_label/";
            this.refresh(url);
            this.getAllRdsDevice();
        }
    }
</script>

<style scoped>
    span{
        display: inline-block;
        width: 20px;
        height: 20px;
        margin:0 1px -5px 0;
    }
    .success{
        background: #1bbc9c;
    }
    .failed{
        background: #ffae25;
    }
    .invalid{
        background: #bdc3c7;
    }
    .checked{
        border: 1px solid #000;
    }
</style>