<template>
    <div class="goods">
        <div class="menu-wrapper" v-el:menu-wrapper>
            <ul>
                <li v-for="item in goods" class="menu-item" :class="{'current':currentIndex===$index}" @click="selectMenu($index,$event)">
                    <span class="text border-1px">
                        <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
                    </span>
                </li>
            </ul>
        </div>
        <div class="food-wrapper" v-el:food-wrapper>
            <ul>
                <li v-for="item in goods" class="food-list food-list-hook">
                    <h1 class="title">{{item.name}}</h1>
                    <ul>
                        <li @click="selectFood(food,$event)" v-for="food in item.foods" class="food-items border-1px">
                            <div class="icon"><img width="57" height="57" :src="food.icon" alt=""></div>
                            <div class="content">
                                <h2 class="name">{{food.name}}</h2>
                                <p class="desc">{{food.description}}</p>
                                <div class="extra">
                                    <span class="count">月售{{food.sellCount}}份</span>
                                    <span>好评率{{food.rating}}%</span>
                                </div>
                                <div class="price">
                                    <span class="new">¥{{food.price}}</span><span class="old" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
                                </div>
                                <div class="cartcontrol-wrapper">
                                    <cartcontrol :food="food"></cartcontrol>
                                </div>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <shopcar v-ref:shopcar :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcar>
    </div>
    <food :food="selectedFood" v-ref:food></food>
</template>
<script>
import shopcar from "../shopcar/shopcar";
import BScroll from 'better-scroll';
import cartcontrol from '../cartcontrol/cartcontrol';
import food from '../food/food';
    const ERR_OK=0;
    export default{
        props:{
            seller:{
                type:Object
            }
        },
        data() {
            return {
                goods:[],
                listHeight:[],
                scrollY:0,
                selectedFood:{}
            };
        },
        computed: {
            currentIndex(){
                for(let i =0;i<this.listHeight.length;i++){
                    let height1=this.listHeight[i];
                    let height2=this.listHeight[i+1];
                    if(!height2||(this.scrollY>=height1&&this.scrollY<height2)){
                        return i;
                    }
                }
                return 0;
            },
            selectFoods() {
                let foods=[];
                this.goods.forEach((good) => {
                    good.foods.forEach((food) => {
                        if(food.count){
                            foods.push(food);
                        }
                    });
                });
                return foods;
            }
        },
        created () {//获取数据
            this.classMap=['decrease','discount','special','invoice','guarantee'];
            this.$http.get('/api/goods').then((response) => {
                response=response.body
                if(response.errno === ERR_OK){
                    this.goods=response.data;
                    this.$nextTick(() => {
                        this._initScroll();
                        this._calculateHeight();
                    })
                }
            });
        },
        methods: {
            selectMenu(index,event) {
                if(!event._constructed){
                    return;
                }
                let foodList = this.$els.foodWrapper.getElementsByClassName('food-list-hook');
                let el=foodList[index];
                this.foodScroll.scrollToElement(el,300);
            },
            _drop(target) {
                this.$refs.shopcar.drop(target);//运行子组件shopcar的drop（）方法，并传入cartcontrol传过来的target事件
            },
            _initScroll(){//应用better-scroll
                this.meunScroll=new BScroll(this.$els.menuWrapper,{click:true});
                this.foodScroll=new BScroll(this.$els.foodWrapper,{
                    click:true,
                    probeType:3
                });
                this.foodScroll.on('scroll', (pos)=>{
                    this.scrollY = Math.abs(Math.round(pos.y));
                });
            },
            _calculateHeight() {
                let foodList = this.$els.foodWrapper.getElementsByClassName('food-list-hook');
                let height = 0;
                this.listHeight.push(height);
                for (let i = 0; i < foodList.length; i++) {
                    let item = foodList[i];
                    height += item.clientHeight;
                    this.listHeight.push(height);
                }
            },
            selectFood(food,event) {
                if(!event._constructed){
                    return;
                }
                this.selectedFood = food;
                this.$refs.food.show();
            }
        },
        components: {
            shopcar,
            cartcontrol,
            food
        },
        events:{//接受子组件cartcontrol的事件
            'cart.add'(target){
                this._drop(target)
            }
        }
    };
</script>
<style lang="">
    .goods{
        display: flex;
        position: absolute;
        top: 174px;
        bottom: 46px;
        width: 100%;
        overflow: hidden;
    }
    .goods .menu-wrapper{
        flex: 0 0 80px;
        width: 80px;
        background:#f3f5f7;
    }
    .goods .menu-wrapper .menu-item{
        display: table;
        height: 54px;
        width: 56px;
        line-height: 14px;
        padding: 0 12px;
    }
    .goods .menu-wrapper .menu-item.current{
        position: relative;
        margin-top: -1px;
        z-index: 10;
        background: #fff;
    }
    .goods .menu-wrapper .menu-item.current .text{
        font-weight: 700;
    }
    .goods .menu-wrapper .menu-item.current .text.border-1px::after{
        display: none;
    }
    .menu-item .icon{
        display: inline-block;
        vertical-align: top;
        width: 12px;
        height: 12px;
        margin-right: 2px;
        background-size: 12px 12px;
        background-repeat: no-repeat;
    }
    .menu-item .text{
        font-size: 12px;
        display: table-cell;
        width: 56px;
        vertical-align: middle;
    }
    .goods .food-wrapper{
        flex: 1;
    }
     .decrease{
        background-image: url('decrease_3@2x.png');
    }
    .discount{
        background-image: url('discount_3@2x.png');
    }
    .special{
        background-image: url('special_3@2x.png');
    }
    .invoice{
        background-image: url('invoice_3@2x.png');
    }
    .guarantee{
        background-image: url('guarantee_3@2x.png');
    }


    .food-wrapper .food-list .title{
        padding-left: 14px;
        height:26px;
        line-height: 26px;
        border-left:2px solid #d9dde1;
        font-size: 12px;
        color:rgb(147, 153, 159);
        background: #f3f5f7;
    }
    .food-wrapper .food-list .food-items{
        display: flex;
        margin: 18px;
        padding-bottom: 18px;
    }
    .food-wrapper .food-list .food-items:last-child{
        margin-bottom: 0;
    }
    .food-wrapper .food-list .food-items.border-1px:last-child::after{
        display: none;
    }
    .food-items .icon{
        flex: 0 0 57px;
        margin-right: 10px;
    }
    .food-items .content{
        flex: 1;
        color: rgb(147, 153, 159);
    }
    .food-items .content .name{
        margin: 2px 0 8px 0;
        height: 14px;
        line-height: 14px;
        font-size: 14px;
        color: rgb(7, 17, 27);
    }
    .food-items .content .desc,.food-items .content .extra{
        line-height: 10px;
        font-size: 10px;
    }
    .food-items .content .desc{
        margin-bottom: 8px;
        line-height: 12px;
    }
    .food-items .content .count{
        margin-right: 12px;
    }
    .food-items .content .price{
        font-weight: 700;
        line-height: 24px;
    }
    .food-items .content .cartcontrol-wrapper{
        position: absolute;
        right:-10px;
        bottom: 6px;
    }
    .food-items .content .price .new{
        margin-right: 8px;
        font-size: 16px;
        color: rgb(240, 20, 20);
    }
    .food-items .content .price .old{
        text-decoration: line-through;
        font-size: 10px;
    }
</style>