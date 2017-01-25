<template>
    <div class="ratingselect">
        <div class="rating-type border-1px">
            <span @click="select(2,$event)" class="block positive" :class="{'active':selectType===2}">{{desc.all}}
                <span class="count">{{ratings.length}}</span>
            </span>
            <span @click="select(0,$event)" class="block positive" :class="{'active':selectType===0}">{{desc.positive}}
                <span class="count">{{positives.length}}</span>
            </span>
            <span @click="select(1,$event)" class="block negative" :class="{'active':selectType===1}">{{desc.negative}}
                <span class="count">{{negatives.length}}</span>   
            </span>
        </div>
        <div class="switch" :class="{'on':onlyContent}" @click='toggleContent($event)'>
            <span class="icon-check_circle"></span>
            <span class="text">只看有内容的评价</span>
        </div>
    </div>
</template>
<script>
const POSITIVE=0;
const NEGATIVE=1;
const ALL=2;
    export default{
        props:{
            ratings:{
                type:Array,
                default() {
                    return [];
                }
            },
            selectType:{
                type:Number,
                default:ALL
            },
            onlyContent:{
                type:Boolean,
                default:false
            },
            desc:{
                type:Object,
                default() {
                    return {
                        all:'全部',
                        positive:'满意',
                        negative:'不满意'
                    };
                }
            }
        },
        computed:{
            positives() {
                return this.ratings.filter((rating)=>{
                    return rating.rateType === POSITIVE;
                })
            },
            negatives() {
                return this.ratings.filter((rating)=>{
                    return rating.rateType === NEGATIVE;
                })
            }
        },
        methods:{
            select(type,event) {
                if(!event._constructed){
                    return;
                }
                this.selectType=type;
                this.$dispatch('ratingtype.select',type);
            },
            toggleContent(event) {
                if(!event._constructed){
                    return;
                }
                this.onlyContent=!this.onlyContent;
                this.$dispatch('content.toggle',this.onlyContent);
            }
        }
    };
</script>
<style lang="">
    .ratingselect .rating-type{
        padding: 18px 0;
        margin:0 18px;
        font-size: 0; 
    }
    .ratingselect .rating-type .block{
        display: inline-block;
        padding:8px 12px;
        font-size: 12px;
        border-radius: 2px;
        margin-right: 8px;
        color: rgb(77, 85, 93);  
    }
    .ratingselect .rating-type .block.active{
        color:#fff;
    }
    .ratingselect .rating-type .block .count{
        font-size: 8px;
        margin-left: 2px;
        
    }
    .ratingselect .rating-type .block.positive{
        background: rgba(0,160,220,.2);
    }
    .ratingselect .rating-type .block.positive.active{
        background: rgb(0,160,220);
    }
    .ratingselect .rating-type .block.negative{
        background: rgba(078,85,93,.2);
    }
    .ratingselect .rating-type .block.negative.active{
        background: rgb(77, 85, 93); 
    }
    /*switch*/
    .ratingselect .switch{
        padding: 12px 18px;
        line-height: 24px;
        border-bottom:1px solid rgba(7, 17, 27, .1);
        color: rgb(147,153,159);
        font-size: 0;
    }
    .ratingselect .switch .icon-check_circle{
        font-size: 24px;
        display: inline-block;
        vertical-align: top;
        margin-right:4px;
    }
    .ratingselect .switch .text{
        font-size: 12px;
        display: inline-block;
        vertical-align: top;    
    }
    .ratingselect .switch.on .icon-check_circle{
        color: #00c850;
    }
</style>