<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <scroll class="wrapper"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll">
      <!--父组件向子组件通信要用驼峰，子组件接收属性：topImages 在父组件要用驼峰：top-images-->
      <!--子组件向父组件通信不用驼峰-->
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommend" :goods="recommends"/>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
    <detail-bottom-bar @addToCart="addToCart"/>
  </div>
</template>

<script>
  import DetailNavBar from "./childComps/DetailNavBar";
  import DetailSwiper from "./childComps/DetailSwiper";
  import DetailBaseInfo from "./childComps/DetailBaseInfo";
  import DetailShopInfo from "./childComps/DetailShopInfo";
  import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
  import DetailParamInfo from "./childComps/DetailParamInfo";
  import DetailCommentInfo from "./childComps/DetailCommentInfo";
  import GoodsList from "components/content/goods/GoodsList";
  import DetailBottomBar from "./childComps/DetailBottomBar";

  import Scroll from "components/common/scroll/Scroll";

  import {getDetail, Goods, Shop, GoodsParam, getRecommend} from "network/detail";
  import {itemListenerMixin, backTopMixin} from "common/mixin"
  import {debounced} from "../../common/utils";

  import {mapActions} from 'vuex'

  export default {
    name: "Detail",
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      GoodsList,
      DetailBottomBar,
      Scroll,
    },
    mixins: [
      itemListenerMixin,
      backTopMixin
    ],
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        getThemeTopY: null,
        currentIndex: 0,
        // message: '',
        // show: false
      }
    },
    created() {
      // 1.保存传入的iid
      this.iid = this.$route.params.iid

      // 2.根据iid请求详情数据
      getDetail(this.iid).then(res => {

        const data = res.result;
        // console.log(res)

        // 1.获取顶部的图片轮播数据
        this.topImages = data.itemInfo.topImages

        // 2.创建商品信息的对象
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

        // 3.创建店铺信息的对象
        this.shop = new Shop(data.shopInfo)

        // 4.保存商品的详情数据
        this.detailInfo = data.detailInfo

        // 5.获取参数的信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

        // 6.获取评论的信息
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0]
        }

        //给getThemeTopY赋值
        this.getThemeTopY = debounced(() => {
          this.themeTopYs = []
          this.themeTopYs.push(0);
          this.themeTopYs.push(this.$refs.params.$el.offsetTop);
          this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
          this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
          // console.log(this.themeTopYs)
        }, 100)
        // this.$nextTick(() => {
          // 根据最新的数据，对应的DOM是已经被渲染出来的
          // 但是图片依然是没有加载完（目前获取的offsetTop不包含其中的图片）
          // offsetTop值不对的时候，都是因为图片的问题
          // this.themeTopYs = []
          // this.themeTopYs.push(0);
          // this.themeTopYs.push(this.$refs.params.$el.offsetTop);
          // this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
          // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
          // console.log(this.themeTopYs)
        // })
      })

      // 3.请求推荐数据
      getRecommend().then(res => {
        // console.log(res);
        this.recommends = res.data.list
      })
    },
    methods: {
      ...mapActions(['addCart']),

      // 监听图片加载完成重新刷新scroll，解决滚动卡住的bug(scroll-height)

      // 1.利用if判断的处理方式
      // imageLoad() {
      //   this.$refs.scroll.refresh()
      // }

      // 2.利用防抖函数的处理方式
      imageLoad() {
        this.$refs.scroll.refresh()
        this.getThemeTopY()
      },

      titleClick(index) {
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 300)
      },

      contentScroll(position) {
        // 1.获取y值
        const positionY = -position.y

        // 2.positionY和主题中值进行对比
        // [0, 7938, 9120, 9452]
        // positionY 在 0 和 7938 之间，index = 0
        // positionY 在 7938 和 9120 之间，index = 1
        // positionY 在 9120 和 9452 之间，index = 2
        // positionY 大于等于9452，index = 3
        let length = this.themeTopYs.length
        for (let i =0; i < length; i++) {
          if (this.currentIndex != i &&
            ((i < length -1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])
              || ( i === length - 1 && positionY >= this.themeTopYs[i])))
          {
            this.currentIndex = i;
            this.$refs.nav.currentIndex = this.currentIndex
          }
        }

        // 2.判断BackTop是否显示
        this.listernShowBackTop(position)
      },

      addToCart() {
        // 1.获取购物车需要展示的信息
        const product = {}
        product.image = this.topImages[0];
        product.title = this.goods.title;
        product.desc = this.goods.desc;
        product.price = this.goods.realPrice;
        product.iid = this.iid;

        // 2.将商品添加到购物车(Promise, mapActions)
        // this.$store.cartList.push(product)
        // this.$store.commit('addCart', product)
        this.addCart(product).then(res => {
          this.$toast.show(res, 1500)
        })
        // this.$store.dispatch('addCart', product).then(res => {
        //   console.log(res);
        // })
      }
    },
    mounted() {

    },
    updated() {
      // //不可行
      // this.themeTopYs = []
      // this.themeTopYs.push(0);
      // this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      // this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      // console.log(this.themeTopYs)
    },
    destroyed() {
      this.$bus.$off('itemImageLoad', this.itemImgListener )
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
