<template>
    <div class="gallery" :class="mode">
        <!--<div class="thumbnail" v-show="false">-->
            <!--<ul>-->
                <!--<li v-for="(pic, idx) in picUrl" :key="pic.idx">-->
                    <!--<img :alt="pic.file_name" :title="pic.file_name" @click="selectPic(pic, idx)" :class="idx === curPicIdx ? 'selected' : ''">-->
                    <!--<p :title="pic.file_name">{{ pic.file_name }}</p>-->
                 <!--</li>-->
            <!--</ul>-->
        <!--</div>-->
        <div class="picture">
            <!--<Icon type="ios-arrow-dropleft-circle" size="60"  style="position: absolute;top: 45%;left: 5%;cursor: pointer;" @click="prevBtn"/>-->
            <img :src="baseUrl+imgFile" alt="图片走丢了" style="object-fit:contain">
            <!--<Icon type="ios-arrow-dropright-circle" size="60" style="position: fixed;top: 45%;right: 5%;cursor: pointer;" @click="nextBtn"/>-->
            <p style="margin-top: 15px;font-size: 18px">{{ picName }}</p>
        </div>
    </div>
</template>
<script>
    import config from "../../lib/config";

    export default {
        name: 'Gallery',
        props: {
            mode: { // 决定缩略图的展示模式(水平/竖直), 参数传递错误时采用水平模式
                type: String,
                default: 'vertical',
                validator: (val) => {
                    if (val !== 'horizontal' || val !== 'vertical') {
                        return 'horizontal'
                    }
                }
            },
            picUrl: { // 需要展示的图片的数组, 数组元素结构为 { name: '', file: ''} file为图片的url
                type: Array,
                default () {
                    return []
                 }
            },
            imgFile:{   //需要展示的图片路径
                type: String,
                default: '',
            },
            picName:{
                type: String,
                default: '',
            }
        },
        data () {
            return {
                curPic: { // 当前选中的图片, 点击确定时会将该字段返回给父组件
                    thumbs_file: '',
                    file_name: '',
                    img_file:""
                },
                curPicIdx: 0, // 当前选中图片的位置下标
                baseUrl:"http://"+config.REEF_HOST+":"+config.REEF_PORT,
            }
        },
        watch: {
            picUrl (val) {
                setTimeout(() => {
                    if (val[0]) {
                        this.curPic = val[0]
                        this.curPicIdx = 0
                    }
                }, 300)
            },
            curPic (val) {
                let image = new Image()
                image.src = this.curPic.img_file
                image.onload = () => { // 使图片尺寸自适应
                    if (image.width > image.height) {
                        this.picDom.style.width = '100%'
                        this.picDom.style.maxWidth = '100%'
                    } else {
                        this.picDom.style.height = '100%'
                        this.picDom.style.maxHeight = '100%'
                    }
                }
            },
            picName(val){
                for (let i = 0; i < this.picUrl.length; i++) {
                    if(this.picUrl[i].file_name===val){
                        this.curPic = this.picUrl[i]
                        this.curPicIdx = i
                        return
                    }
                }
            }
        },
        methods: {
            selectPic (pic, idx) { // 点击缩略图时选中图片
                this.curPic = pic
                this.curPicIdx = idx
                this.$emit("on-pic-click",pic)
            },
            nextBtn(){
                if(this.picUrl[this.curPicIdx+1]){
                    this.curPicIdx++
                    this.curPic = this.picUrl[this.curPicIdx]
                    this.$emit("on-pic-click",this.curPic)
                }
            },
            prevBtn(){
                if(this.curPicIdx===0)
                    return
                this.curPicIdx--
                this.curPic = this.picUrl[this.curPicIdx]
                this.$emit("on-pic-click",this.curPic)
            },
            //键盘左右切换事件
            onKeyUpEvent(event) {
                if(this.picUrl.length>0){
                    if (event.keyCode === 37) {  //左 ←
                        this.prevBtn()
                    } else if (event.keyCode === 39) {  //右 →
                        this.nextBtn()
                    }
                }
            }
        },
        mounted () {
            this.picDom = document.querySelector('.picture > img')
        },
        created() {
            // window.addEventListener('keyup', this.onKeyUpEvent)
        },
        beforeDestroy() {
            // window.removeEventListener('keyup', this.onKeyUpEvent)
        }
    }
</script>
<style lang="less" scoped>
    .gallery {
        display: flex;
        height: 100%;
        .thumbnail {
            padding: 1em;
            border-radius: 4px;
            background-color: #515a6e;
            ul {
                list-style: none;
                overflow: auto;
                li {
                    text-align: center;
                    img {
                        cursor: pointer;
                        border-radius: 4px;
                        transition: all .3s linear;
                        &:hover {
                            box-shadow: 0 0 6px #333333;
                        }
                    }
                }
                .selected {
                    border: 1px solid red;
                }
                p {
                    width: 100%;
                    color: #1bbc9c;
                    text-align: center;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
        }
        .picture {
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 16px 0;
            background-color: #fff;
            img{
                height: calc(100% - 30px);
            }
        }
    }
    .horizontal {
        flex-direction: row;
        .thumbnail {
            height: 100%;
            width: 160px;
            ul {
                display: flex;
                flex-direction: column;
                width: 100%;
                height: 100%;
                li {
                    width: 100%;
                    margin-bottom: 1.4em;
                    img {
                      width: 100%;
                    }
                }
                :last-child {
                    margin-bottom: 0;
                }
            }
        }
    }
    .vertical {
        flex-direction: column;
        .thumbnail {
            height: 150px;
            padding-bottom: 0.4em;
            ul {
                display: flex;
                 height: 100%;
                li {
                    height: 100%;
                    width: 200px;
                    margin-right: 1em;
                    img {
                        height: 100%;
                        max-width: 200px;
                        max-height: calc(100% - 28px);
                    }
                }
                :last-child {
                    margin-right: 0;
                }
            }
        }
    }
</style>
