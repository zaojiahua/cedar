<template>
    <div>
        <Row style="margin-bottom: 15px;">
            <span>设备情况：</span>
            <Tag type="dot" color="#CBD0D3">暂无设备</Tag>
            <Tag type="dot" color="#85D700">正常</Tag>
            <Tag type="dot" color="#D04B40"><span style="padding: 10px 0" @click="openErrorDevice=true">异常 ( {{ errorCount }} )</span></Tag>
        </Row>
        <div v-for="(item,index) in paneList" :key="index" class="pane-list">
            <comp-pane-card :prop-pane="item" :prop-index="index" @remove-pane="onRemovePane"  @on-add-device="onAddDevice" @after-remove-pane-slot="afterRemovePaneSlot"></comp-pane-card>
        </div>
        <div class="add-pane">
            <Icon type="ios-add" size="180" style="cursor: pointer;margin: 35px auto;" @click="onOpenModal"/>
            <p>添加Pane</p>
        </div>

        <Modal v-model="showAddPane" :closable="false" :footer-hide="true" :mask-closable="false">
            <Card>
                <p slot="title">Pane信息</p>
                <Icon slot="extra" @click.prevent="showAddPane=false;" type="md-close" />
                <Form :model="pane" :label-width="100">
                    <FormItem>
                        <b slot="label">项目名称：</b>
                        <Input v-model="pane.pane_name" placeholder="请输入"></Input>
                        <Input v-show="false"></Input>
                        <p>
                            注：  请按特定格式输入项目名称，不允许有空格<br/>
                            名称由字母、数字或下划线组成，不允许输入特殊字符<br/>
                            格式：名称  @  规格行  X  规格列<br/>
                            如：  pane001@2X3<br/>
                            最大规格不能超过 7 x 9<br/>
                        </p>
                    </FormItem>
                    <FormItem>
                        <b slot="label">类型：</b>
                        <RadioGroup v-model="paneType" type="button">
                            <Radio label="matrix" class="pane-type">matrix</Radio>
                            <!--<Radio label="Map" class="pane-type">Map</Radio>-->
                        </RadioGroup>
                    </FormItem>
                </Form>
                <p style="text-align: center">
                    <Button type="primary" @click="addPane">提交</Button>
                </p>
            </Card>
        </Modal>
        <Modal v-model="openModal" :footer-hide="true" :mask-closable="false" width="450">
            <p style="font-size: 16px;margin: 0 0 5px;">注：请在灰色位置区域添加要添加的设备！</p>
            <comp-pane-card :prop-pane="propPane" :prop-show-remove-btn="false" @on-slot-click="onSlotClick"></comp-pane-card>
        </Modal>

        <Modal v-model="openDevice" fullscreen :mask-closable="false" :closable="false" @on-ok="setDevice">
            <comp-device-list ref="selectDevice" :prop-device-slot="true" :prop-high-light="true" :prop-add-mode="false" :prop-device-status="true"
                              @on-row-click="onSelectDeviceModalRowClick"></comp-device-list>
        </Modal>

        <Modal v-model="openErrorDevice" fullscreen :mask-closable="false" :closable="false">
            <comp-device-list ref="errorDevice" :prop-device-slot-error="true" :prop-add-mode="false"
                              @on-row-click="onErrorDeviceRowClick">
                <Drawer slot="detail" v-model="showDeviceDetail" :transfer="false" :inner="true" :draggable="true" :closable="false" width="50">
                    <comp-device-detail ref="deviceDetail"></comp-device-detail>
                </Drawer>
            </comp-device-list>
            <div slot="footer">
                <Button type="primary" @click="openErrorDevice=false;showDeviceDetail=false;">返回</Button>
            </div>
        </Modal>


    </div>

</template>

