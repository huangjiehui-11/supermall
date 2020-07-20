<template>
  <!--ref如果是绑定在组件中的，那么通过this.$refs.refsname获取到的是一个组件对象-->
  <!--ref如果是绑定在普通的元素中，那么通过this.$refs.refsname获取到的是一个元素对象-->
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    name: "Scroll",
    props: {
      probeType: {
        type: Number,
        default: 0
      },
      pullUpLoad: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        scroll: null
      }
    },
    mounted() {
      // 1.创建BScroll对象
      //要在mounted里面初始化，因为只有挂载了实例才能进行元素的绑定
      this.scroll = new BScroll(this.$refs.wrapper, {
        click: true,
        probeType: this.probeType,
        pullUpLoad: this.pullUpLoad
      })

      // 2.监听滚动的位置
      this.scroll.on('scroll', (position) => {
        // console.log(position);
        this.$emit('scroll', position)
      })

      // 3.监听上拉事件
      this.scroll.on('pullingUp', () => {
        // console.log('上拉加载更多');
        this.$emit('pullingUp')
      })
    },
    methods: {
      scrollTo(x, y, time=500) {
        //加上this.scroll确保scroll有先初始化成功，才能调用scrollTo方法
        this.scroll && this.scroll.scrollTo(x, y, time)
      },
      finishPullUp() {
        this.scroll.finishPullUp()
      },
      refresh() {
        //加上this.scroll确保scroll有先初始化成功，才能调用refresh方法
        this.scroll && this.scroll.refresh()
      }
    }
  }
</script>

<style scoped>

</style>
