/*
 * @fileName:
 * @Date: 2022-04-14 15:24:45
 * @Author: manyao.zhu
 */

import MyApplication from './package/my-application/index'
import MyModelMenu from './package/my-model-menu/index'
import MyModelTree from './package/my-model-tree/index'
import MyModelSearch from './package/my-model-search/index'

const components = [
  MyApplication,
  MyModelMenu,
  MyModelTree,
  MyModelSearch
]

const install = function(Vue) {
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
  ...components
}
