<template>
    <div class="ratings" v-el:ratingsa>
        <div class="ratings-content">
            <div class="overview">
                <div class="overview-left">
                    <h1 class="score">{{seller.score}}</h1>
                    <div class="title">综合评分</div>
                    <div class="rank">高于周边商家{{seller.rankRate}}%</div>
                </div>
                <div class="overview-right">
                    <div class="score-wrapper">
                        <span class="title">服务态度</span>
                        <star :size="36" :score="seller.serviceScore"></star>
                        <div class="score">{{seller.serviceScore}}</div>
                    </div>
                    <div class="score-wrapper">
                        <span class="title">商品评分</span>
                        <star :size="36" :score="seller.foodScore"></star>
                        <div class="score">{{seller.foodScore}}</div>
                    </div>
                    <div class="delivery-wrapper">
                        <span class="title">送达时间</span>
                        <span class="delivery">{{seller.deliveryTime}}分钟</span>
                    </div>
                </div>
            </div>
            <split></split>
            <ratingselect :select-type="selectType" :select-type="selectType" :only-content="onlyContent" :ratings="ratings"></ratingselect>
            <div class="ratings-wrapper">
                <ul>
                    <li v-show="needShow(rating.rateType,rating.text)" v-for='rating in ratings' class="rating-item border-1px">
                        <div class="avatar">
                            <img :src="rating.avatar" width="28" height="28">
                        </div>
                        <div class="content">
                            <h1 class="name">{{rating.username}}</h1>
                            <div class="star-wrapper">
                                <star :size="24" :score="rating.score"></star>
                                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
                            </div>
                            <p class="text">{{rating.text}}</p>
                            <div class="recommend" v-show="rating.recommend&&rating.recommend.length">
                                <span class="icon-thumb_up"></span>
                                <span v-for="item in rating.recommend" class="item">{{item}}</span>
                            </div>
                            <div class="time">
                                {{rating.rateTime | formatDate}}
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import star from '../star/star';
import ratingselect from '../ratingselect/ratingselect';
import split from '../split/split';
import BScroll from 'better-scroll';
import {formatDate} from '../../common/js/time';
const ERR_OK=0;
const POSITIVE=0;
const NEGATIVE=1;
const ALL=2;
    export default{
        props:{
            seller:{
                type:Object
            }
        },
        data() {
            return{
                ratings:[],
                selectType:ALL,
                onlyContent:true
            }
        },
        created() {
            this.$http.get('/api/ratings').then((response)=>{
                response=response.body;
                if(response.errno===ERR_OK){
                    this.ratings=response.data;
                };
                this.$nextTick(()=>{
                    if (!this.scroll) {
                        this.scroll = new BScroll(this.$els.ratingsa, {
                            click: true
                        });
                    } else {
                        this.scroll.refresh();
                    }
                })
            })
        },
        methods:{
            needShow(type,text) {
                if(this.onlyContent&&!text){
                    return false;
                }
                if(this.selectType===ALL){
                    return true;
                }else{
                    return type===this.selectType;
                }
            }
        },
        filters: {
          formatDate(time) {
              let date=new Date(time);
              return formatDate(date,'yyyy-MM-dd hh:mm');
          }  
        },
        components: {
            star,
            ratingselect,
            split
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
    .ratings{
        position:absolute;
        top: 174px;
        bottom: 0;
        left:0;
        width: 100%;
        overflow: hidden;
    }
    .ratings .overview{
        display: flex;
        padding: 18px 0;
    }
    .overview .overview-left{
        flex: 0 0 137px;
        width: 137px;
        border-right: 1px solid rgba(7,17,27,.1);
        text-align: center;
        padding: 6px 0;
    }
    
    .overview-left .score{
        font-size:24px;
        line-height: 28px;
        color:rgb(255, 153, 0);
        margin-bottom: 6px;
    }
    .overview-left .title{
        line-height: 12px;
        font-size: 12px;
        color: rgb(7,17,27);
        margin-bottom: 8px;
    }
    .overview-left .rank{
        line-height: 10px;
        font-size: 10px;
        color: rgb(147, 153, 159);
    }
    .overview .overview-right{
        flex:1;
        padding: 6px 0 6px 24px;
    }
    .overview-right .score-wrapper{
        margin-bottom: 8px;
        font-size: 0;
    }
    .overview-right .score-wrapper .title{
        line-height: 18px;
        display: inline-block;
        vertical-align: top;
        font-size: 12px;
        color: rgb(7,17,27);
    }
    .overview-right .score-wrapper .star{
        display: inline-block;
        vertical-align: top;
        margin: 0 12px;
    }
    .overview-right .score-wrapper .score{
        line-height: 18px;
        display: inline-block;
        vertical-align: top;
        font-size: 12px;
        color: rgb(255,153,0);
    }
    .delivery-wrapper{
        font-size: 0;
    }
    .delivery-wrapper .title{
        display: inline-block;
        vertical-align: top;
        line-height: 18px;
        font-size: 12px;
        color: rgb(7,17,27);
    }
    .delivery-wrapper .delivery{
        font-size: 12px;
        color: rgb(147, 153, 159);
        margin-left: 12px;
        line-height: 18px;
    }
    .ratings-wrapper{
        padding: 0 18px;
    }
    .ratings-wrapper .rating-item{
        display: flex;
        padding: 18px 0;
    }
    .ratings-wrapper .rating-item .avatar{
        flex: 0 0 28px;
        width:28px;
        margin-right: 12px;
    }
    .ratings-wrapper .rating-item .avatar img{
        border-radius: 50%;
    }
    .ratings-wrapper .rating-item .content{
        position: relative;
        flex: 1;
    }
    .rating-item .content .name{
        color: rgb(7,17,27);
        line-height: 12px;
        font-size: 10px;
        margin-bottom: 4px;
    }
    .rating-item .content .star-wrapper{
        margin-bottom: 6px;
        font-size: 0;
    }
    .rating-item .content .star-wrapper .star{
        display: inline-block;
        margin-right: 6px;
        vertical-align: top;
    }
    .rating-item .content .star-wrapper .delivery{
        display: inline-block;
        vertical-align: top;
        line-height: 12px;
        font-size: 10px;
        color: rgb(147, 153, 159);
    }
    .rating-item .content .text{
        line-height: 18px;
        color: rgb(7,17,27);
        font-size: 12px;
        margin-bottom: 8px;
    }
    .rating-item .content .recommend{
        line-height: 16px;
        font-size: 0;
    }
    .recommend .icon-thumb_up,.recommend .item{
        display: inline-block;
        margin: 0 8px 4px 0;
        font-size: 9px;
    }
    .recommend .icon-thumb_up{
        color: rgb(0, 160, 220);
    }
    .recommend .item{
        padding: 0 6px;
        border: 1px solid rgba(7,17,27,.1);
        border-radius: 1px;
        color: rgb(147, 153, 159);
        background: #fff;
    }
    .rating-item .content .time{
       position: absolute;
       top: 0;
       right: 0;
       line-height: 12px;
       font-size: 10px;
       color: rgb(147, 153, 159); 
    }
    @media only screen and (max-width: 321px){
        .overview .overview-left{
            flex:0 0 120px;
            width:120px;
        }
        .overview .overview-right{
            padding:6px 0 6px 6px;
        }
        .overview-right .score-wrapper .star{
            margin:0;
        }

    }
</style>