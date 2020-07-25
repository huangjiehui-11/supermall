import {debounced} from "common/utils";
import BackTop from "components/content/backTop/BackTop";

export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null,
      refresh: null
    }
  },
  mounted() {
    // 1.监听item中图片加载完成
    // 有$refs，所以得放在mounted里
    this.refresh = debounced(this.$refs.scroll.refresh, 50)

    // 对监听的事件进行保存
    this.itemImgListener = () => {
      this.refresh()
    }
    this.$bus.$on('itemImageLoad', this.itemImgListener)
  }
}

export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false,
    }
  },
  methods: {
    backClick() {
      //直接调用scroll组件里的scrollTo方法
      //scrollTo(x轴位置，y轴位置，在多少毫秒内返回指定位置)
      this.$refs.scroll.scrollTo(0, 0)
    },
    listernShowBackTop(position) {
      // 判断BackTop是否显示
      this.isShowBackTop = (-position.y) > 1000
    }
  }
}
