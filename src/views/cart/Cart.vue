<template>
  <div id="cart">
    <nav-bar class="nav-bar"><div slot="center">购物车({{length}})</div></nav-bar>
  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'

  //mapGetters辅助函数仅仅是将store中的getter映射到局部计算属性
  import { mapGetters } from 'vuex'

  export default {
    name: "Cart",
    components: {
      NavBar,
    },
    computed: {
      //两种语法
      // 1.数组语法
      // ...mapGetters(['cartLength', 'cartList'])
      // 2.对象语法
      ...mapGetters({
        length: 'cartLength',
        list: 'cartList'
      })
    }
  }
</script>

<style scoped>
  #cart {
    /*position: relative;*/
    height: 100vh;
  }

  .nav-bar {
    background-color: var(--color-tint);
    font-weight: 700;
    color: #fff;
  }

</style>

