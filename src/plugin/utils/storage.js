/*
 * @fileName: 用于控制清除缓存的工具
 * @Date: 2021-07-23 14:23:25
 * @Author: manyao.zhu
 * @LastEditors: manyao.zhu
 * @LastEditTime: 2021-07-23 17:35:31
 */

export const setIndexedDB = (time) => {
  localStorage.setItem('indexdb', time)
}

export const getIndexedDB = () => {
  return localStorage.getItem('indexdb')
}


export const removeIndexedDB = () => {
  localStorage.removeItem('indexdb')
}
