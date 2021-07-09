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
      <slot name="base"></slot>
      <el-button class="my_btn" slot="reference">
        <svg t="1617068765454" class="icon el-userdefine-menu" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1375" width="200" height="200">
          <path d="M921.988 961.099L801.825 840.942l36.468-36.466 120.971 120.965" p-id="1376"></path><path d="M706.792 905.564c-112.482 1.645-196.423-95.133-196.423-196.619 0-116.041 93.179-196.445 196.423-196.445 120.587 0 197 101.882 196.423 196.445-0.645 105.892-83.368 193.995-196.423 196.619z m0-327.582c-74.252 0-130.949 56.599-130.949 130.963 0 74.367 56.697 130.963 130.949 130.963s130.949-56.597 130.949-130.963c0-74.364-56.697-130.963-130.949-130.963z" p-id="1377"></path>
          <path d="M476.324 806.315l-28.237 14.06-320.062-159.5V302.277l320.062-155.902 320.062 155.726v146.108h64.013V255.953L447.653 63.945 64.012 255.953v447.93l384.075 191.756 92.249-46.441z" p-id="1378"></path><path d="M448.087 448.209l-256.05-128.213v63.794l256.05 128.337zM448.087 482.12" p-id="1379"></path>
          <path d="M448.087 512.127l256.05-128.337-0.133-63.794-255.917 128.213z" p-id="1380"></path>
        </svg>
      </el-button>
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
        console.log(value)
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
  @import '../css/variable';
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
    .g-mr10 {
      border: none !important;
      margin: 0 10px !important;
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
      .el-userdefine-menu {
        width: 30px;
        height: 30px;
        fill: $--static-color;
        margin: 0 5px;
        &:hover {
          fill: $--color;
        }
      }
    }
  }
</style>

<style lang="scss">
  @import '../css/variable';
  .my-tip-content {
    padding: 0px 0px 0px 10px !important;
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
    .g-mr10 {
      border: none !important;
      margin: 0 10px !important;
    }
  }

  .action-color-menu {
    .el-dropdown-menu__item {
      line-height: 35px;
    }
    .action-color-label {
      display: inline-block;
      vertical-align: middle;
      margin-right: 5px;
    }
    .el-color-picker {
      vertical-align: middle;
    }
  }
</style>
