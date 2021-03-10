/*
 * @fileName: 3d模型右侧的树形组件的注册脚本
 * @Date: 2021-03-09 11:37:32
 * @Author: manyao.zhu
 */

import MyModelTree from './my-model-tree'

MyModelTree.install = Vue => Vue.component(MyModelTree.name, MyModelTree)
export default MyModelTree
