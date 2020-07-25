<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行', '新款', '精选']"
                 @tabClick="tabClick"
                 ref="tabControl1"
                 class="tab-control"
                 v-show="isTabFixed"/>
    <scroll class="wrapper"
            ref="scroll"
            :probe-type=3
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad" ref="homeswiper"/>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control :titles="['流行', '新款', '精选']"
                   @tabClick="tabClick"
                   ref="tabControl2"/>
      <goods-list :goods="showGoods"/>
    </scroll>

    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
  //子组件
  import HomeSwiper from "./childComps/HomeSwiper";
  import RecommendView from "./childComps/RecommendView";
  import FeatureView from "./childComps/FeatureView";
  //公共组件
  import NavBar from "components/common/navbar/NavBar";
  import TabControl from "components/content/tabControl/TabControl";
  import GoodsList from "components/content/goods/GoodsList";
  import Scroll from "components/common/scroll/Scroll";
  //方法
  import {getHomeMultidata, getHomeGoods} from "network/home";
  import {itemListenerMixin, backTopMixin} from "common/mixin";


  export default {
    name: "home",
    components: {
      HomeSwiper,
      RecommendView,
      FeatureView,
      NavBar,
      TabControl,
      GoodsList,
      Scroll,
    },
    mixins: [
      itemListenerMixin,
      backTopMixin
    ],
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []},
        },
        currentType: 'pop',
        taboffsetTop: 0,
        isTabFixed: false,
        saveY: 0
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    activated() {
      //第三个参数是滚回指定位置的时间，要马上回去，所以设置为0
      //路由处于活跃时滚回到这个位置
      this.$refs.scroll.scrollTo(0, this.saveY, 0)
      //回来时进行一次刷新,解决滚动卡住的bug（scrollHeight）
      this.$refs.scroll.refresh()
    },
    deactivated() {
      // 1.离开路由时记录当前的位置
      this.saveY = this.$refs.scroll.getScrollY()
      //this.saveY = -2019
      //修复保持首页位置的bug，因为轮播图和better-scroll都有用到translate会相互影响，所以离开时停掉轮播图
      this.$refs.homeswiper.$refs.a.stopTimer()

      // 2.取消全局事件的监听
      //$buf.$bus第一个参数是事件，第二个参数必须传入一个函数，告诉取消这个事件里的哪一个函数，不然这个事件里的所有函数都会被取消
      this.$bus.$off('itemImageLoad', this.itemImgListener )
    },
    created() {
      // console.log('home created');

      // 1.请求多个数据
      this.getHomeMultidata()

      // 2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')

    },
    mounted() {

    },
    methods: {
      /**
       * 事件监听相关的方法
       */
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        //优化：是两个tab-control组件的点击保持一致
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      },
      contentScroll(position) {
        // 1.判断BackTop是否显示
        this.listernShowBackTop(position)

        // 2.决定tabControl是否吸顶
        this.isTabFixed = (-position.y) > this.taboffsetTop

      },
      loadMore() {
        this.getHomeGoods(this.currentType)
      },
      swiperImageLoad() {
        // 2.获取tabControl的offsetTop
        // 所有组件都有一个属性$el：用于获取组件中的元素
        this.taboffsetTop = this.$refs.tabControl2.$el.offsetTop
      },

      /**
       * 网络请求相关的方法
       */
      getHomeMultidata() {
        getHomeMultidata().then(res => {
            // console.log(res);
            this.banners = res.data.banner.list;
            this.recommends = res.data.recommend.list;
          })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1
        getHomeGoods(type, page).then(res => {
          //...语法：相当于 let item of res.data.list
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page +=1

          this.$refs.scroll.finishPullUp()
        })
      },

    }
  }
</script>

<style scoped>
  #home {
    /*padding-top: 44px;*/
    /*vh -> viewport height视窗高度 100vh->100% viewport height*/
    height: 100vh;
    position: relative;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: white;

    /*在使用浏览器原生滚动时，为了让导航不跟随一起滚动*/
    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*z-index: 9;*/
  }

  .wrapper {
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  .tab-control {
    position: relative;
    z-index: 9;
  }

</style>
