<template>
    <div class="p-container">
        <div class="photos">
            <p style="background: #eee;height: 40px;line-height: 40px;font-weight: bold;padding: 0 10px">
                <span>丢帧点  {{ lose_frame_point_index ? lose_frame_point_index+'.jpg' : '无' }}</span>
                <Dropdown placement="bottom-end" style="float: right;margin-right: 5px;">
                    <span><Icon type="md-more" size="16"/></span>
                    <DropdownMenu slot="list">
                        <span @click="quickJump(lose_frame_point_index)"><DropdownItem>丢帧点</DropdownItem></span>
                        <span @click="quickJump(1)"><DropdownItem>顶部</DropdownItem></span>
                        <span @click="quickJump(rdsPhotosData.picture_count)"><DropdownItem>底部</DropdownItem></span>
                    </DropdownMenu>
                </Dropdown>
            </p>
            <div class="photo-list">
                <div v-for="i in rdsPhotosData.picture_count" :id="'p'+i" style="cursor: pointer;"
                     :class="{list_select:i===selectedIndex}" @click="onListClick(i)">
                    <span class="circle" :class="classObject(i)"></span><span>{{ i }}.jpg</span>
                </div>
            </div>
        </div>
        <div class="photo-right">
            <Row style="text-align: right">
                <Button type="primary" v-show="isShowBtn()" @click="setPoint(true)">
                    设为丢帧点
                </Button>
                <Button v-show="!isShowBtn()"style="margin-left: 16px;"  @click="setPoint(false)">设为正常点</Button>
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
        lose_frame_point: "string",
        picture_count: "int",
        url_prefix: "string",
    }

    export default {
        name: "CompPerfRdsPhotosFrame",
        data() {
            return {
                showLoading: false,
                rdsPhotosData: utils.validate(rdsPhotosSerializer, {}),
                selectedIndex: null,   //选中的图
                selectedUrl: "",     //大图url
                lose_frame_point_index:null,    //丢帧点
            }
        },
        methods: {
            refresh(id) {
                this.showLoading = true
                this.$ajax.get("api/v1/cedar/rds/" + id + "/?fields=" +
                    "lose_frame_point," +
                    "url_prefix," +
                    "picture_count")
                    .then(response => {
                        this.showLoading = false
                        this.rdsPhotosData = utils.validate(rdsPhotosSerializer, response.data)
                        this.selectedIndex = this.rdsPhotosData.lose_frame_point ? parseInt(this.rdsPhotosData.lose_frame_point) : 1
                        this.selectedUrl = this.rdsPhotosData.lose_frame_point ? this.rdsPhotosData.url_prefix + this.rdsPhotosData.lose_frame_point +".jpg" : this.rdsPhotosData.url_prefix + "1.jpg"
                        this.lose_frame_point_index = parseInt(this.rdsPhotosData.lose_frame_point)
                        this.$nextTick(function () {
                            document.querySelector("#p" + this.lose_frame_point_index).scrollIntoView(true);
                        })
                    }).catch(error => {
                    if (config.DEBUG) console.log(error)
                    this.$Message.error("图集信息获取失败")
                })
            },
            //点击列表出来大图
            onListClick(index) {
                this.selectedIndex = index;
                this.selectedUrl = this.rdsPhotosData.url_prefix + this.selectedIndex + ".jpg"
            },
            //图片列表前面的小圆圈
            classObject(index) {
                if (index === this.lose_frame_point_index)
                    return "selectPoint"
                else
                    return "normal"
            },
            //正常点和丢帧点按钮切换
            isShowBtn(){
                return this.selectedIndex !== this.lose_frame_point_index
            },
            //点击按钮作为丢帧点或取消丢帧点
            setPoint(flag) {
                if (flag)    //true:设为丢帧点    false:设为正常点
                    this.lose_frame_point_index = this.selectedIndex
                else
                    this.lose_frame_point_index = null
            },
            //点击快捷跳转到起点终点，顶部底部
            quickJump(point) {
                this.selectedIndex = point
                this.selectedUrl = this.rdsPhotosData.url_prefix + point + ".jpg"
                document.querySelector("#p" + point).scrollIntoView(true);
            },
            getPointMsg() {
                return {
                    lose_frame_point_index: this.lose_frame_point_index,
                }
            },
            //按键控制上下切换
            onKeyUpList(event) {
                if (event.keyCode === 38) {
                    if (this.selectedIndex === 1) return
                    this.selectedIndex--;
                    this.selectedUrl = this.rdsPhotosData.url_prefix + this.selectedIndex + ".jpg"
                } else if (event.keyCode === 40) {
                    if (this.selectedIndex === this.rdsPhotosData.picture_count) return
                    this.selectedIndex++;
                    this.selectedUrl = this.rdsPhotosData.url_prefix + this.selectedIndex + ".jpg"
                }
            }
        },
        created() {
            window.addEventListener('keyup', this.onKeyUpList)
        },
        beforeDestroy() {
            window.removeEventListener('keyup', this.onKeyUpList)
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
        position: relative;
    }

    .photo-list {
        font-size: 12px;
        height: calc(100vh - 137px);
        padding: 10px;
        overflow: auto;

    }

    .list_select {
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

    .selectPoint {
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