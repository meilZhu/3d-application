<!--
 * @fileName: 3d应用的主包架构
 * @Date: 2021-03-04 10:03:52
 * @Author: manyao.zhu
-->

<template>
  <div class="unselect">
    <el-container class="three-app" v-loading="isLoading">
      <!-- 模型右侧 -->
      <el-aside class="three-app-aside" :width="asideWidth + 'px'" v-if="leftMenuWidth">
        <!-- 右侧菜单 -->
        <my-model-tree
          :isCollapse="isCollapse"
          :asideWidth="asideWidth"
          :treeHeight="engineHeight"
          :selectedKeys="selectedKeys"
          :expandTreeNode="modelTreeData"
          :hasOtherTree="hasOtherTree"
          :isModelChange="modelIsChange"
          v-model="preKey"
          @showSearchModel="changeModelSearch"
          @onCollapse="onCollapse"
          @selectChange="selectChange"
        >
          <!-- 模型中加载测点数据按钮 -->
          <template slot="loading-point">
            <!-- 右侧tree加载侧点的按钮 -->
            <slot name="tree-loading-point"></slot>
          </template>
          <!-- 模型中其他按钮以及弹框框 -->
          <template slot="other">
            <!-- 右侧其它按钮以及相关弹窗 -->
            <slot name="tree-other"></slot>
          </template>
          <!-- 模型树中其他数据树插槽 -->
          <template slot="other-tree">
            <!-- 左侧树形结构中其他树形结构数据 -->
            <slot name="tree-other-tree"></slot>
          </template>
        </my-model-tree>

        <!-- 检索组件 -->
        <slot name="search"></slot>
      </el-aside>

      <!-- 拖拽 -->
      <div class="drag-dom" v-if="leftMenuWidth" @mousedown="onMousedown" :style="{height: engineHeight + 'px', width: '3px', cursor: 'col-resize'}"></div>

      <!-- 3d模型 -->
      <el-main class="three-app-main" id='app'>
        <div class="g-pos-relative" id="engineWrapper">
          <div id="JT_WEB" class="siemens-app-container" :style="{height: engineHeight + 'px', width: engineWidth + 'px', border: 'none'}"></div>
          <div id="headerArea"></div>
          <!-- 测点轴层 -->
          <slot name="layer"></slot>
        </div>
        <!-- 上部操作按钮 -->
        <div class="menu-move" :class="[menuPosition === 'topLeft' ? 'menu-top-left' : '',
            menuPosition === 'topRight' ? 'menu-top-right' : '',
            menuPosition === 'bottomLeft' ? 'menu-bottom-left' : '',
            menuPosition === 'bottomRight' ? 'menu-bottom-right' : '',
            menuPosition === 'topLeft' && isMenuCollapse? 'menu-top-left-change' : '',
            menuPosition === 'topRight' && isMenuCollapse? 'menu-top-right-change' : '',
            menuPosition === 'bottomLeft' && isMenuCollapse? 'menu-bottom-left-change' : '',
            menuPosition === 'bottomRight' && isMenuCollapse? 'menu-bottom-right-change' : '']"
        >
          <my-model-menu :modelData="modelData" :selectedKeys="selectedKeys">
            <!-- 上部按钮的其他操作 -->
            <!-- 基础操作按钮中的插槽 -->
            <template slot="base">
              <slot name="menu-base"></slot>
            </template>
            <!-- 其他按钮 -->
            <slot name="menu-operation"></slot>
            <!-- 展示操作 -->
            <div class="expand-content" v-if="!isHiddenMenuCollpase"></div>
            <el-tooltip class="item" effect="light" content="展开操作菜单" placement="bottom">
              <i v-if="!isHiddenMenuCollpase"
                class="fa drop"
                :class="[
                  !isMenuCollapse ? 'drop-down-hide' : '',
                  menuPosition === 'topLeft' || menuPosition === 'topRight' ? 'drop-down' : 'drop-bottom-down',
                  menuPosition === 'topLeft' || menuPosition === 'topRight' ? 'fa-angle-down' : 'fa-angle-up']"
                aria-hidden="true"
                @click="isMenuCollapse=false">
              </i>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="收起操作菜单" placement="bottom">
              <i v-if="!isHiddenMenuCollpase"
                class="fa drop"
                :class="[
                  menuPosition === 'topLeft' || menuPosition === 'topRight' ? 'drop-up' : 'drop-bottom-up',
                  menuPosition === 'topLeft' || menuPosition === 'topRight' ? 'fa-angle-up' : 'fa-angle-down']"
                aria-hidden="true"
                @click="isMenuCollapse=true">
              </i>
            </el-tooltip>
          </my-model-menu>
        </div>
        <!-- 页面的其他组件(这个主要还是在3d视图内，只是其在获取元素时可以不与3d同时获取) -->
        <slot name="outer-layer"></slot>
      </el-main>
      <div class="app-right-menu" :style="{height: engineHeight + 'px', width: rightMenuWidth + 'px', border: 'none'}">
        <!-- 页面左侧的tree -->
        <slot name="right-tree"></slot>
      </div>

    </el-container>
  </div>
