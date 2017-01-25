<template>
    <div class="header">
        <div class="content-wrapper">
            <div class="avatar">
                <img :src="seller.avatar" alt="" width="64" height="64">
            </div>
            <div class="content">
                <div class="title">
                    <span class="brand"></span>
                    <span class="name">{{seller.name}}</span>
                </div>
                <div class="description">
                    {{seller.description}}/{{seller.deliveryTime}}分钟送达
                </div>
                <div v-if="seller.supports" class="support">
                    <span class="icon" :class="classMap[seller.supports[0].type]"></span>
                    <span class="text">{{seller.supports[0].description}}</span>
                </div>
            </div>
            <div v-if="seller.supports" class="support-count" @click="showDetail">
                <span class="count">{{seller.supports.length}}个</span>
                <i class="icon-keyboard_arrow_right"></i>
            </div>
        </div>
        <div class="bulletin-wrapper" @click="showDetail">
            <span class="bulletin-title"></span>
            <span class="bulletin-text">{{seller.bulletin}}</span>
            <i class="icon-keyboard_arrow_right"></i>
        </div>
        <div class="background">
            <img :src="seller.avatar" height="100%" width="100%">
        </div>
        <div v-show="detailShow" class="detail" transition="fade">
            <div class="detail-wrapper clearfix">
                <div class="detail-main">
                    <h1 class="name">{{seller.name}}</h1>
                    <div class="star-wrapper">
                        <star :size="48" :score="seller.score"></star>
                    </div>
                    <title :title="'优惠信息'"></title>
                    <ul v-if="seller.supports" class="support">
                        <li class="support-item" v-for="item in seller.supports">
                            <i class="icon" :class="classMap[seller.supports[$index].type]"></i>
                            <span class="text">{{seller.supports[$index].description}}</span>
                        </li>
                    </ul>
                    <title :title="'商家公告'"></title>
                    <div class="detail-mian-bulletin">
                        <section class="detail-mian-bulletin-text">{{seller.bulletin}}</section>
                    </div>
                </div>
            </div>
            <div class="detail-close" @click="closeDetail">
                <i class="icon-close"></i>
            </div>
        </div>
    </div>
</template>
<script>
import star from '../star/star';

    export default{
        props:{
            seller:{
                type:Object
            }
        },
        data () {
            return {
               detailShow:false       
            }
        },
        methods: {
            showDetail() {
                this.detailShow=true;
            },
            closeDetail() {
                this.detailShow=false;
            }
        },
        created () {
            this.classMap=['decrease','discount','special','invoice','guarantee'];
        },
        components:{
            star:star,
            title:{
                props:['title'],
                template:`<div class="title">
                            <div class="line"></div>
                            <div class="text">{{title}}</div>
                            <div class="line"></div>
                        </div>`
            }
        }
    };
