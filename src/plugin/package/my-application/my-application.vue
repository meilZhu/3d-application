<!--
 * @fileName: 3d应用的主包架构
 * @Date: 2021-03-04 10:03:52
 * @Author: manyao.zhu
-->

<template>
  <div class="unselect">
    <el-container class="three-app" v-loading="isLoading">
      <!-- 模型右侧 -->
      <el-aside class="three-app-aside" :width="asideWidth + 'px'">
        <!-- 右侧菜单 -->
        <my-model-tree
          :isCollapse="isCollapse"
          :asideWidth="asideWidth"
          :treeHeight="engineHeight"
          :selectedKeys="selectedKeys"
          :expandTreeNode="modelTreeData"
          :hasOtherTree="hasOtherTree"
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
            <!-- 右侧树形结构中其他树形结构数据 -->
            <slot name="tree-other-tree"></slot>
          </template>
        </my-model-tree>

        <!-- 检索组件 -->
        <slot name="search"></slot>
      </el-aside>

      <!-- 拖拽 -->
      <div class="drag-dom" @mousedown="onMousedown" :style="{height: engineHeight + 'px', width: '3px', cursor: 'col-resize'}"></div>

      <!-- 3d模型 -->
      <el-main class="three-app-main" id='app'>
        <div class="g-pos-relative" id="engineWrapper">
          <div id="JT_WEB" class="siemens-app-container" :style="{height: engineHeight + 'px', width: engineWidth + 'px', border: 'none'}"></div>
          <div id="headerArea"></div>
          <!-- 测点轴层 -->
          <slot name="layer"></slot>
        </div>
        <!-- 上部操作按钮 -->
        <div class="menu-move" :class="isMenuCollapse? 'menu-move-top' : ''">
          <my-model-menu :modelData="modelData" :selectedKeys="selectedKeys">
            <!-- 上部按钮的其他操作 -->
            <!-- 其他按钮 -->
            <slot name="menu-operation"></slot>
            <!-- 展示操作 -->
            <div class="expand-content" v-if="!isHiddenMenuCollpase"></div>
            <el-tooltip class="item" effect="light" content="展开操作菜单" placement="bottom">
              <i v-if="!isHiddenMenuCollpase" class="fa fa-plus drop-down drop" :class="!isMenuCollapse ? 'drop-down-hide' : ''" aria-hidden="true" @click="isMenuCollapse=false"></i>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="收起操作菜单" placement="bottom">
              <i v-if="!isHiddenMenuCollpase" class="fa fa-minus drop-up drop" aria-hidden="true" @click="isMenuCollapse=true"></i>
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
  const leftWidth = 300
  const paddingLeft = 3
  const leftMinWidth = 40
  window.jtWeb = null
  import jt_web from '@ithinkdt/jt-web';
  import { formatModelData, hanlderSelectData } from '../../utils/format'
  export default {
    name: 'MyApplication',
    data() {
      return {
        asideWidth: leftWidth,
        engineHeight: 0,
        engineWidth: 0,
        mouseOffsetX: 0,
        mouseOffsetY: 0,
        startDrag: false,
        // 右侧是否收缩
        isCollapse:false,
        // 是否开启自定义旋转中心
        isOpenDefineCenter: false,
        // 选中高亮的模型的keys
        selectedKeys: [],
        // 模型的树形结构数据
        modelTreeData: [],
        // 测点节点数据
        pointsTreeNode: [],
        // 上部按钮的收缩
        isMenuCollapse: false
      }
    },
    props: {
      isLoading: {
        type: Boolean,
        default: false
      },
      // header的高度
      headerHeight: {
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
      }
    },
    watch: {
      modelData: {
        handler: function(data) {
          formatModelData([data])
          this.modelTreeData = [data]
          hanlderSelectData(this.modelTreeData, this.selectedKeys)
          this.jtWeb.render(data);
        },
        deep: true
      },
    },
    created() {
      this.setEngineStyle({
        width: window.innerWidth - leftWidth - paddingLeft - this.rightMenuWidth,
        height: window.innerHeight - this.headerHeight
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
        this.jtWeb = new jt_web();
        window.jtWeb = this.jtWeb;
        this.jtWeb.init(this.getJtConf());
        // 模型的操作
        document.addEventListener('keyup', this.keyupEvent)
        document.addEventListener('keydown', this.keydownEvent)
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
              hanlderSelectData(this.modelTreeData, this.selectedKeys)
            },
            onLoad() {
              _self.$emit('setApploading', false)
              window.viewerManager.viewer.addEventListener("pointSelectedEvent", (pointIndexs) => {
                _self.$emit('selectPointChange', pointIndexs.data)
              });
              // 做延迟，保证模型已经加载好
              setTimeout(() => {
                window.jtWeb.getController().setColor('#B1AFAB')
              }, 4000)
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
        this.asideWidth = this.isCollapse ? leftWidth : leftMinWidth
        this.setEngineStyle({
          height: window.innerHeight - this.headerHeight,
          width: window.innerWidth - this.asideWidth - paddingLeft - this.rightMenuWidth
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
        this.mouseOffsetY = e.clientY - this.headerHeight
        if (this.startDrag) {
          if (this.mouseOffsetX < leftMinWidth) {
            this.asideWidth = leftMinWidth
          } else if (this.mouseOffsetX > window.innerWidth / 2) {
            this.asideWidth = window.innerWidth / 2
          } else {
            this.asideWidth = this.mouseOffsetX
          }
          this.setEngineStyle({
            height: window.innerHeight - this.headerHeight,
            width: window.innerWidth - this.asideWidth - paddingLeft - this.rightMenuWidth
          })

          this.change3dSize()
          this.$nextTick(() => {
            this.isCollapse = this.asideWidth <= leftMinWidth
          })
        }
      },
      // 放开鼠标按钮事件
      onMouseup(e) {
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
          height: window.innerHeight - this.headerHeight,
          width: window.innerWidth - leftWidth - paddingLeft - this.rightMenuWidth,
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

      // 键盘按下事件 (用于自定义旋转中心)
      keyupEvent(evt) {
        if (window.viewerManager) {
          this.isOpenDefineCenter = false
          window.jtWeb.getController().setRotationMode(1)
        }
      },

      // 键盘放开事件
      keydownEvent(evt) {
        if (window.viewerManager && !this.isOpenDefineCenter) {
          this.isOpenDefineCenter = true
          window.jtWeb.getController().setRotationMode(3)
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
  @import '../css/index';
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
        top: 10px;
        right: 50px;
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
          color: #aaa;
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
        .drop-down-hide {
          display: none;
        }
        .drop-up {
          position: absolute;
          top: 11px;
          right: 6px;
        }
      }
      .menu-move-top {
        top: -50px;
      }
      // .menu-move:hover {
      //   .drop-up {
      //     display: block;
      //   }
      // }
    }
  }

</style>
