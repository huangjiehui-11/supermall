import {
  ADD_COUNTER,
  ADD_TO_CART
} from './mutation-types'

export default {
  // mutations唯一的目的就是修改state中的状态
  // mutations中的每个方法尽可能完成的事件比较单一一点
  // 这样商品数加1和添加新商品两个事件都可以被跟踪
  [ADD_COUNTER](state, payload) {
    // 将重复商品里的count加1
    payload.count++
  },
  [ADD_TO_CART](state, payload) {
    state.cartList.push(payload)
  }
}
