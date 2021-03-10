<!--
 * @fileName:模型右侧的树形组件
 * @Date: 2021-03-04 18:22:50
 * @Author: manyao.zhu
-->

<template>
  <div class="aside-menu">
    <el-menu class="el-menu-vertical-three" :collapse="isCollapse">
      <div v-show="asideWidth > 40">
        <div class="tree-action">
          <el-tooltip class="item" effect="light" content="打开3d模型" placement="bottom">
            <el-button class="g-mr10" type="text" size="mini" @click="showSearchModel">
              <i class="el-ndqs-folder"></i>
            </el-button>
          </el-tooltip>

          <!-- 加载测点 -->
          <slot name="loading-point"></slot>

          <el-tooltip  v-if="expandTreeNode.length" class="item" effect="light" content="模型展开" placement="bottom">
            <el-button class="g-mr10" type="text" size="mini" @click="onExpandTree">
              <i class="el-ndqs-structure-tree"></i>
            </el-button>
          </el-tooltip>
          <!-- 其他的按钮 -->
          <slot name="other"></slot>

        </div>
        <div class="tree-search" v-if="expandTreeNode.length">
          <el-input
            class="search-input"
            :style="{width: asideWidth - 40 + 'px'}"
            v-model="keyword"
            placeholder="搜索关键字"
            @blur="focus = false"
            @focus="focus = true"
            @keyup.enter.native="onSearch"
          >
            <span slot="suffix" class="search-suffix">
              <i v-if="keyword" class="el-ndqs-clear clearable-btn" :class="focus ? 'focus' : ''" @click="onClear"></i>
              <i class="el-ndqs-search search-btn" :class="focus ? 'focus' : ''" @click="onSearch"></i>
            </span>
          </el-input>
        </div>
        <div class="tree-wrap"  :style="{'max-height': treeHeight - 165 + 'px'}">
          <dt-tree
            v-if="expandTreeNode.length"
            class="model-tree"
            ref="tree"
            empty-text="暂无模型数据"
            icon-class="el-ndqs-arrow-right"
            node-key="key"
            :default-expand-all="false"
            :highlight-current="true"
            :expand-on-click-node="false"
            :default-expanded-keys="selectedKeys"
            :data="treeModelData"
            :height="hasOtherTree ? (treeHeight - 195) / 2 : treeHeight - 181 "
            :props="defaultProps"
            show-checkbox
            @node-click="onClickNode"
          >
            <span slot-scope="{node, data}">
              <!-- 模型树 -->
              <span class="custom-tree-node">
                <el-button type="text" size="mini" @click.stop="onVisibleModel(data, node)">
                  <i v-if="!node.checked" class="el-ndqs-visible"></i>
                  <i v-else class="el-ndqs-invisible"></i>
                </el-button>
                <span class="g-ml5 g-mr5">
                  <i v-if="data.children && data.children.length" class="el-ndqs-structure"></i>
                  <i v-else class="el-ndqs-part"></i>
                </span>
                <span :title="data.partNumber">{{ data.treeName }}</span>
              </span>
            </span>
          </dt-tree>
          <!-- 另外的tree -->
          <slot name="other-tree"></slot>
        </div>
      </div>
    </el-menu>
    <el-button class="aside-fold-arrow" type="text" @click="onCollapse">
      <i v-if="!isCollapse" class="el-ndqs-unfold"></i>
      <i v-if="isCollapse" class="el-ndqs-fold"></i>
    </el-button>
  </div>
</template>