</script>
<style lang="">

    .header{
        color:#fff; 
        position: relative;
        background: rgba(7, 17, 27, .4);
        overflow: hidden;
    }
    .content-wrapper{
        padding:24px 12px 18px 24px;
        font-size: 0;
        position: relative;
    }
    .content-wrapper .avatar{
        display: inline-block;
        vertical-align: top;
    }
    .content-wrapper .avatar img{
        border-radius: 2px;
    }
    .content-wrapper .content{
        display: inline-block;
        margin-left: 16px;
    }
    .content-wrapper .content .title{
        margin: 2px 0 8px 0;
    }
    .brand{
        display: inline-block;
        vertical-align: top;
        width: 30px;
        height: 18px;
        background-image: url('brand@2x.png');
        background-size: 30px 18px;
        background-repeat: no-repeat;
    }
    @media (-webkit-min-device-pixel-ratio:3),(min-device-pixel-ratio:3){
        .brand{
            background-image: url('brand@3x.png');
        }
    }
    .content-wrapper .content .title .name{
        margin-left: 6px;
        font-size:16px; 
        line-height: 18px;
    }
    .description{
        margin-bottom: 10px;
        line-height: 12px;
        font-size: 12px;
    }
    .support .icon{
        display: inline-block;
        width: 12px;
        height: 12px;
        margin-right: 4px;
        background-size: 11px 11px;
        background-repeat: no-repeat;
        vertical-align: top;
    }
    .support .text{
        line-height: 12px;
        font-size: 11px;
    }
    .support-count{
        position: absolute;
        right: 12px;
        bottom: 14px;
        padding: 0 8px;
        height: 24px;
        line-height: 24px;
        border-radius: 14px;
        background: rgba(0, 0, 0,.2);
        text-align: center;
        padding: 0 6px;
    }
    .support-count .count{
        margin-left: 2px;
        font-size: 12px;
    }
    .support-count .icon-keyboard_arrow_right{
        margin-left: 2px;
        font-size: 10px;
        vertical-align: top;
    }
    .bulletin-wrapper{
        height: 27px;
        line-height: 27px;
        padding: 0 18px 0 10px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        position: relative;
        background: rgba(7, 17, 27, .7)
    }
    .bulletin-title{
        display: inline-block;
        width: 22px;
        height: 12px;
        background-image: url('bulletin@2x.png');
        background-size: 22px 12px;
        background-repeat: no-repeat;
        vertical-align: top;
        margin-top:7px;
    }
    .bulletin-text{
        margin: 0 4px;
        font-size: 10px;
        vertical-align: top;
    }
    .bulletin-wrapper .icon-keyboard_arrow_right{
        position: absolute;
        font-size: 10px;
        right: 12px;
        top: 8px;
    }
    .decrease{
        background-image: url('decrease_1@2x.png');
    }
    .discount{
        background-image: url('discount_1@2x.png');
    }
    .special{
        background-image: url('special_1@2x.png');
    }
    .invoice{
        background-image: url('invoice_1@2x.png');
    }
    .guarantee{
        background-image: url('guarantee_1@2x.png');
    }
    .background{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        filter: blur(10px);
    }
    .header .detail{
        position: fixed;
        top: 0;
        left: 0;
        z-index: 100;
        width: 100%;
        height: 100%;
        overflow: auto;
    }
    .detail.fade-transition{
        transition: all 0.5s ease-out;
        opacity: 1;
        background: rgba(7, 17, 27, .8);
    }
    .detail.fade-enter,.detail.fade-leave{
        opacity: 0;
        background: rgba(7, 17, 27, 0);
    }
    .detail-wrapper{
        min-height: 100%;
        width: 100%;
    }
    .detail-main{
        padding-top:64px; 
        padding-bottom: 64px;
    }
    .detail-main .name{
        font-size: 16px;
        line-height: 16px;
        text-align: center;
        font-weight: 700;
    }
    .detail-main .star-wrapper{
        margin-top: 18px;
        padding: 2px 0;
        text-align: center;
    }
    .detail-main .title{
        display: flex;
        width: 80%;
        margin:28px auto 24px auto;
    }
    .detail-main .title .line{
        flex: 1;
        position: relative;
        top: -6px;
        
        
        
        bottom: 1px solid rgba(255, 255, 255,.2);
        
    }
    .detail-main .title .text{
        padding: 0 12px;
        font-size: 14px;
        font-weight: 700;
    }
    .detail-main .support,.detail-mian-bulletin{
        width:80%;
        margin: 0 auto;
    }
    .detail-main .support .support-item{
        padding: 0 12px;
        margin-bottom:12px;
        font-size: 0; 
    }
    .detail-main .support .support-item:last-child{
        margin-bottom: 0;
    }
    .support-item .icon{
        width: 16px;
        height: 16px;
        vertical-align: top;
        margin-right:6px;
        background-size: 16px 16px;
        background-repeat: no-repeat;
    }
    .detail-main .support .support-item .text{
        font-size: 12px;
        line-height: 16px;
        padding-left:12px; 
        margin-left: 12px;
    }
    .detail-main .support .support-item .icon.decrease{
        background-image: url('decrease_2@2x.png');
    }
    .detail-main .support .support-item .icon.discount{
        background-image: url('discount_2@2x.png');
    }
    .detail-main .support .support-item .icon.special{
        background-image: url('special_2@2x.png');
    }
    .detail-main .support .support-item .icon.invoice{
        background-image: url('invoice_2@2x.png');
    }
    .detail-main .support .support-item .icon.guarantee{
        background-image: url('guarantee_2@2x.png');
    }
    .detail-mian-bulletin-text{
        margin:12px 0;
        line-height: 24px;
        padding:0 12px; 
        font-size: 12px;
        text-indent: 24px;
    }
    .detail-close{
        position: relative;
        width: 32px;
        height: 32px; 
        margin: -64px auto 0 auto;
        clear: both;
        font-size: 32px;
    }
    
</style>