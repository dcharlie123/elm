<template>
    <div class="seller" v-el:seller>
        <div class="seller-content">
            <div class="overview">
                <h1 class="title">{{seller.name}}</h1>
                <div class="desc border-1px">
                    <star :size="36" :score="seller.score"></star>
                    <span class="text">({{seller.ratingCount}})</span>
                    <span class="text">月售{{seller.sellCount}}单</span>
                </div>
                <ul class="remark">
                    <li class="block">
                        <h2>起送价</h2>
                        <div class="content">
                            <span class="stress">{{seller.minPrice}}</span>元
                        </div>
                    </li>
                    <li class="block">
                        <h2>商家配送</h2>
                        <div class="content">
                            <span class="stress">{{seller.deliveryPrice}}</span>元
                        </div>
                    </li>
                    <li class="block">
                        <h2>平均配送时间</h2>
                        <div class="content">
                            <span class="stress">{{seller.deliveryTime}}</span>分钟
                        </div>
                    </li>
                </ul>
                <div class="favorite" @click="favoriteF($event)">
                    <span class="icon-favorite" :class="{'active':this.favorite}"></span>
                    <span class="text">{{favoriteText}}</span>
                </div>
            </div>
            <split></split>
            <div class="bulletin">
                <h1 class="title">公告与活动</h1>
                <div class="content-wrapper border-1px">
                    <p class="content">{{seller.bulletin}}</p>
                </div>
                <ul v-if="seller.supports" class="support">
                    <li class="support-item border-1px" v-for="item in seller.supports">
                        <i class="icon" :class="classMap[seller.supports[$index].type]"></i>
                        <span class="text">{{seller.supports[$index].description}}</span>
                    </li>
                </ul>
            </div>
            <split></split>
            <div class="pics">
                <h1 class="title">商家实景</h1>
                <div class="pic-wrapper" v-el:pic-wrapper>
                    <ul class="pic-list" v-el:pic-list>
                        <li class="pic-item" v-for="pic in seller.pics">
                            <img :src="pic" alt="" width="120" height="90">
                        </li>
                    </ul>
                </div>
            </div>
            <split></split>
            <div class="info">
                <h1 class="title border-1px">商家信息</h1>
                <ul>
                    <li class="info-item border-1px" v-for="info in seller.infos">{{info}}</li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import BScroll from 'better-scroll';
import star from '../star/star';
import split from '../split//split';
import {saveToLocal,loadFromLocal} from '../../common/js/store'
    export default{
        props: {
            seller: {
                type: Object
            }
        },
        data () {
            return {
                favorite:(()=>{
                    return loadFromLocal(this.seller.id,'favorite',false);
                })()    
            }
        },
        computed:{
            favoriteText() {
                return this.favorite?'已收藏':'收藏';
            }
        },
        created () {
            this.classMap=['decrease','discount','special','invoice','guarantee'];
        },
        watch:{
            'seller'() {
                this._initScroll();
                this._initPics();
            }
        },
        methods:{
            favoriteF(event) {
                if(!event._constructed){
                    return;
                }
                this.favorite=!this.favorite;
                saveToLocal(this.seller.id,'favorite',this.favorite);
            },
            _initScroll() {
                if(!this.scroll){
                    this.scroll=new BScroll(this.$els.seller,{click:true});
                }else{
                    this.scroll.refresh();
                }
            },
            _initPics() {
                if(this.seller.pics){
                    let picWidth=120;
                    let margin=6;
                    let width=(picWidth+margin)*this.seller.pics.length-margin;
                    this.$els.picList.style.width=width+'px';
                    this.$nextTick(()=>{
                        if(!this.picScroll){
                            this.picScroll=new BScroll(this.$els.picWrapper,{
                                scrollX:true,
                                eventPassthrough:'vertical'
                            })
                        }else{
                            this.picScroll.refresh();
                        }
                        
                    });
                }
            }
        },
        ready() {
            this._initScroll();
            this._initPics()
        },
        components:{
            star,
            split
        }
    };
