<template>
    <div class="p-container">
        <div class="photos">
            <p style="background: #eee;height: 40px;line-height: 40px;font-weight: bold;padding: 0 10px">
                <span>启动时间  {{ job_duration }}s</span>
                <Dropdown placement="bottom-end" style="float: right;margin-right: 5px;">
                    <span><Icon type="md-more" size="16" /></span>
                    <DropdownMenu slot="list">
                        <span @click="quickJump(startPoint)"><DropdownItem>起点</DropdownItem></span>
                        <span @click="quickJump(endPoint)"><DropdownItem>终点</DropdownItem></span>
                        <span @click="quickJump(1)"><DropdownItem>顶部</DropdownItem></span>
                        <span @click="quickJump(rdsPhotosData.picture_count)"><DropdownItem>底部</DropdownItem></span>
                    </DropdownMenu>
                </Dropdown>
            </p>
            <div class="photo-list">
                <div v-for="i in rdsPhotosData.picture_count" :id="'p'+i" style="cursor: pointer;" :class="{list_select:i===selectedIndex}" @click="onListClick(i)">
                    <span class="circle" :class="classObject(i)"></span><span>{{ i }}.jpg</span>
                </div>
            </div>
        </div>
        <div class="photo-right">
            <Row style="text-align: right">
                <Button type="primary" style="margin-right: 16px;" :disabled="!isDisabled('start')" @click="setPoint(true)">设为起点</Button>
                <Button type="error" :disabled="!isDisabled('end')" @click="setPoint(false)">设为终点</Button>
            </Row>
            <div style="height: calc(100vh - 165px);text-align: center">
                <img :src="selectedUrl" alt="图片走丢了" style="max-height: 92%;max-width: 100%;">
            </div>
        </div>

        <Spin fix size="large" v-if="showLoading"></Spin>
    </div>
</template>

<script>
    import config from "../lib/config"
    import utils from "../lib/utils"

    const rdsPhotosSerializer = {
        end_point: "int",
        job_duration: "float",
        picture_count: "int",
        start_point: "int",
        time_per_unit: "float",
        url_prefix: "string"
    }


    export default {
        name: "CompPerfRdsPhotos",
        data(){
            return{
                showLoading:false,
                rdsPhotosData:utils.validate(rdsPhotosSerializer,{}),
                selectedIndex:null,   //选中的图
                selectedUrl:"",     //大图url
                startPoint:null,
                endPoint:null,
                job_duration: null,
            }
        },
        methods:{
            refresh(id){
                this.showLoading = true
                this.$ajax.get("api/v1/cedar/rds/" + id + "/?fields=" +
                    "job_duration," +
                    "start_point," +
                    "end_point," +
                    "url_prefix," +
                    "picture_count," +
                    "time_per_unit")
                    .then(response=>{
                        this.showLoading = false
                        this.rdsPhotosData = utils.validate(rdsPhotosSerializer, response.data)
                        this.selectedIndex = this.rdsPhotosData.start_point
                        this.selectedUrl = this.rdsPhotosData.url_prefix + this.rdsPhotosData.start_point + ".jpg"
                        this.startPoint = this.rdsPhotosData.start_point
                        this.endPoint = this.rdsPhotosData.end_point
                        this.job_duration = this.rdsPhotosData.job_duration

                        this.$nextTick(function () {
                            document.querySelector("#p" + this.rdsPhotosData.start_point).scrollIntoView(true);
                        })
                    }).catch(error=>{
                        if(config.DEBUG) console.log(error)
                        this.$Message.error("图集信息获取失败")
                })
            },
            //点击列表出来大图
            onListClick(index){
                this.selectedIndex = index;
                this.selectedUrl = this.rdsPhotosData.url_prefix + this.selectedIndex + ".jpg"
            },
            //图片列表前面的小圆圈
            classObject(index) {
                if(index === this.startPoint)
                    return "startPoint"
                else if(index === this.endPoint)
                    return "endPoint"
                else
                    return "normal"
            },
            //按钮是否可点击
            isDisabled(point){
                if(point==="start")       //设为起点
                    return  (this.selectedIndex !== this.startPoint)&&(this.selectedIndex<this.endPoint)
                if(point==="end")
                    return  (this.selectedIndex !== this.endPoint)&&(this.selectedIndex>this.startPoint)
            },
            //点击按钮作为起点或者终点
            setPoint(flag){
                if(flag)    //true:设为起点    false:设为终点
                    this.startPoint = this.selectedIndex
                else
                    this.endPoint = this.selectedIndex
                this.job_duration = (this.endPoint-this.startPoint)*this.rdsPhotosData.time_per_unit
            },
            //点击快捷跳转到起点终点，顶部底部
            quickJump(point){
                this.selectedIndex = point
                this.selectedUrl = this.rdsPhotosData.url_prefix + point + ".jpg"
                document.querySelector("#p" + point).scrollIntoView(true);
            },
            getPointMsg(){
                return{
                    startPoint:this.startPoint,
                    endPoint:this.endPoint,
                    job_duration:this.job_duration
                }
            },
        }
    }
</script>

<style scoped>
    .p-container {
        border: 1px solid #dcdcdc;
        height: calc(100vh - 95px);
        display: flex;
        flex-direction: row;
    }
    .photos {
        flex: 1;
        /*padding: 10px;*/
        position: relative;
    }
    .photo-list{
        font-size: 12px;
        height: calc(100vh - 137px);
        padding: 10px;
        overflow: auto;

    }
    .list_select{
        background: #bddbf7;
    }
    .circle {
        display: inline-block;
        width: 10px;
        height: 10px;
        margin-right: 5px;
        border-radius: 50px;
    }
    .normal {
        border: 1px solid #ccc;
    }
    .startPoint{
        background: #1bbc9c;
    }
    .endPoint{
        background: #e85542;
    }
    .photo-right {
        flex: 5;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 10px;
        border-left: 1px solid #dcdee2;
    }
</style>