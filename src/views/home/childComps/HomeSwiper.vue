<template>
  <swiper ref="a">
    <swiper-item v-for="item in banners">
      <a :href="item.link">
        <!--load属性是用来监听图片的加载-->
        <img :src="item.image" alt="" @load="imageLoad">
      </a>
    </swiper-item>
  </swiper>
</template>

<script>
  import {Swiper, SwiperItem} from "components/common/swiper"

  export default {
    name: "HomeSwiper",
    props: {
      banners: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        isLoad: false
      }
    },
    components: {
      Swiper,
      SwiperItem
    },
    methods: {
      imageLoad() {
        //通过设置isLoad这个变量，来控制只发射一个$emit，只需要加载一张图片就可以确定高度
        if (!this.isLoad) {
          this.$emit( 'swiperImageLoad')
          this.isLoad = true
        }
      }
    }
  }
</script>

<style scoped>

</style>
