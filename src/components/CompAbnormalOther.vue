<template>
    <div>
        <Modal v-model="showDeviceDetail" transfer :closable="false" footer-hide :styles="{top: '16px'}">
            <comp-device-detail ref="deviceDetail"></comp-device-detail>
        </Modal>
        <Card :bordered="false" dis-hover style="box-shadow: 0 0 2px 2px #eee;">
            <div style="margin-right: 200px;" v-if="abnormalKey!==null">
                 <p style="margin-bottom: 10px"><b>设备名称：</b>{{ abnormalData.device_name }}<a href="javascript:" style="margin-left: 10px" @click="showDeviceDetail=true;$refs.deviceDetail.refresh(abnormalData.device_id)">设备详情</a></p>
                 <p style="margin-bottom: 10px"><b>异常时间：</b>{{ abnormalData.abnm_start_time }}</p>
                 <p style="margin-bottom: 10px"><b>app包名：</b>{{ abnormalData.result_data.pkg_name.join(",") }}</p>
                 <Row><b>日志文件：</b>
                    <p v-if="abnormalData.log_list.length===0" style="color: #FF9900">暂无日志文件信息</p>
                    <ButtonGroup v-show="abnormalData.log_list.length>0">
                        <Button v-for="files in abnormalData.log_list" size="small" :key="files.id" @click="downloadLog(files.log_file,files.name)">{{ files.name }}</Button>
                    </ButtonGroup>
                 </Row>
                <!-- rds card -->
                 <div v-if="abnormalData.device_id!==null">
                    <div style="margin-top: 20px;padding: 20px;border: 1px solid #eee">
                        <Row>
                            <span>异常前测试数据</span>
                            <div>
                                <div style="margin: 10px 0 20px 0">
                                    <ButtonGroup>
                                        <Button :class="{ active: isActive1===1 }" @click="beforeAbnormalDateClick(1,5)">5min</Button>
                                        <Button :class="{ active: isActive1===2 }" @click="beforeAbnormalDateClick(2,15)">15min</Button>
                                        <Button :class="{ active: isActive1===3 }" @click="beforeAbnormalDateClick(3,30)">30min</Button>
                                        <Button :class="{ active: isActive1===4 }" @click="beforeAbnormalDateClick(4,60)">1h</Button>
                                    </ButtonGroup>
                                    <p style="float: right">
                                        <Tag type="dot" color="#1bbc9c">成功</Tag>
                                        <Tag type="dot" color="#FFAE25">失败</Tag>
                                        <Tag type="dot" color="#F75F0D">严重失败</Tag>
                                        <Tag type="dot" color="#BDC3C7">无效</Tag>
                                    </p>
                                </div>
                                <comp-rds-card ref="rdsCard1"
                                               :prop-device-id="abnormalData.device_id"
                                               :prop-filter-date-range="beforeAbnormalFilterDate"
                                               :prop-full-date="false"
                                               @after-load-data="afterRdsLoadData">
                                </comp-rds-card>
                                <div v-show="scrollMore" style="position: relative;height: 50px;">
                                    <Spin fix>
                                        <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                                        <div>Loading</div>
                                    </Spin>
                                </div>
                                <p v-show="!noMoreData" style="text-align: center" @click="onClickLoadMoreRds"><Button>点击加载更多</Button></p>
                                <p v-show="noMoreData" style="text-align: center">暂无更多数据</p>
                            </div>
                        </Row>
                    </div>
                    <div style="margin-top: 20px;padding: 20px;border: 1px solid #eee">
                        <Row>
                            <span>异常时测试数据</span>
                            <div>
                                <p style="float: right">
                                    <Tag type="dot" color="#1bbc9c">成功</Tag>
                                    <Tag type="dot" color="#FFAE25">失败</Tag>
                                    <Tag type="dot" color="#F75F0D">严重失败</Tag>
                                    <Tag type="dot" color="#BDC3C7">无效</Tag>
                                </p>
                                <div style="clear: both;margin-bottom: 20px"></div>
                                <comp-rds-card ref="rdsCard2"
                                               :prop-device-id="abnormalData.device_id"
                                               :prop-filter-date-range="abnormalFilterDate"
                                               :prop-start-date-one="true"
                                               :prop-full-date="false"
                                               @after-load-data="afterRdsLoadData2">
                                </comp-rds-card>
                                <div v-show="scrollMore2" style="position: relative;height: 50px;">
                                    <Spin fix>
                                        <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                                        <div>Loading</div>
                                    </Spin>
                                </div>
                                <p v-show="!noMoreData2" style="text-align: center" @click="onClickLoadMoreRds2"><Button>点击加载更多</Button></p>
                                <p v-show="noMoreData2" style="text-align: center">暂无更多数据</p>
                            </div>
                        </Row>
                    </div>
                    <div style="margin-top: 20px;padding: 20px;border: 1px solid #eee">
                        <Row>
                            <span>异常后测试数据</span>
                            <div>
                                <div style="margin: 10px 0 20px 0">
                                    <ButtonGroup>
                                        <Button :class="{ active: isActive2===1 }" @click="afterAbnormalDateClick(1,-5)">5min</Button>
                                        <Button :class="{ active: isActive2===2 }" @click="afterAbnormalDateClick(2,-15)">15min</Button>
                                        <Button :class="{ active: isActive2===3 }" @click="afterAbnormalDateClick(3,-30)">30min</Button>
                                        <Button :class="{ active: isActive2===4 }" @click="afterAbnormalDateClick(4,-60)">1h</Button>
                                    </ButtonGroup>
                                    <p style="float: right">
                                        <Tag type="dot" color="#1bbc9c">成功</Tag>
                                        <Tag type="dot" color="#FFAE25">失败</Tag>
                                        <Tag type="dot" color="#F75F0D">严重失败</Tag>
                                        <Tag type="dot" color="#BDC3C7">无效</Tag>
                                    </p>
                                </div>
                                <comp-rds-card ref="rdsCard3"
                                               :prop-device-id="abnormalData.device_id"
                                               :prop-filter-date-range="afterAbnormalFilterDate"
                                               :prop-full-date="false"
                                               @after-load-data="afterRdsLoadData3">
                                </comp-rds-card>
                                <div v-show="scrollMore3" style="position: relative;height: 50px;">
                                    <Spin fix>
                                        <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                                        <div>Loading</div>
                                    </Spin>
                                </div>
                                <p v-show="!noMoreData3" style="text-align: center" @click="onClickLoadMoreRds3"><Button>点击加载更多</Button></p>
                                <p v-show="noMoreData3" style="text-align: center">暂无更多数据</p>
                            </div>
                        </Row>
                    </div>
                </div>
            </div>
            <div class="scroll-bar" style="position: absolute;right:0;top:0;width: 200px;height:800px;overflow:auto;box-shadow: -2px 0 2px 1px #eee;padding-left: 10px;">
                <p v-if="propAbnormalType===2" style="margin-top: 10px;font-weight: bold">ANR异常列表</p>
                <p v-if="propAbnormalType===3" style="margin-top: 10px;font-weight: bold">Crash异常列表</p>
                <p v-if="propAbnormalType===4" style="margin-top: 10px;font-weight: bold">Exception异常列表</p>
                <Tree :data="data" @on-select-change="onTreeClick"></Tree>
            </div>

            <div style="margin-right: 200px;height: 768px;text-align: center;" v-if="abnormalKey===null">
                <p>暂无异常数据信息</p>
            </div>
        </Card>
    </div>
