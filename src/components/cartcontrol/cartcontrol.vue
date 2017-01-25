<template>
    <div class="cartcontrol">
        <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart($event)" transition="move">
            <span class="inner icon-remove_circle_outline"></span>
        </div>
        <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
        <div class="cart-add icon-add_circle" @click.stop.prevent="addCart($event)"></div>
    </div>
</template>
<script>
import Vue from 'vue';
export default {
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      addCart(event) {
        if (!event._constructed) {//处理better-scroll在pc端重复点击
          return;
        }
        if (!this.food.count) {
          Vue.set(this.food,'count',1);
        } else {
          this.food.count++;
        }
        this.$dispatch('cart.add', event.target);//向父组件广播点击事件
      },
      decreaseCart(event) {
        if (!event._constructed) {
          return;
        }
        if (this.food.count) {
          this.food.count--;
        }
      }
    }
  };
</script>
<style lang="">
    .cartcontrol{
        font-size: 0;
    }
    .cart-decrease{
       display: inline-block;
        padding: 6px;
        
    }
    .move-transition{
        transition: all 0.4s linear;
        opacity: 1;
        transform: translate3d(0, 0, 0);
    }
    .move-enter,.move-leave{
        opacity: 0;
        transform: translate3d(24px, 0, 0);
    }
    .move-enter.inner,.move-leave.inner{
        transform: rotate(180deg);
    }
    .cart-decrease .inner{
        display: inline-block;
        line-height: 24px;
        font-size: 24px;
        color: rgb(0, 160, 220);
        transition: all 0.4s linear;
        transform: rotate(0);
    }
    .cart-count{
        display: inline-block;
        font-size: 10px;
        width: 12px;
        padding-top: 6px;
        line-height: 24px;
        text-align: center;
        color: rgb(147,153,159);
        vertical-align: top;
    }
    .cart-add{
      display: inline-block;
      padding: 6px;
      line-height: 24px;
      font-size: 24px;
      color: rgb(0, 160, 220);
    }
</style>