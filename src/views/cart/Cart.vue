<template>
  <div id="cart">
    <!--导航-->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{length}})</div>
    </nav-bar>
    <scroll class="wrapper" ref="scroll">
    <!--商品的列表-->
      <cart-list/>
    </scroll>
    <!--底部的汇总-->
  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  import CartList from "./childComps/CartList";

  //mapGetters辅助函数仅仅是将store中的getter映射到局部计算属性
  import { mapGetters } from 'vuex';

  import Scroll from "components/common/scroll/Scroll";

  export default {
    name: "Cart",
    components: {
      NavBar,
      CartList,
      Scroll
    },
    computed: {
      //两种语法
      // 1.数组语法
      // ...mapGetters(['cartLength', 'cartList'])
      // 2.对象语法
      ...mapGetters({
        length: 'cartLength'
      })
    },
    activated() {
      this.$refs.scroll.refresh()
    }
  }
</script>

<style scoped>
  #cart {
    /*position: relative;*/
    height: 100vh;
  }

  .wrapper {
    height: calc(100% - 44px - 49px);
    overflow: hidden;
  }

  .nav-bar {
    background-color: var(--color-tint);
    font-weight: 700;
    color: #fff;
  }

</style>