</script>
<style lang="">
    .seller{
        position:absolute;
        top: 174px;
        bottom: 0;
        left:0;
        width: 100%;
        overflow: hidden;
    }
    .seller-content .overview{
        padding: 18px;
    }
    .seller-content .overview .title{
        margin-bottom: 8px;
        line-height: 14px;
        color: rgb(7, 17, 27);
        font-size: 14px;
    }
    .seller-content .overview .desc{
        padding-bottom: 18px;
        font-size: 0;
    }
    .seller-content .overview .desc .star{
        display: inline-block;
        vertical-align: top;
        margin-right: 8px;
    }
    .seller-content .overview .desc .text{
        display: inline-block;
        vertical-align: top;
        line-height: 18px;
        margin-right: 12px;
        font-size: 10px;
        color: rgb(77, 85, 93);
    }
    .seller-content .remark{
        display: flex;
        padding-top: 18px;
    }
    .favorite{
        position: absolute;
        right: 11px;
        top:18px;
        width: 43px;
        text-align: center;
    }
    .favorite .icon-favorite{
        display: block;
        margin-bottom: 4px;
        color:#d4d6d9;
        line-height: 24px;
        font-size: 24px;
    }
    .favorite .icon-favorite.active{
        color:rgb(240, 20, 20);
    }
    .favorite .text{
        font-size: 10px;
        line-height:10px;
        color: rgb(77, 85, 93); 
    }
    .seller-content .remark .block{
        flex: 1;
        text-align: center;
        border-right: 1px solid rgba(7, 17, 27,.1);
    }
    .seller-content .remark .block:last-child{
        border-right: 0;
    }
    .seller-content .remark .block h2{
        margin-bottom: 4px;
        line-height: 10px;
        font-size: 10px;
        color: rgb(147, 153, 159);
    }
    .seller-content .remark .block .content{
        line-height: 24px;
        font-size: 10px;
        color: rgb(7, 17, 27);
    }
    .remark .block .content .stress{
        font-size: 24px;
    }
    
    .bulletin{
        padding:18px 18px 0 18px;
    }
    .bulletin .title{
        margin-bottom: 8px;
        line-height: 14px;
        color: rgb(7, 17, 27);
        font-size: 14px;
    }
    .bulletin .content-wrapper{
        padding: 0 12px 16px 12px;
    }
    .bulletin .content-wrapper .content{
        line-height: 24px;
        font-size: 12px;
        color: rgb(240, 20, 20);
    }
    .bulletin .support .support-item{
        padding: 16px 12px;
        font-size: 0;
    }
    .support-item.border-1px:last-child::after{
        border: none;
    }
    .bulletin .support .support-item .text{
        font-size: 12px;
        line-height: 16px;
        color: rgb(7, 17, 27);
    }
    .pics{
        padding: 18px;
    }
    .pics .title{
        margin-bottom: 12px;
        line-height: 14px;
        color: rgb(7, 17, 27);
        font-size: 14px;
    }
    .pics .pic-wrapper{
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
    }
    .pics .pic-wrapper .pic-list{
        font-size: 0;
    }
    .pic-wrapper .pic-list .pic-item{
        display: inline-block;
        margin-right: 6px;
        width: 120px;
        height: 90px;
    }
    .pic-wrapper .pic-list .pic-item:last-child{
        margin-right: 0;
    }
    .info{
        padding: 18px 18px 0 18px;
         color: rgb(7, 17, 27);
    }
    .info .title{
        padding-bottom: 12px;
        font-size: 14px;
        line-height: 14px;
    }
    .info .info-item{
        padding: 16px 12px;
        line-height: 16px;
        font-size: 12px;
    }
    .info .info-item.border-1px:last-child::after{
        border: 0;
    }
</style>