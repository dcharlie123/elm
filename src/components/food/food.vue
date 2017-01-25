<template>
    <div class="food" v-show="showFlag"  transition="move"  v-el:fooda>
        <div class="food-content">
            <div class="image-header">
                <img :src="food.image"></img>
                <div class="back" @click="hide">
                    <i class="icon-arrow_lift"></i>
                </div>
            </div>
            <div class="content">
                <h1 class="title">{{food.name}}</h1>
                <div class="detail">
                    <span class="sell-count">月售{{food.sellCount}}</span>
                    <span class="rating">好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                    <span class="new">¥{{food.price}}</span><span class="old" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                    <cartcontrol :food="food"></cartcontrol>
                </div>
                <div class="buy" @click="addFirst(food,$event)" v-show="!food.count||food.count===0" transition="fade">立即购买</div>
            </div>
            <split v-show="food.info"></split>
            <div class="info" v-show="food.info">
                <h1 class="title">商品信息</h1>
                <section class="text">{{food.info}}</section>
            </div>
            <split></split>
            <div class="rating">
                <h1 class="title">商品评价</h1>
                <ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
                <div class="rating-wrapper">
                    <ul v-show="food.ratings&&food.ratings.length">
                        <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item border-1px">
                            <div class="user">
                                <span class="name">{{rating.username}}</span>
                                <img :src="rating.avatar" alt="" width="12" height="12" class="avatar">
                            </div>
                            <div class="time">{{rating.rateTime | formatDate}}</div>
                            <p class="text">
                                <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>
                                {{rating.text}}
                            </p>
                        </li>
                    </ul>
                    <div class="no-rating" v-show="!food.ratings||!food.ratings.length">暂无评论</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Vue from 'vue';
import BScroll from 'better-scroll';
import cartcontrol from '../cartcontrol/cartcontrol';
import split from '../split/split'
import ratingselect from '../ratingselect/ratingselect';
import {formatDate} from '../../common/js/time';
const POSITIVE=0;
const NEGATIVE=1;
const ALL=2;
    export default{
        props:{
            food:{
                type:Object
            }
        },
        data(){
            return {
                showFlag:false,
                selectType:ALL,
                onlyContent:true,
                desc:{
                    all:'全部',
                    positive:'推荐',
                    negative:'吐槽'
                }
            };
        },
        methods:{
            show() {
                this.showFlag=true;
                this.selectTyp=ALL;
                this.onlyContent=true;
                this.$nextTick(()=>{
                    if (!this.scroll) {
                        this.scroll = new BScroll(this.$els.fooda, {
                            click: true
                        });
                    } else {
                        this.scroll.refresh();
                    }
                });
            },
            needShow(type,text) {
                if(this.onlyContent&&!text){
                    return false;
                }
                if(this.selectType===ALL){
                    return true;
                }else{
                    return type===this.selectType;
                }
            },
            hide() {
                this.showFlag=false;
            },
            addFirst(food,event) {
                if(!event._constructed){
                    return;
                };
                Vue.set(this.food,'count',1);
                this.$dispatch('cart.add',event.target);
            }
        },
        filters: {
          formatDate(time) {
              let date=new Date(time);
              return formatDate(date,'yyyy-MM-dd hh:mm');
          }  
        },
        components: {
            cartcontrol,
            split,
            ratingselect
        },
        events:{
            'ratingtype.select'(type){
                this.selectType=type;
                this.$nextTick(()=>{
                    this.scroll.refresh();
                })
                
            },
            'content.toggle'(onlyContent){
                this.onlyContent=onlyContent;
                this.$nextTick(()=>{
                    this.scroll.refresh();
                })
            }
        }
    };
