<template>
    <div class="shopcar" @click="toggleList">
        <div class="content">
            <div class="content-left">
                <div class="logo-wrapper">
                    <div class="logo" :class="{'highLight':this.totalCount>0}">
                        <i class="icon-shopping_cart"></i>
                    </div>
                    <div class="total-count" v-show="this.totalCount>0">{{totalCount}}</div>
                </div>
                <div class="shopcar-price" :class="{'highLight':this.totalPrice>0}">¥{{totalPrice}}</div>
                <div class="shopcar-desc">另需配送费¥{{deliveryPrice}}元</div>
            </div>
            <div class="content-right">
                <div class="pay" :class="payClass" @click.stop.prevent="pay">
                    {{payDesc}}
                </div>
            </div>
        </div>
        <div class="ball-container">
            <div v-for="ball in balls" transition="drop" v-show="ball.show" class="ball">
                <div class="inner inner-hook"></div>
            </div>
        </div>
        <div class="shopcar-list" v-show="listShow" transition="fold">
            <div class="list-header">
                <h1 class="title">购物车</h1>
                <span class="empty" @click="empty">清空</span>
            </div>
            <div class="list-content" v-el:list-content>
                <ul>
                    <li class="food border-1px" v-for="food in selectFoods">
                        <span class="name">{{food.name}}</span>
                        <div class="price">
                            <span>￥{{food.price*food.count}}</span>
                        </div>
                        <div class="cartcontrol-wrapper">
                            <cartcontrol :food="food"></cartcontrol>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <div class="list-mask" v-show="listShow" transition="fade" @click="hideList"></div>
</template>
<script>
import BScroll from 'better-scroll';
import cartcontrol from '../cartcontrol/cartcontrol';
    export default{
        props:{
            selectFoods:{
                type:Array,
                default() {
                    return [];
                }
            },
            deliveryPrice:{
                type:Number,
                default:0
            },
            minPrice:{
                type:Number,
                default:0
            }
        },
        data() {
            return {
                balls:[
                    {
                        show:false
                    },
                    {
                        show:false
                    },
                    {
                        show:false
                    },
                    {
                        show:false
                    },
                    {
                        show:false
                    }
                ],
                dropBalls:[],
                fold:true
            };
        },
        computed:{
            totalPrice() {
                let total = 0;
                this.selectFoods.forEach((food)=>{
                    total +=food.price*food.count;
                });
                return total;
            },
            totalCount() {
                let count=0;
                this.selectFoods.forEach((food)=>{
                    count += food.count;
                })
                return count;
            },
            payDesc() {
                if(this.totalPrice===0){
                    return `¥${this.minPrice}起送`;
                }else if(this.totalPrice<this.minPrice){
                    let diff=this.minPrice-this.totalPrice;
                    return `还差${diff}元起送`;
                }else{
                    return '去结算';
                }
            },
            payClass() {
                if(this.totalPrice<this.minPrice){
                    return "not-enough";
                }else{
                    return "enough";
                }
            },
            listShow() {
                if (!this.totalCount) {
                    this.fold = true;
                    return false;
                }
                let show = !this.fold;
                
                if(show){
                    this.$nextTick(() => {
                        if(!this.scroll){
                            this.scroll=new BScroll(this.$els.listContent,{
                                click:true
                            });
                        }else {
                            this.scroll.refresh();
                        }
                        
                    })
                }
                return show;
            }
        },
        methods: {
            drop(el) {
                for(let i=0;i<this.balls.length;i++){
                    let ball=this.balls[i];
                    if(!ball.show){
                        ball.show=true;
                        ball.el=el;
                        this.dropBalls.push(ball);
                        return;
                    }
                }
            },
            toggleList() {
                if (!this.totalCount) {
                return;
                }
                this.fold = !this.fold;
            },
            empty() {
                this.selectFoods.forEach((food)=>{
                    food.count=0;
                });
            },
            hideList() {
                this.fold=true;
            },
            pay() {
                if(this.totalPrice<this.minPrice){
                    return;
                }
                window.alert(`支付${this.totalPrice}元`)
            }
    },
      transitions:{
          drop:{
              beforeEnter(el){
                  let count=this.balls.length;
                  while(count--){
                      let ball=this.balls[count];
                      if(ball.show){
                          let rect=ball.el.getBoundingClientRect();//计算点击小球初始位置
                          let x=rect.left-32;//x轴,因为小球最终要乱在购物车那一块，离视口向右偏移32px；
                          let y=-(window.innerHeight-rect.top-22);//y轴
                          el.style.display='';
                          el.style.webKitTransform=`translate3d(0,${y}px,0)`;
                          el.style.transform=`translate3d(0,${y}px,0)`;
                          let inner=el.getElementsByClassName('inner-hook')[0];
                          inner.style.webKitTransform=`translate3d(${x}px,0,0)`;
                          inner.style.transform=`translate3d(${x}px,0,0)`;
                      }
                  }
              },
              enter(el){
                  let rf=el.offsetHeight;//触发浏览器重绘
                  this.$nextTick(()=>{
                        el.style.webKitTransform='translate3d(0,0,0)';
                        el.style.transform='translate3d(0,0,0)';
                        let inner=el.getElementsByClassName('inner-hook')[0];
                        inner.style.webKitTransform='translate3d(0,0,0)';
                        inner.style.transform='translate3d(0,0,0)';
                  });
              },
              afterEnter(el){
                  let ball=this.dropBalls.shift();
                  if(ball){
                      ball.show=false;
                      el.style.display='none';
                  }
              }
          }
      },
      components: {
         cartcontrol
      }
    };
