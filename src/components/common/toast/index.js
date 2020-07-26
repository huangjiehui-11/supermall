import Toast from "./Toast";

const obj = {}

// Vue.use安装这个插件后会执行install函数
// 默认会把vue实例对象传过来
obj.install = function (Vue) {
  // 1.创建组件构造器
  const toastContructor = Vue.extend(Toast)

  // 2.new的方式，根据组件构造器，可以创建出来一个组件对象
  const toast = new toastContructor()

  // 3.将组件对象，手动挂载到某一个元素上
  toast.$mount(document.createElement('div'))

  // 4.toast.$el对应的就是div
  document.body.appendChild(toast.$el)

  Vue.prototype.$toast = toast;
}

export default obj