</script>
<style lang="">
    .food{
        position: fixed;
        left: 0;
        top: 0;
        bottom: 48px;
        z-index: 30;
        width: 100%;
        background: #fff;
    }
    .food.move-transition{
        transition:all 0.2s linear;
        transform: translate3d(0,0,0);
    }
    .food.move-enter,.food.move-leave{
        transform: translate3d(100%,0,0);
    }
    .image-header{
        position: relative;
        /*等宽等高*/
        width: 100%;
        height: 0;
        padding-top: 100%;
    }
    .image-header img{
        position: absolute;
        top:0;
        left: 0;
        height: 100%;
        width: 100%;
    }
    .image-header .back{
        position: absolute;
        top:5px;
        left: 0;
        color: #fff;
    }
    .image-header .back .icon-arrow_lift{
        display: block;
        padding: 10px;
        font-size: 20px;
    }
    .food .content{
        position: relative;
        padding: 18px;

    }
    .food .content .title{
        line-height: 14px;
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 700;
        color: rgb(7,17,27);
    }
    .food .content .detail{
        margin-bottom: 18px;
        line-height: 10px;
        height: 10px;
        font-size: 0;
    }
    .food .content .detail .sell-count,.food .content .detail .rating{
        font-size: 10px;
        color: rgb(147, 153, 159)
    }
    .food .content .detail .sell-count{
        margin-right: 12px;
    }
    .food .content .detail .price{
        font-weight: 700;
        line-height: 24px;
    }
    .food .content .price .new{
        margin-right: 8px;
        font-size: 16px;
        color: rgb(240, 20, 20);
    }
    .food .content .price .old{
        text-decoration: line-through;
        font-size: 10px;
    }
    .food .cartcontrol-wrapper{
        position: absolute;
        right: 12px;
        bottom: 12px;
    }
    .food .buy{
        position: absolute;
        right: 18px;
        bottom: 18px;
        z-index: 10;
        height: 24px;
        line-height: 24px;
        padding: 0 12px;
        box-sizing: border-box;
        font-size: 11px;
        border-radius: 12px;
        color: #fff;
        background: rgb(0, 160, 220);
        box-shadow: 0 0 2px 0 rgba(0, 0, 0, .5);
    }
    .food .buy.fade-transition{
        transition: all 0.2s;
        opacity: 1;
    }
    .food .buy.fade-enter,.food .buy.fade-leave{
        opacity: 0;
    }
    .food-content .info{
        padding: 18px;
    }
    .food-content .info .title{
        line-height: 14px;
        margin-bottom: 6px;
        font-size: 14px;
        color: rgb(7,17,27);
    }
    .food-content .info .text{
        color: rgb(20, 50, 100);
        line-height: 24px;
        padding:0 8px;
        font-size: 12px;
    }
    .rating{padding-top: 18px;}
    .rating .title{
        line-height: 14px;
        margin-left: 18px;
        font-size: 14px;
        color: rgb(7,17,27);
    }
    .rating-wrapper{padding: 0 18px;}
    .rating-wrapper .rating-item{
        position: relative;
        padding: 16px 0;
    }
    .rating-wrapper .rating-item .user{
        position: absolute;
        right: 0;
        top:16px;
        font-size: 0;
        line-height: 12px;
    }
    .rating-item .user .name{
        font-size: 10px;
        color: rgb(147, 153, 159);
        display: inline-block;
        vertical-align: top;
        margin-right: 6px;
    }
    .rating-item .user .avatar{
        border-radius: 50%;
    }
    .rating-item .time{
        margin-bottom: 6px;
        line-height: 12px;
        font-size: 10px;
        color:rgb(147, 153, 159);
    }
    .rating-item .text{
        line-height: 16px;
        font-size: 12px;
        color:rgb(7,17,27);
    }
    .rating-item .text .icon-thumb_up,.rating-item .text .icon-thumb_down{
        font-size: 12px;
        line-height: 16px;
        margin-right:4px;
    }
    .rating-item .text .icon-thumb_up{
        color: rgb(0, 160, 220);
    }
    .rating-item .text .icon-thumb_down{
        color:rgb(147, 153, 159);
    }
    .no-rating{
        padding: 16px 0;
        font-size: 12px;
        color: rgb(147, 153, 159);
    }
</style>