</template>

<script>
  const paddingLeft = 3
  const leftMinWidth = 0
  window.jtWeb = null
  import jt_web from '@ithinkdt/jt-web';
  import { formatModelData, hanlderSelectData, isResetModelData } from '../../utils/format'
  import _ from 'lodash'
  export default {
    name: 'MyApplication',
    data() {
      return {
        asideWidth: 0,
        engineHeight: 0,
        engineWidth: 0,
        mouseOffsetX: 0,
        mouseOffsetY: 0,
        startDrag: false,
        // 右侧是否收缩
        isCollapse:false,
        // 是否开启键盘事件
        isOpenDefineCenter: false,
        // 选中高亮的模型的keys
        selectedKeys: [],
        // 模型的树形结构数据
        modelTreeData: [],
        // 测点节点数据
        pointsTreeNode: [],
        // 上部按钮的收缩
        isMenuCollapse: false,
        // 上一步勾选的数据
        preKey: null,
        modelIsChange: false
      }
    },
    props: {
      isLoading: {
        type: Boolean,
        default: false
      },
      // header的高度
      marginTop: {
        type: Number,
        default: 50
      },
      // 模型数据
      modelData: {
        type: Object,
        default() {
          return {}
        }
      },
      hasOtherTree: {
        type: Boolean,
        default: false
      },
      isCollapsedMenu: {
        type: Boolean,
        default: true
      },
      rightMenuWidth: {
        type: Number,
        default: 0
      },
      isHiddenMenuCollpase: {
        type: Boolean,
        default: false
      },
      outerMenuWidth: {
        type: Number,
        default: 0
      },
      leftMenuWidth: {
        type: Number,
        default: 300
      },
      menuPosition: {
        type: String,
        default: 'topRight'
      }
    },
    watch: {
      modelData: {
        handler: function(data) {
          // 重新创建jt_web
          this.createJtWeb()

          formatModelData([data], [])
          const obj = _.cloneDeep(data);
          this.modelTreeData = [obj]
          if (!isResetModelData()) {
            window.jtWeb.render(obj);
          } else {
            window.jtWeb.refresh(obj)
          }
        },
        deep: true
      },
      outerMenuWidth: {
        handler: function(val) {
          this.setEngineStyle({
            width: window.innerWidth - this.leftMenuWidth - paddingLeft - this.rightMenuWidth - val,
            height: window.innerHeight - this.marginTop
          })
        },
        immediate: true
      },
      leftMenuWidth: {
        handler: function(val) {
          this.asideWidth = val
        },
        immediate: true
      }
    },
    created() {
      this.setEngineStyle({
        width: window.innerWidth - this.leftMenuWidth - paddingLeft - this.rightMenuWidth - this.outerMenuWidth,
        height: window.innerHeight - this.marginTop
      })
      this.isMenuCollapse = this.isCollapsedMenu
    },
    mounted() {
      this.initJtWeb()
    },
    methods: {
      /**
       * 初始化数据
       */
      initJtWeb() {
        // 模型大小改变
        window.addEventListener('resize', this.screenMove)
        this.change3dSize();
        // 模型渲染
        // window.jtWeb = new jt_web();
        // window.jtWeb.init(this.getJtConf());
        this.createJtWeb()
        // 模型的操作
        document.addEventListener('keyup', this.keyupEvent)
        document.addEventListener('keydown', this.keydownEvent)
      },

      // 处理二次渲染模型时, 测点无法选中的问题
      createJtWeb() {
        // 模型渲染
        window.jtWeb = new jt_web();
        window.jtWeb.init(this.getJtConf());
      },

      // 获取模型引擎的配置
      getJtConf() {
        const _self = this;
        return {
          cameraPos: { pos: [], rot: [], tgt: [] },
          actions: {
            displayStructureView: () => {},
            // 模型选择
            selectionChange: (psIds) => {
              this.selectedKeys = psIds;
              this.preKey = psIds[psIds.length - 1]

              this.$emit('selectModel', psIds)
              this.modelIsChange = true
            },
            onLoad() {
              _self.$emit('setApploading', false)
              window.viewerManager.viewer.addEventListener("pointSelectedEvent", (pointIndexs) => {
                _self.$emit('selectPointChange', pointIndexs.data)
              });
              // 测点右击事件
              window.viewerManager.viewer.addEventListener("pointContextEvent", (pointIndex) => {
                _self.$emit('pointRightMouseEvent', pointIndex.data)
              })
            },
            onLoadComplete() {
              // 做延迟，保证模型已经加载好
              _self.$emit('setTemplate')
            }
          },
          points: this.pointsTreeNode,
          jtFiles: {
            // psid自动生成
            disableCache: false, // 是否启动缓存 清空缓存 清空某个
            NumberOfARequest: 1, // 一次请求文件数量
            downloadFn: (fileId, cb = () => {}) => {
              this.$emit('fetchJtFile', {fileId, cb})
            },
          },
        };
      },

      /**
       * 左侧模型树形的相关操作
       */
      changeModelSearch() {
        this.$emit('changeModelSearch')
      },

      // 右侧菜单的隐藏事件
      onCollapse() {
        this.asideWidth = this.isCollapse ? this.leftMenuWidth : leftMinWidth
        this.setEngineStyle({
          height: window.innerHeight - this.marginTop,
          width: window.innerWidth - this.asideWidth - paddingLeft - this.rightMenuWidth - this.outerMenuWidth
        })
        this.change3dSize()
        this.$nextTick(() => {
          this.isCollapse = !this.isCollapse
        })
        this.$emit('onCollapse', this.isCollapse)
      },

      // 右侧树形数据点击事件
      selectChange(keys) {
        this.selectedKeys = keys
        this.modelIsChange = false
      },
      /**
       * description 拖拽
       * */
      // 鼠标的划入划出的事件处理
      onMousedown() {
        this.startDrag = true
        this.$el.onmousemove = (e) => {
          this.onMousemove(e)
        }
        document.onmouseup = (e) => {
          this.onMouseup(e)
        }

        // 这里是对3d引擎的梳理
        if (this.$el.querySelector('#Control_0 canvas')) {
          this.$el.querySelector('#Control_0 canvas').onmousemove = (e) => {
            this.onMousemove(e)
          }
          this.$el.querySelector('#Control_0 canvas').onmouseup = (e) => {
            this.onMouseup(e)
          }
        }
      },
      // 移动事件
      onMousemove(e) {
        this.mouseOffsetX = e.clientX
        this.mouseOffsetY = e.clientY - this.marginTop
        if (this.startDrag) {
          if (this.mouseOffsetX < leftMinWidth) {
            this.asideWidth = leftMinWidth
          } else if (this.mouseOffsetX > window.innerWidth / 2) {
            this.asideWidth = window.innerWidth / 2
          } else {
            this.asideWidth = this.mouseOffsetX
          }
          this.setEngineStyle({
            height: window.innerHeight - this.marginTop,
            width: window.innerWidth - this.asideWidth - paddingLeft - this.rightMenuWidth - this.outerMenuWidth
          })

          this.change3dSize()
          this.$nextTick(() => {
            this.isCollapse = this.asideWidth <= leftMinWidth
          })
        }
      },
      // 放开鼠标按钮事件
      onMouseup() {
        this.startDrag = false
      },

      // 改变3d的大小
      change3dSize() {
        const dom = this.$el.querySelector('#Control_0')
        if (dom) {
          dom.style.width = `${window.innerWidth - this.asideWidth - paddingLeft}px`
        }
      },

      // 屏幕变化
      screenMove() {
        this.setEngineStyle({
          height: window.innerHeight - this.marginTop,
          width: window.innerWidth - this.leftMenuWidth - paddingLeft - this.rightMenuWidth - this.outerMenuWidth,
        })
      },

      // 设置引擎的宽高
      setEngineStyle(obj) {
        this.engineWidth = obj.width
        this.engineHeight = obj.height
        this.$emit('changeEnginSize', obj)
      },

      /**
       * 模型相关的操作
       */

      // 键盘放开事件 (用于自定义旋转中心)
      keyupEvent(evt) {
        if (window.viewerManager && this.isOpenDefineCenter) {
          this.isOpenDefineCenter = false
          if (evt.keyCode === 16) {
            window.jtWeb.getController().setRotationMode(1)
          }
          this.$emit('keyupEvent', evt)
        }
      },

      // 键盘按下事件
      keydownEvent(evt) {
        if (window.viewerManager && !this.isOpenDefineCenter) {
          this.isOpenDefineCenter = true
          // 自定义中心事件
          if (evt.keyCode === 16) {
            window.jtWeb.getController().setRotationMode(3)
          }
          // 抛出事件
          this.$emit('keydownEvent', evt)
        }
      },
    },
    beforeDestroy() {
      window.jtWeb = null
      window.removeEventListener('resize', this.screenMove)
      document.removeEventListener('keyup', this.keyupEvent)
      document.removeEventListener('keydown', this.keydownEvent)
    }
  }