</script>
<style lang="">
    .shopcar{
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 50;
        height: 48px;
        width: 100%;
        background: rgba(0,0,0,.5);
    }
    .shopcar .content{
        display: flex;
        background: #141d27;
        font-size: 0;
    }
    .shopcar .content .content-left{
        flex: 1
    }
    .shopcar .content .content-left .logo-wrapper{
        display: inline-block;
        position: relative;
        top:-10px;
        margin:0 12px;
        padding: 6px;
        width: 56px;
        height: 56px;
        box-sizing: border-box;
        border-radius: 50%;
        vertical-align: top;
        background: #141d27;
    }
    .shopcar .content .content-left .logo-wrapper .logo{
        width: 100%;
        height: 100%;
        background: #2b343c;
        border-radius: 50%;
        text-align: center;
    }
    .shopcar .content .content-left .logo-wrapper .logo.highLight{
        background: rgb(0, 160, 220);
    }
    .shopcar .content .content-left .logo-wrapper .logo.highLight .icon-shopping_cart{
        color: #fff;
    }
    .shopcar .content .content-left .logo-wrapper .total-count{
        position: absolute;
        top: 0;right: 0;
        width: 24px;
        height: 16px;
        line-height: 16px;
        text-align: center;
        border-radius: 18px;
        font-size: 9px;
        font-weight: 700;
        color:#fff;
        background: rgb(240, 20, 20);
        box-shadow: 0 4px 8px 0 rgba(0,0,0,.4);
    }
    .logo-wrapper .logo .icon-shopping_cart{
       line-height: 44px;
       font-size: 24px;
       color: #80858a;
    }
    .shopcar .content .content-left .shopcar-price{
        display: inline-block;
        vertical-align: top;
        font-weight: 700;
        line-height:24px;
        margin-top:12px;
        box-sizing: border-box;
        padding-right: 12px;
        border-right: 1px solid rgba(255,255, 255, .1);
        font-size: 16px;
        letter-spacing: 2px;
        color: rgba(255,255, 255, .4);
    }
    .shopcar .content .content-left .shopcar-price.highLight{
        color: #fff;
    }
    .shopcar .content .content-left .shopcar-desc{
        display: inline-block;
        vertical-align: top;
        line-height: 24px;
        margin: 12px 0 0 12px;
        font-size: 12px;
        color: rgba(255,255, 255, .4);
    }
    .shopcar .content .content-right{
        flex: 0 0 105px;
        width: 105px;
        
    }
    .shopcar .content .content-right .pay{
        height: 48px;
        line-height: 48px;
        text-align: center;
        font-size: 12px;
        
        font-weight: 700;
        color: rgba(255,255, 255, .5);  
    }
    .shopcar .content .content-right .pay.not-enough{
        background: #2b333b;
    }
    .shopcar .content .content-right .pay.enough{
        background: #00b43c;
        color:#fff;
    }
    .ball-container{}
    .ball-container .ball{
        position: fixed;
        left: 32px;
        bottom: 22px;
        z-index: 200;
    }
    .ball-container .ball .inner{
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: rgb(0, 160, 220);
        transition:all 0.4s linear;
    }
    .ball-container .ball.drop-transition{
        transition:all 0.4s cubic-bezier(0.49,-0.29,0.75,0.41);
    }
    .shopcar-list{
        position: absolute;
        left: 0;
        top:0;
        z-index: -1;
        background: #;
        width: 100%;
    }
    .shopcar-list.fold-transition{
        transition:all 0.5s; 
        transform: translate3d(0,-100%,0);
    }
    .shopcar-list.fold-enter,.shopcar-list.fold-leave{
        transform: translate3d(0,0,0);
    }
    .shopcar-list .list-header{
        height: 40px;
        line-height: 40px;
        box-sizing: border-box;
        padding: 0 18px;
        width: 100%;
        background: #f3f5f7;
        border-bottom: 1px solid rgba(7,17,27,.1);
    }
    .shopcar-list .list-header .title{
        float: left;
        font-size: 14px;
        color: rgb(7, 17, 27);
    }
    .shopcar-list .list-header .empty{
        float: right;
        font-size: 12px;
        color: rgb(0,160,220);
    }
    .shopcar-list .list-content{
        padding: 0 18px;
        max-height: 217px;
        background: #fff;
        overflow: hidden;
    }
    .list-content .food{
        position: relative;
        padding: 12px 0;
        box-sizing: border-box;
    }
    .list-content .food .name{
        line-height: 24px;
        font-size: 12px;
        color: rgb(7, 17, 27);
    }
    .list-content .food .price{
        position: absolute;
        right: 90px;
        bottom:12px;
        line-height: 24px;
        color:rgb(240, 20, 20);
        font-size: 14px;
        font-weight: 700;
    }
    .list-content .food .cartcontrol-wrapper{
        position: absolute;
        bottom:6px;
        right: 0;
    }
    .list-mask{
        position: fixed;
        z-index: 40;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        backdrop-filter: blur(10px);
    }
    .list-mask.fade-transition{
        opacity: 1;
        background: rgba(7,17,27,.6);
        
        transition: all 0.5s;
    }
    .list-mask.fade-enter,.list-mask.fade-leave{
        opacity: 0;
        background: rgba(7,17,27,0);
    }
</style>