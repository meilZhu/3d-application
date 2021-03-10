/*
 * @fileName: 3d 模型上方的操作按钮组件的注册脚本
 * @Date: 2021-03-09 11:34:02
 * @Author: manyao.zhu
 */
import MyModelMenu from './my-model-menu'

MyModelMenu.install = Vue => Vue.component(MyModelMenu.name, MyModelMenu)
export default MyModelMenu