</template>

<script>
    import CompAbnormalChart from "./CompAbnormalChart"
    import CompDeviceDetail from "./CompDeviceDetail"
    import CompRdsCard from "./CompRdsCard"
    import config from "../lib/config";

    export default {
        name:"CompPowerAbnormal",
        components:{ CompAbnormalChart, CompDeviceDetail, CompRdsCard  },
        props:{
            propDevices:{
                type:Array,
                default:()=>{ return [] }
            },
            propTboardId:{
                type:Number,
                default:null
            },
            propFilterDateRange:{
                type: Array,
                default:()=>{ return []}
            },
            propAbnormalType:{
                type:Number,
                default:null
            }
        },
        data(){
            return{
                baseUrl:"http://"+config.REEF_HOST+":"+config.REEF_PORT,
                data: [],   //树形结构  Tree data
                abnormalData:{
                    abnm_end_time: "",
                    abnm_start_time: "",
                    device_name: "",
                },
                abnormalKey:null,
                showDeviceDetail:false,
                isActive1:1,
                isActive2:1,
                beforeAbnormalFilterDate:[],
                abnormalFilterDate:[],
                afterAbnormalFilterDate:[],
                scrollMore:false,
                noMoreData:false,
                scrollMore2:false,
                noMoreData2:false,
                scrollMore3:false,
                noMoreData3:false,
            }
        },
        methods:{
            getPowerAbnormalList(){
                let ids = []
                if(this.propDevices.length>0){
                    this.propDevices.forEach(item=>{
                        ids.push(item.id)
                    })
                    ids = ids.join(",")
                }
                let url = ""
                if((this.propDevices.length>0)&&(this.propTboardId===null))
                    url = "api/v1/cedar/get_abnormity_list/?devices="+ ids +"&start_time="+ this.propFilterDateRange[0].format("yyyy-MM-dd hh:mm:ss")
                        +"&end_time="+this.propFilterDateRange[1].format("yyyy-MM-dd")+" 23:59:59&abnormity_type="+ this.propAbnormalType
                else if((this.propDevices.length===0)&&(this.propTboardId!==null))
                    url = "api/v1/cedar/get_abnormity_list/?tboard="+ this.propTboardId +"&abnormity_type="+ this.propAbnormalType

                this.$ajax.get(url)
                    .then(response=>{
                        if(Object.keys(response.data).length===0){
                            this.data = []
                            this.abnormalKey = null
                            return
                        }
                        let treeData = []
                        //外层device
                        response.data.forEach((item,index)=>{
                            let children1 = []  //外层子菜单list
                            let count = 0
                            //内层日期
                            item.time_section.forEach((date,k)=>{
                                //内层子菜单list处理
                                let children2 = []  //内层子菜单下的list
                                date.data.forEach((time,i)=>{
                                    if((index===0)&&(k===0)&&(i===0))
                                        children2.push({
                                            "title":time.abnm_start_time.split(" ")[1],
                                            "id":time.abnm_id,
                                            "abnm_start_time":time.abnm_start_time,
                                            "result_data":time.result_data,
                                            "log_list":time.log_list,
                                            "device_name":item.device_name,
                                            "device_id":item.device_id,
                                            "selected": true,
                                        })
                                    else
                                        children2.push({
                                            "title":time.abnm_start_time.split(" ")[1],
                                            "id":time.abnm_id,
                                            "abnm_start_time":time.abnm_start_time,
                                            "result_data":time.result_data,
                                            "log_list":time.log_list,
                                            "device_name":item.device_name,
                                            "device_id":item.device_id,
                                        })
                                })
                                count = count + date.data.length
                                //内层日期拼接
                                if((index===0)&&(k===0))
                                    children1.push({
                                        "title": date.time,
                                        "expand":true,
                                        "children":children2,
                                        "disabled":true
                                    })
                                else {
                                    children1.push({
                                        "title": date.time,
                                        "expand":false,
                                        "children":children2,
                                        "disabled":true
                                    })
                                }
                            })
                            //外层拼接
                            if(index===0)
                                treeData.push({
                                    "title": item.device_name.length>=10?item.device_name.substr(0,18)+"...("+count+")":item.device_name+" ("+count+")",
                                    "expand":true,
                                    "disabled":true,
                                    "children":children1
                                })
                            else
                                treeData.push({
                                    "title": item.device_name.length>=10?item.device_name.substr(0,18)+"...("+count+")":item.device_name+" ("+count+")",
                                    "expand":false,
                                    "disabled":true,
                                    "children":children1
                                })

                        })
                        this.data = treeData
                        this.onTreeClick([],this.data[0].children[0].children[0])
                    }).catch(error=>{
                        if(config.DEBUG) console.log(error)
                        this.$Message.error("异常列表获取失败")
                })
            },
            downloadLog(path,name){
                let arr = path.split(".")
                console.log(path)
                if(arr[arr.length-1]==="zip"){    // or arr.pop()
                    console.log(1111)
                    window.open(this.baseUrl+path)
                    return
                }
                console.log(2222)
                //  非zip文件下载  （特别针对txt文件）
                this.$ajax.get(path, {responseType: 'blob'}).then(res => {
                    let blob = new Blob([res.data]);
                    let url = window.URL.createObjectURL(blob);
                    let a = document.createElement("a");
                    a.href = url;
                    a.download = name;
                    a.click();
                    window.URL.revokeObjectURL(url);
                })
            },
            // abnormal list click event
            onTreeClick(list,item){
                this.abnormalKey = item.id
                this.abnormalData = item
                this.abnormalFilterDate = [new Date(this.abnormalData.abnm_start_time),new Date(this.abnormalData.abnm_start_time)]
                this.beforeAbnormalDateClick(1,5)
                this.afterAbnormalDateClick(1,-5)
            },
            //异常数据时间切换  5/15/60   rds数据加载部分
            beforeAbnormalDateClick(i,minutes){
                this.isActive1 = i;
                this.beforeAbnormalFilterDate = [new Date(new Date(this.abnormalData.abnm_start_time)-60000*minutes),new Date(this.abnormalData.abnm_start_time)]
            },
            afterAbnormalDateClick(i,minutes){
                this.isActive2 = i;
                this.afterAbnormalFilterDate = [new Date(this.abnormalData.abnm_start_time),new Date(new Date(this.abnormalData.abnm_start_time)-60000*minutes)]
            },
            afterRdsLoadData(flag){
                this.scrollMore = false
                this.noMoreData = !flag
            },
            afterRdsLoadData2(flag){
                this.scrollMore2 = false
                this.noMoreData2 = !flag
            },
            afterRdsLoadData3(flag){
                this.scrollMore3 = false
                this.noMoreData3 = !flag
            },
            onClickLoadMoreRds(){
                this.scrollMore = true
                this.$refs.rdsCard.loadMoreData(false)
            },
            onClickLoadMoreRds2(){
                this.scrollMore2 = true
                this.$refs.rdsCard2.loadMoreData(false)
            },
            onClickLoadMoreRds3(){
                this.scrollMore3 = true
                this.$refs.rdsCard3.loadMoreData(false)
            },

        },
        watch:{
            propDevices:{
                handler: function(){
                    this.getPowerAbnormalList()
                },
                // immediate: true
            },
            propTboardId:{
                handler: function(){
                    this.getPowerAbnormalList()
                },
                // immediate: true
            },
            propFilterDateRange:{
                handler: function(val){
                    this.getPowerAbnormalList()
                },
                // immediate: true
            }
        },
        mounted(){
            this.getPowerAbnormalList()
        }
    }
</script>

<style scoped>
    .pow-title{
        font-weight: bold;
        background: #f8f8f9;
        padding: 10px;
        border: 1px solid #e8eaec;
        border-bottom: none;
    }
    .pow-val{
        /*padding: 10px;*/
        height: 43px;
        line-height: 43px;
        border-top: 1px solid #e8eaec;
        border-right: 1px solid #e8eaec;
    }

    .scroll-bar::-webkit-scrollbar {/*滚动条整体样式*/
        width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
        height: 4px;
    }
    .scroll-bar::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
        border-radius: 5px;
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.1);
        background: rgba(0,0,0,0.2);
    }
    .scroll-bar::-webkit-scrollbar-track {/*滚动条里面轨道*/
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        border-radius: 0;
        background: rgba(0,0,0,0);
    }
    .active{
        border: 1px solid #1bbc9c;
    }

</style>



