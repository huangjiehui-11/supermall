<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav"/>
    <scroll class="wrapper">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
    </scroll>
  </div>
</template>

<script>
  import DetailNavBar from "./childComps/DetailNavBar";
  import DetailSwiper from "./childComps/DetailSwiper";
  import DetailBaseInfo from "./childComps/DetailBaseInfo";
  import DetailShopInfo from "./childComps/DetailShopInfo";

  import Scroll from "components/common/scroll/Scroll";

  import { getDetail, Goods, Shop } from "network/detail";

  export default {
    name: "Detail",
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      Scroll
    },
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {}
      }
    },
    created() {
      // 1.保存传入的iid
      this.iid = this.$route.params.iid

      // 2.根据iid请求详情数据
      getDetail(this.iid).then(res => {
        // 1.获取顶部的图片轮播数据
        // console.log(res)
        const data = res.result;
        this.topImages = data.itemInfo.topImages

        // 2.创建商品信息的对象
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

        // 3.创建店铺信息的对象
        this.shop = new Shop(data.shopInfo)
      })
    }
  }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #ffffff;
    /*因为scroll的最外层确定滚动区域的区域的高度只能是屏幕视图窗口高度，所以要多设置这行代码*/
    height: 100vh;
  }

  .wrapper {
    position: absolute;
    top: 44px;
    left: 0;
    right: 0;
    bottom: 0;
    /*另一种方法：*/
    /*height: calc(100% - 44px);*/
  }

  .detail-nav {
    /*尽量不要使用绝对定位和弹性定位，微调只需要用相对定位*/
    position: relative;
    z-index: 9;
    background-color: #ffffff;
  }
</style>
