import {debounced} from "common/utils";

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
