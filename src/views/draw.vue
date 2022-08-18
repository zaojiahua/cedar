<template>
    <div>
        <canvas id="canvas" ></canvas>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                canvas:null,
                //上一次触摸坐标
                lastX:null,
                lastY:null,
                ctx:null,
            }
        },
        methods:{
            //触摸开始事件
            onTouchStart(event) {
                event.preventDefault();
                this.lastX=event.touches[0].clientX;
                this.lastY=event.touches[0].clientY;
                this.drawRound(this.lastX,this.lastY);
            },
            //触摸滑动事件
            onTouchMove(event) {
                try
                {
                    event.preventDefault();
                    this.drawLine(this.lastX,this.lastY,event.touches[0].clientX,event.touches[0].clientY);
                    this.lastX=event.touches[0].clientX;
                    this.lastY=event.touches[0].clientY;
                }
                catch(err){
                    alert( err.description);
                }
            },
             //画圆
             drawRound(x,y) {
                 this.ctx.fillStyle="#FF0000";
                 this.ctx.beginPath();
                 this.ctx.arc(x,y,8,0,Math.PI*2,true);
                 this.ctx.closePath();
                 this.ctx.fill();
             },
             //画线
             drawLine(startX,startY,endX,endY) {
                 this.ctx.beginPath();
                 this.ctx.lineCap="round";
                 this.ctx.moveTo(startX,startY);
                 this.ctx.lineTo(endX,endY);
                 this.ctx.stroke();
             }
        },
        mounted(){
            this.canvas = document.getElementById("canvas");
            //full screen
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;

            //是否支持触摸
            let touchable = 'ontouchstart' in document;
            if (touchable) {
                this.canvas.addEventListener('touchstart', this.onTouchStart, false);
                this.canvas.addEventListener('touchmove', this.onTouchMove, false);
            } else {
                alert("当前设备不支持触屏");
            }
            this.ctx = this.canvas.getContext("2d");
            this.ctx.lineWidth=16;//画笔粗细
            this.ctx.strokeStyle="#FF0000";//画笔颜色
        }
    }

</script>