<script>
  import { ergodicParentNodeStatus, ergodicTreeChangeNodeStatus, ergodicChildNodeKeys, filterVirtualTree, hanlderSelectData } from '../../utils/format'
  export default {
    name: 'MyModelTree',
    data() {
      return {
        keyword: '',
        focus: false,
        defaultProps: {
          children: 'children',
          label: 'treeName'
        },
        // 上一步选中的key
        prevKey: null,
        isFirstFilter: true,
        // 暂存tree展示的数据
        treeOperationModelData: [],
        // tree展示的数据
        treeModelData: []
      }
    },
    props: {
      // 是否展开
      isCollapse: {
        type: Boolean,
        default: false,
      },
      // 宽度
      asideWidth: {
        type: Number,
      },
      // 模型选中的key
      selectedKeys: {
        type: Array,
        default() {
          return []
        }
      },
      // 模型的树形数据结构
      expandTreeNode: {
        type: Array,
        default() {
          return []
        }
      },
      // 当前右侧tree可以设置的高度
      treeHeight: {
        type: Number,
        default: 0
      },
      // 是否有其他的tree 来分树形的高度
      hasOtherTree: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      selectedKeys(val){
        this.$refs.tree.setSelectedKeys(val)
        this.$forceUpdate()
      },
      expandTreeNode: {
        handler: function(val) {
          console.log(val)
          this.treeModelData = _.cloneDeep(val)
          this.treeOperationModelData = _.cloneDeep(val)
        },
        deep: true
      },
    },
    methods: {
      // 打开检索弹窗
      showSearchModel() {
        this.$emit('showSearchModel')
      },

      // 全部展开
      handleAllExpandTree(node, expanded) {
        if (!node) {
          return
        }
        node.expanded = expanded
        const childNodes = node.childNodes
        for (let childNode of childNodes) {
          this.handleAllExpandTree(childNode, expanded)
        }
      },
      onExpandTree() {
        const currentExpanded = this.$refs.tree.store.nodesMap[this.treeModelData[0].key].expanded
        const nodesMap = this.$refs.tree.store.nodesMap
        for (let key in nodesMap) {
          this.handleAllExpandTree(nodesMap[key], !currentExpanded)
        }
      },

      // 检索模型
      onSearch() {
        const arr = filterVirtualTree(this.treeOperationModelData, 'treeName', this.keyword)
        this.treeModelData = arr;
        this.$refs.tree.setCheckedKeys(this.selectedKeys)
      },

      // 清除检索模型
      onClear() {
        this.keyword = ''
        this.treeModelData = _.cloneDeep(this.treeOperationModelData)
        this.$refs.tree.setCheckedKeys(this.selectedKeys)
      },

      // 树形的点击事件
      onClickNode(data, node) {
        // 模型树的选择事件
        const {key, isSelected} = data
        const arr = []
        // 遍历含有子节点的所有key
        if (data.children && data.children.length) {
          ergodicChildNodeKeys([data], arr, isSelected)
        }
        // 这里是单选时清除上次高亮的模型部件
        if (this.prevKey && this.prevKey !== key) {
          window.JT2GoOfficeApp.ObjectFactory.getBrowserContainer().toggleSelection(false, '1:' + this.prevKey)
        }
        this.prevKey = key
        console.log(isSelected)
        window.JT2GoOfficeApp.ObjectFactory.getBrowserContainer().toggleSelection(!isSelected, '1:' + key)
        const keys = arr.length ? arr : [key]
        this.selectChange(keys)
      },

      // 处理模型点击
      // 右侧树形数据点击事件
      selectChange(keys) {
        let selectedKeys
        if (keys.length === 1 && this.selectedKeys.length === 1) {
          if (keys[0] === this.selectedKeys[0]) {
            selectedKeys = []
          } else {
            selectedKeys = keys
          }
          this.handleModelTree(selectedKeys)
          return
        }
        if (keys.length === 1 && this.selectedKeys.length !== 1) {
          selectedKeys = keys
          this.handleModelTree(selectedKeys)
          return
        }
        if ((keys.length !== 1 && this.selectedKeys.length < keys.length) || (keys.length !== 1 && !this.selectedKeys.length) || (keys.length !== 1 && this.selectedKeys.length > keys.length)) {
          selectedKeys = keys
          this.handleModelTree(selectedKeys)
          return
        }
        if (keys.length !== 1 && this.selectedKeys.length === keys.length && keys.some( t => t === this.selectedKeys[0])) {
          selectedKeys = []
          this.handleModelTree(selectedKeys)
          return
        }
        if (keys.length !== 1 && this.selectedKeys.length === keys.length && !keys.some( t => t === this.selectedKeys[0])) {
          selectedKeys = keys
          this.handleModelTree(selectedKeys)
          return
        }

        // 复选的处理
        // const newArr = _.chunk(keys, 100)
        // newArr.forEach( item => {
        //   item.forEach( key => {
        //     if (this.selectedKeys.some( t => t === key)) {
        //       const index = this.selectedKeys.findIndex(it => { return it === key})
        //       this.selectedKeys.splice(index, 1)
        //     } else {
        //       this.selectedKeys.push(key)
        //     }
        //   })
        // })
        // this.setModelTree({modelTreeJson: this.modelTree, selectKeys: this.selectedKeys});
      },

      // 处理点击树形时的数据变化
      handleModelTree(keys) {
        hanlderSelectData(this.treeModelData, keys)
        this.$emit('selectChange', keys)
      },

      // 树形的勾选眼睛事件
      onVisibleModel(data, node) {
        const key = data.key
        const visible = node.checked
        if (node.parent) {
          ergodicParentNodeStatus([node.parent], node.checked)
        }
        ergodicTreeChangeNodeStatus([node], !node.checked)
        window.JT2GoOfficeApp.ObjectFactory.getBrowserContainer().onDisplayChange(visible, '1:' + key)
      },

      // 右侧菜单的收缩点击事件
      onCollapse() {
        this.$emit('onCollapse')
        if (this.isCollapse && this.$refs.tree) {
          setTimeout(() => {
            this.$refs.tree.setSelectedKeys(this.selectedKeys)
          }, 1000)
        }
      }
    },
    beforeDestroy() {
      console.log('1111')
    }
  }
