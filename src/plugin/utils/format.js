/*
 * @fileName: 数据格式化工具
 * @Date: 2021-03-04 16:02:07
 * @Author: manyao.zhu
 */

/**
 * @description 用于遍历处理模型的数据格式满足引擎使用
 * @param {*} list 需要遍历的数据
 */
export const formatModelData = (list) => {
  if(list && list.length > 0){
    list.forEach(l => {
      if(l.children){
        formatModelData(l.children)
      }
      l.visible = true
      // l.treeType = 'modelTree'
      l.showCheckbox = false
      l.isCurrent = true
      l.treeName = `${l.englishPartName} | ${l.revision}`
      if(!l.matrix1){
        return
      }
      l.matrix = "";
      for(let i= 1; i<=12; i++){
        if (i === 10 || i === 11 || i === 12) {
          l.matrix += String(Number(l[`matrix${i}`]) * 1000)
        } else {
          l.matrix += l[`matrix${i}`]
        }
        if(i !==12){
          l.matrix += ','
        }
        delete l[`matrix${i}`]
      }
    })
  }
}

/**
 * @description 用于处理3d左侧树形结构勾选时状态的变化 (当selectKeys发生变化，遍历expandTreeNode)
 * @param list // 需要遍历的数组
 * @param arr // 勾选中的数据
 */
export const hanlderSelectData = (list, arr) => {
  if (list && list.length) {
    list.forEach(l => {
      if (arr.some(t => t === l.key)) {
        l.isSelected = true
      } else {
        l.isSelected = false
      }

      if (l.children) {
        hanlderSelectData(l.children, arr)
      }
    })
  }
}

/**
 * @description 用于处理3d左侧树形结构眼睛点击时，父节点的选中问题
 * @param list // 需要遍历的数组
 * @param checked // 设置需要遍历的数组中的是否选中的状态
 */
export const ergodicParentNodeStatus = (list, checked) => {
  if(list && list.length > 0){
    list.forEach(l => {
      if (checked) {
        if (l.checked === checked) {
          l.checked = !checked
          if (l.parent) {
            ergodicParentNodeStatus([l.parent], checked)
          }
        }
      } else {
        const array = l.childNodes.filter( t => t.checked === checked);
        if (array.length === 1) {
          if (l.parent) {
            ergodicParentNodeStatus([l.parent], checked)
          }
          l.checked = !checked
        }
      }
    })
  }
}

/**
 * @description 用于处理3d左侧树形结构眼睛点击时，自己与子节点的选中问题
 * @param list // 需要遍历的数组
 * @param checked // 设置需要遍历的数组中的是否选中的状态
 */
export const ergodicTreeChangeNodeStatus = (list, checked) => {
  if(list && list.length > 0){
    list.forEach(l => {
      if(l.childNodes){
        ergodicTreeChangeNodeStatus(l.childNodes, checked)
      }
      l.checked = checked
    })
  }
}

/**
 * @description 用于点击菜单父节点时，抛出所有子节点的key
 * @param list // 当前节点（父节点）数据
 * @param arr // 子节点的key的集合
 */
export const ergodicChildNodeKeys = (list, arr) => {
  if (list && list.length) {
    list.forEach( l => {
      // 将子节点状态与当前点击节点一致的收集起来
      arr.push(l.key)
      if (l.children) {
        ergodicChildNodeKeys(l.children, arr)
      }
    })
  }
}



 /**
  *
  * @param {*} list 树形结构上展示的原始数据
  * @param {*} prop 树形结构上展示的属性
  * @param {*} str 过滤的字符串
  */
 export const filterVirtualTree = (list, prop, str) => {
  const newArr = [];
  list.forEach((item) => {
    if (item.children && item.children.length) {
      const ab = filterVirtualTree(item.children, prop, str);
      const obj = {
        ...item,
        children: ab,
      };

      if ((item[prop] && item[prop].toUpperCase().indexOf(_.trim(str).toUpperCase()) !== -1) || (ab && ab.length)) {
        newArr.push(obj);
      }
    } else {
      if (item[prop] && item[prop].toUpperCase().indexOf(_.trim(str).toUpperCase()) !== -1) {
        newArr.push(item);
      }
    }
  });
  return newArr;
}

