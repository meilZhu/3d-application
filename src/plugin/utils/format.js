/*
 * @fileName: 数据格式化工具
 * @Date: 2021-03-04 16:02:07
 * @Author: manyao.zhu
 */
import { v4 as uuidv4 } from 'uuid'
import { setIndexedDB, getIndexedDB } from './storage'
import { trim } from 'lodash'

/**
 * @description 用于遍历处理模型的数据格式满足引擎使用
 * @param {*} list 需要遍历的数据
 */

const creatUuid = () => {
  return uuidv4().replaceAll('-', '')
}

export const formatModelData = (list, arr) => {
  if(list && list.length > 0){
    list.forEach(l => {
      if(l.children){
        formatModelData(l.children, arr)
      }
      l.visible = true
      l.showCheckbox = false
      l.isCurrent = true
      l.isSelected = false
      l.treeName = `${l.englishPartName} | ${l.revision}`
      if (arr.some( t => t === l.key)) {
        console.log('有相同的', l.key);
        l.key = creatUuid()
        console.log('重新生成的', l.key);
        arr.push(l.key)
      } else {
        arr.push(l.key)
      }
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
 * @param bool // 是否是点击模型，
 */
 export const hanlderSelectData = (list, key, bool) => {
  if (list && list.length) {
    list.forEach(l => {
      if (l.key === key) {
        if (bool) {
          l.isSelected = true
        } else {
          l.isSelected = !l.isSelected
        }
      } else {
        l.isSelected = false
      }

      if (l.children) {
        hanlderSelectData(l.children, key, bool)
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

      if ((item[prop] && item[prop].toUpperCase().indexOf(trim(str).toUpperCase()) !== -1) || (ab && ab.length)) {
        newArr.push(obj);
      }
    } else {
      if (item[prop] && item[prop].toUpperCase().indexOf(trim(str).toUpperCase()) !== -1) {
        newArr.push(item);
      }
    }
  });
  return newArr;
}

/**
 * @description 遍历模型树，求出他的长度
 * @param {*} list 需要遍历的模型树
 * @param {*} num 长度
 */
export const ergodicModelTreeLen = (list) => {
  let len = 0
  if (!list || !list.length) {
    return len
  }

  list.forEach( item => {
    if (item.children) {
     len += ergodicModelTreeLen(item.children)
    }
  })

  len += list.length

  return len
}

// 用于判断当前是否需要重置模型数据
export const isResetModelData = () => {
  const time = (new Date()).getTime()
  const originTime = Number(getIndexedDB())
  if (originTime && originTime > time) {
    return false
  } else {
    setIndexedDB(time + 7 * 24 * 60 * 60 * 1000)
    return true
  }
}

