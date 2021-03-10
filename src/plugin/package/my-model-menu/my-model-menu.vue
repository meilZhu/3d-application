<!--
 * @fileName: 3d 模型上方的操作按钮组件
 * @Date: 2021-03-08 14:39:20
 * @Author: manyao.zhu
-->

<template>
  <div class="menu-action">
    <el-popover
      placement="bottom"
      trigger="hover"
      popper-class="my-tip-content"
      class="menu-content"
    >
      <el-tooltip class="item" effect="light" content="Fit selected item in" placement="bottom">
        <el-button class="action-zoom g-mr10" size="mini" type="text" @click="onFitSelectItemIn">
          <i class="el-ndqs-zoom-in"></i>
        </el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="light" content="Fit all in" placement="bottom">
        <el-button class="action-zoom g-mr10" type="text" size="mini" @click="onFitAllIn">
          <i class="el-ndqs-zoom-out"></i>
        </el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="light" content="Set color" placement="bottom-start">
        <el-dropdown trigger="click" :hide-on-click="false" class="action-color">
          <el-button class="g-mr10" type="text">
            <i class="el-ndqs-tianse"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown" class="action-color-menu">
            <el-dropdown-item>
              <label class="action-color-label">背景</label>
              <el-color-picker
                size="small"
                popper-class="action-selector-popper"
                :value="bgcolor"
                :predefine="predefineColors"
                @change="onChangeBgColor"
              ></el-color-picker>
            </el-dropdown-item>
            <el-dropdown-item>
              <label class="action-color-label">模型</label>
              <el-color-picker
                size="small"
                popper-class="action-selector-popper"
                :value="modelcolor"
                :predefine="predefineColors"
                @change="onChangeColor"
              ></el-color-picker>
            </el-dropdown-item>
            <el-dropdown-item>
              <label class="action-color-label" @click="setCatiaColor">Catia颜色</label>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-tooltip>
      <el-button class="my_btn" slot="reference"><i class="el-icon-menu"></i></el-button>
    </el-popover>
    <!-- 其他操作 -->
    <slot></slot>
  </div>
</template>

<script>
  import CONFIG from '../../config'
  export default {
    name: 'MyModelMenu',
    data() {
      return {
        modelcolor: null,
        bgcolor: null,
        predefineColors: CONFIG.COLOR
      }
    },
    props: {
      modelData: {
        type: Object,
        default() {
          return {}
        }
      },
      selectedKeys: {
        type: Array,
        default() {
          return []
        }
      },
    },
    methods: {
      // 方大
      onFitSelectItemIn() {
        if (JSON.stringify(this.modelData) === '{}' || !this.modelData) {
          return this.$message.warning('尚未加载模型')
        }
        if (!this.selectedKeys.length) {
          return this.$message.warning('尚未选中目标模型')
        }
        window.viewerManager.viewer.fitToPsId(`1:${this.selectedKeys[0]}`)
      },
      // 缩小
      onFitAllIn() {
        if (JSON.stringify(this.modelData) === '{}' || !this.modelData) {
          return this.$message.warning('尚未加载模型')
        }
        window.viewerManager.viewer.fitToModel()
      },
      // 引擎模型改变颜色
      onChangeColor(value) {
        if (JSON.stringify(this.modelData) === '{}' || !this.modelData) {
          this.modelcolor = ''
          return this.$message.warning('尚未加载模型')
        }
        this.modelcolor = value
        if (!value) {
          // window.jtWeb.getController().resetPartsColor()
          window.jtWeb.getController().setColor('#B1AFAB')
        } else {
          window.jtWeb.getController().setColor(value)
        }
      },
      // 引擎改变背景色
      onChangeBgColor(value) {
        if (JSON.stringify(this.modelData) === '{}' || !this.modelData) {
          this.bgcolor = ''
          return this.$message.warning('尚未加载模型')
        }
        this.bgcolor = value
        if (!value) {
          value = null
        }
        window.jtWeb.getController().setClearColor(value, 1)
      },

      // 恢复Catia颜色
      setCatiaColor() {
        window.jtWeb.getController().resetPartsColor()
      },

    }
  }
</script>

<style lang="scss" scoped>
  @import '../css/index';
  .menu-action {
    display: flex;
    align-items: center;
    .menu-content {
      margin: 0 5px;
      [class*=' el-ndqs-'],
      [class^='el-ndqs-'] {
        font-size: 38px !important;
        color: $--static-color;
        &:hover {
          color: $--color;
        }
      }
      [class*= 'el-icon-'],
      [class^= 'el-icon-'] {
        font-size: 34px !important;
        color: $--static-color;
        &:hover {
          color: $--color;
        }
      }
    }

    /deep/ .el-button + .el-button {
      margin-left: 0;
    }

    .heatmap-value-popup {
      position: fixed;
      z-index: 1000;
      background: #003e59;
      color: #fff;
      padding: 5px 10px;
      border-radius: 3px;
    }

    .my_btn {
      border: none !important;
      padding: 0 !important;
    }
  }
</style>

<style lang="scss">
  @import '../css/index';
  .my-tip-content {
    padding: 0px 0px 0px 15px !important;
    [class*=' el-ndqs-'],
    [class^='el-ndqs-'] {
      font-size: 38px !important;
      color: $--static-color;
      &:hover {
        color: $--color;
      }
    }
    [class*= 'el-icon-'],
    [class^= 'el-icon-'] {
      font-size: 34px !important;
      color: $--static-color;
      &:hover {
        color: $--color;
      }
    }
  }
</style>