<script>

    import CompPaneCard from "./CompPaneCard"
    import config from "../lib/config"
    import CompDeviceList from "../components/CompDeviceList";
    import CompDeviceDetail from "../components/CompDeviceDetail"



    export default {
        components:{ CompPaneCard ,CompDeviceList,CompDeviceDetail },
        data(){
            return{
                paneList:[],
                showAddPane:false,
                paneType:"matrix",
                pane:{
                    pane_name:"",
                },
                propPane:{},
                openModal:false,
                paneIndex:null,
                openDevice:false,
                selectDevice:null,
                slotKey:"",
                slotId:null,
                errorCount:0,
                openErrorDevice:false,
                showDeviceDetail:false,
            }
        },
        methods:{
            refresh(){
                this.$ajax.get("api/v1/cedar/get_paneview/")
                    .then(response=>{
                        let paneList = response.data
                        response.data.forEach(paneListObj=>{
                            let slotList = [];
                            paneListObj.paneslots.forEach(item=>{
                                let key = item.row + ',' + item.col
                                slotList[key] = item
                            })
                            this.$set(paneListObj, 'slotList' , slotList )
                        })
                        this.paneList = paneList;
                    }).catch(error=>{
                        if(config.DEBUG) console.log(error)
                        this.$Message.error("取得paneView信息列表失败")
                })
            },

            //添加pane
            addPane(){
                if(this.pane.pane_name.replace(/\s+/g,"").length === 0){
                    alert('请输入项目名称！')
                    return
                }
                //去除前后两端的空格
                this.pane.pane_name = this.pane.pane_name.replace(/(^\s*)|(\s*$)/g, "");
                if(!/^\w+@[1-7](x|X)[1-9]$/.test(this.pane.pane_name)){
                    this.$Message.error('格式错误')
                    return
                }
                let str = this.pane.pane_name.split("@")
                let size = str[1].replace("X","x").split("x")

                this.$ajax.post("api/v1/cedar/create_paneview/",{
                    name:this.pane.pane_name,
                    type:this.paneType,
                    cabinet:10000,
                    width:parseInt(size[1]),
                    height:parseInt(size[0]),
                    ret_level:0
                }).then(response=>{
                    this.refresh()
                    this.showAddPane = false
                }).catch(error=>{
                    if(config.DEBUG) console.log(error)
                    if(error.status===400)
                        this.$Message.error("该项目名称已存在，请重新输入！")
                    else
                        this.$Message.error("项目添加失败,请检查后再重新添加！")
                })
            },
            onOpenModal(){
                this.showAddPane=true;
                this.pane.pane_name = "";
                this.paneType = "matrix";
            },
            onRemovePane(index){
                this.paneList.splice(index,1)
            },
            //基于pane添加device
            onAddDevice(paneObj,index){
                this.paneIndex = index
                this.openModal = true;
                this.propPane = this.paneList[index];
            },
            onSlotClick(row,col,id){
                let key = row + "," + col
                this.slotKey = key
                this.slotId = id
                if(this.paneList[this.paneIndex].slotList[key].status!=="empty"){
                    this.$Message.info("该区域已有设备，请在未放置设备区域添加设备！")
                    return
                }
                let root = this;
                let x = row+1;
                let y = col+1;
                this.$Modal.confirm({
                    title:"提示：",
                    content:"您确定要在该位置("+ x + "," + y +")处添加设备吗？",
                    onOk(){
                        root.openDevice = true
                        root.$refs.selectDevice.refresh()
                    }
                })
            },
            setDevice(){
                let paneId = this.paneList[this.paneIndex].id
                if(this.selectDevice!==null){
                    this.$ajax.post("api/v1/cedar/link_paneview_device/",{
                            paneslot: this.slotId,
                            device: this.selectDevice,
                            paneview: paneId,
                            ret_level: 1
                        }).then(response=>{
                            let slotListItem = this.paneList[this.paneIndex].slotList[this.slotKey];
                            this.$set(slotListItem,"device",response.data.device)
                            this.$set(slotListItem,"status",response.data.status)
                            // root.openModal = false;
                            this.$Message.success("添加设备成功，请继续添加或关闭弹窗！")
                        }).catch(error=>{
                            if (config.DEBUG) console.log(error)
                            this.$Message.error("添加设备失败")
                        })
                }
            },
            onSelectDeviceModalRowClick(row){
                this.selectDevice = row.id
            },
            afterRemovePaneSlot(){
                this.refresh()
            },
            onErrorDeviceRowClick(row) {
                this.showDeviceDetail = true
                this.$refs.deviceDetail.refresh(row.id)
            },
        },
        mounted(){
            this.refresh();
            this.$ajax.get("api/v1/cedar/device/?fields=id&paneslot__isnull=False&status=error")
                .then(response=>{
                    this.errorCount = response.headers["total-count"]
                })
                .catch(error=>{
                    if(config.DEBUG) console.log(error)
                    this.$Message.error("获取异常数据失败")
                })
        }
    }
</script>


<style scoped>
    .pane-list{
        position:relative;
        float:left;
        width: 420px;
        height: 400px;
        margin:0 20px 20px 2px;
    }
    .add-pane{
        float: left;
        width: 420px;
        height: 350px;
        text-align: center;
        padding-top: 30px;
        margin-left: 2px;
        color: #02A7F0;
        border:1px solid #02A7F0;
    }
    .pane-type{
        margin-right: 20px!important;
        border-radius: 5px!important;
    }
</style>