</script>

<style lang="scss" scoped>
  @import '../css/index';
  .aside-menu {
    .el-menu-vertical-three {
      font-size: 14px;
      width: 99%;
      overflow: auto;
      &.el-menu {
        border-right: none;
      }
      [class*=' el-ndqs-'],
      [class^='el-ndqs-'] {
        font-size: 14px;
      }

      .tree-action {
        padding: 2px 10px;
        height: 46px;
        border-bottom: 1px solid #e2e2e2;
        [class*='el-ndqs-'],
        [class^='el-ndqs-'],
        [class*='el-icon-'],
        [class^='el-icon-'] {
          font-size: 30px;
          color: $--static-color;
          &:hover {
            color: $--color;
          }
        }
        .el-ndqs-checkbox {
          color: $--static-color;
          &:hover {
            color: $--static-color;
          }
          &.checked {
            color: $--color;
          }
        }
      }
    }
    .tree-wrap {
      overflow-y: auto;
      /deep/ .el-tree {
        padding-top: 15px;
        .el-tree-node{
          display: flex;
        }
        .el-tree-node__expand-icon {
          color: #42526e;
          &.is-leaf {
            color: transparent;
          }
        }
        .el-tree-node > .el-tree-node__children {
          overflow: initial;
        }
      }
      .model-tree {
          /deep/ .el-tree-node.is-current > .el-tree-node__content {
            background-color: rgba(255, 255, 0, 0.5);
          }
      }
    }
    .active-current {
      background-color: rgba(255, 255, 0, 0.5);
    }

    .el-menu--collapse {
      width: 38px;
    }
    .aside-fold-arrow {
      position: absolute;
      bottom: 0;
      right: 0;
      padding: 8px;
      i {
        font-size: 24px;
      }
    }
    .tree-search {
      padding: 10px 20px 0;
      .search-input {
        [class*=' el-ndqs-'],
        [class^='el-ndqs-'] {
          font-size: 24px;
        }
        height: 40px;
        line-height: 40px;
        vertical-align: top;
        /deep/ .el-input__inner {
          caret-color: $--color;
          border-radius: 24px;
          height: 40px;
          line-height: 40px;
          padding: 0 20px;
        }
        /deep/ .el-input__suffix {
          right: 15px;
          .clearable-btn,
          .search-btn,
          i {
            color: #004b64;
            &.focus {
              color: $--color;
              &:hover {
                color: #004b64;
              }
            }
          }
          .clearable-btn {
            margin-right: 10px;
          }
        }
      }
      .dt-checked {
        margin-left: 3px;
      }
    }
    .aside-fold-arrow {
      [class*=' el-ndqs-'],
      [class^='el-ndqs-'] {
        font-size: 30px;
        color: $--static-color;
        &:hover {
          color: $--color;
        }
      }
    }
  }
</style>