</script>

<style lang="scss" scoped>
  @import '../css/variable.scss';
  .unselect {
    -webkit-user-select: none;
    -moz-user-select: none;
    -khtml-user-select: none;
    -ms-user-select: none;

    /* 以下两个属性目前并未支持，写在这里为了减少风险 */
    -o-user-select: none;
    user-select: none;
  }

  .three-app {
    height: 100%;
    width: 100%;

    .three-app-aside {
      position: relative;
      padding-bottom: 50px;
      border-right: 1px solid #eeee;
      overflow: hidden;
    }
    .three-app-main {
      position: relative;
      padding: 0;
      overflow: hidden;
      .siemens-app-container {
        border-left: none;
        border-top: none;
        border-bottom: none;
      }
      .menu-move {
        position: absolute;
        z-index: 100;
        transition: all 0.5s;
        .expand-content {
          width: 40px;
        }
        .drop {
          display: inline-block;
          width: 20px;
          height: 20px;
          text-align: center;
          font-size: 20px;
          cursor: pointer;
          color: #fff;
          margin: 0 5px;
          background: rgba(0,0,0,.1);
          border-radius: 50%;
          &:hover {
            color: $--color;
          }
        }
        .drop-down {
          position: absolute;
          top: 60px;
          right: 6px;
          transition: all 0.5s;
        }
        .drop-bottom-down {
          position: absolute;
          bottom: 63px;
          right: 6px;
          transition: all 0.5s;
        }
        .drop-down-hide {
          display: none;
        }
        .drop-up {
          position: absolute;
          top: 11px;
          right: 6px;
        }
        .drop-bottom-up {
          position: absolute;
          bottom: 8px;
          right: 6px;
        }
      }
      .menu-top-right {
        top: 10px;
        right: 50px;
      }
      .menu-top-right-change {
        top: -50px;
      }
      .menu-top-left {
        top: 10px;
        left: 50px;
      }
      .menu-top-left-change {
        top: -50px;
      }
      .menu-bottom-left {
        bottom: 10px;
        left: 50px;
      }
      .menu-bottom-left-change {
        bottom: -50px;
      }
      .menu-bottom-right {
        bottom: 10px;
        right: 50px;
      }
      .menu-bottom-right-change {
        bottom: -50px;
      }
    }
  }
</style>

<style lang="scss">
  @import '../css/variable';
  @import '../css/three-app.scss';
</style>
