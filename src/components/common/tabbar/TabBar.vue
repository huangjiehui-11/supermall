<template>
  <div id="tab-bar">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: "TabBar"
  }
</script>

<style scoped>
  #tab-bar {
    display: flex;
    background-color: #f6f6f6;

    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;

    /*设置div的阴影，第一二个参数是x,y轴的偏移量(正为向左和向下)，第三个参数是阴影的大小
    第四个参数是阴影的透明度*/
    box-shadow: 0 -1px 1px rgba(100,100,100,.2) ;
  }


</style>
