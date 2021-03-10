/*
 * @fileName: 3d模型查找的组件的注册脚本
 * @Date: 2021-03-09 11:35:51
 * @Author: manyao.zhu
 */

import MyModelSearch from './my-model-search'

MyModelSearch.install = Vue => Vue.component(MyModelSearch.name, MyModelSearch)
export default MyModelSearch
