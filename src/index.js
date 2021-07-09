/*
 * @fileName:
 * @Date: 2021-03-09 11:49:25
 * @Author: manyao.zhu
 */

import Vue from 'vue'
import Element from 'element-ui'
import DtTree from '@ithinkdt/vue-virsual-tree';

import MyApplication from './plugin/package/my-application/index'
import MyModelMenu from './plugin/package/my-model-menu/index'
import MyModelTree from './plugin/package/my-model-tree/index'
import MyModelSearch from './plugin/package/my-model-search/index'

import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Element)
Vue.use(DtTree)

const components = [
  MyApplication,
  MyModelMenu,
  MyModelTree,
  MyModelSearch
]

const install = function(Vue, opts = {}) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  MyApplication,
  MyModelMenu,
  MyModelSearch,
  MyModelTree
}
