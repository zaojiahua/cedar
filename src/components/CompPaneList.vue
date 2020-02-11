<template>
    <div>
        <Row style="margin-bottom: 15px;">
            <span>设备情况：</span>
            <Tag type="dot" color="#CBD0D3">暂无设备</Tag>
            <Tag type="dot" color="#18A360">正常</Tag>
            <Tag type="dot" color="#D04B40">异常</Tag>
        </Row>
        <div v-for="(item,index) in paneList" :key="index" class="pane-list">
            <comp-pane-card :prop-pane="item" :prop-index="index" @remove-pane="onRemovePane"  @on-add-device="onAddDevice"></comp-pane-card>
        </div>
        <div class="add-pane">
            <Icon type="ios-add" size="300" style="cursor: pointer" @click="onOpenModal"/>
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
        <Modal v-model="openModal" :footer-hide="true" :mask-closable="false" width="530">
            <p style="font-size: 16px;margin: 0 0 5px;">注：请在灰色位置区域添加要添加的设备！</p>
            <comp-pane-card :prop-pane="propPane" :prop-show-remove-btn="false" @on-slot-click="onSlotClick"></comp-pane-card>
        </Modal>



    </div>

</template>

<script>

    import CompPaneCard from "./CompPaneCard"
    import config from "../lib/config"


    export default {
        components:{ CompPaneCard },
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
                // this.propPane = paneObj;
                this.propPane = this.paneList[index];
            },
            onSlotClick(row,col,id){
                let device = {
                    id:1,
                    device_name:"addD1",
                    status:"idle"
                }
                let key = row + "," + col

                if(this.paneList[this.paneIndex].slotList[key].status==="OK"){
                    this.$Message.info("该区域已有设备，请在未放置设备区域添加设备！")
                    return
                }
                let root = this;
                this.$Modal.confirm({
                    title:"提示：",
                    content:"您确定要在该位置("+ row + "," + col +")处添加设备吗？",
                    onOk(){
                        let slotListItem = root.paneList[root.paneIndex].slotList[key];
                        root.$set(slotListItem,"device",device)
                        root.$set(slotListItem,"status","OK")
                        root.openModal = false;
                    }
                })
            }
        },
        mounted(){
            this.refresh();
        }
    }
</script>


<style scoped>
    .pane-list{
        position:relative;
        float:left;
        width: 500px;
        height: 450px;
        margin:0 20px 20px 0;
    }
    .add-pane{
        float: left;
        width: 500px;
        height: 400px;
        text-align: center;
        padding-top: 40px;
        border:1px solid #dcdcdc;
    }
    .pane-size{
        width: 80px;
        margin-right: 5px;
    }
    .pane-type{
        margin-right: 20px!important;
        border-radius: 5px!important;
    }
</style>







