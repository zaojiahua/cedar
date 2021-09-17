<template>
  <!--<Modal v-model="curOpen" :closable="false" fullscreen @on-ok="close(true)" @on-cancel="close(false)">-->
    <div class="gallery" :class="mode">
        <div class="thumbnail">
            <ul>
                <li v-for="(pic, idx) in picUrl" :key="pic.name">
                    <img :src="baseUrl+pic.thumbs_file" :alt="pic.file_name" :title="pic.file_name" @click="selectPic(pic, idx)" :class="idx === curPicIdx ? 'selected' : ''">
                    <p :title="pic.file_name">{{ pic.name }}</p>
                 </li>
            </ul>
        </div>
        <div class="picture">
            <img :src="baseUrl+curPic.img_file" :alt="curPic.file_name" style="object-fit:contain">
            <p></p>
        </div>
    </div>
  <!--</Modal>-->
</template>
<script>
    import config from "../../lib/config";

    export default {
        name: 'Gallery',
        props: {
            // open: Boolean,
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
                    return [
                      // {
                      //   file_name: 1,
                      //   thumbs_file: 'https://t1.hxzdhn.com/uploads/tu/202005/9999/6ef75a2cbd.jpg',
                      //   img_file:""
                      // }, {
                      //   name: 2,
                      //   file: 'https://t1.hxzdhn.com/uploads/tu/202005/9999/fd949f19b7.jpg'
                      // },
                    ]
                 }
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
                console.log(val)
                console.log(val[0]);
                console.log(JSON.parse(JSON.stringify(val[0])))
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
        },
        methods: {
            selectPic (pic, idx) { // 点击缩略图时选中图片
                this.curPic = pic
                this.curPicIdx = idx
            },
        },
        mounted () {
            this.picDom = document.querySelector('.picture > img')
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
            flex: 1;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            padding-top: 1.4em;
            background-color: #fff;
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
            height: 200px;
            padding-bottom: 0.4em;
            ul {
                display: flex;
                 height: 100%;
                align-items: baseline;
                overflow-y: hidden;
                li {
                    height: 100%;
                    width: 100px;
                    margin-right: 1em;
                    img {
                         max-width: 100px;
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
