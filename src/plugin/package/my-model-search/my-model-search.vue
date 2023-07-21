<!--
 * @fileName: 模型查找的组件
 * @Date: 2021-03-04 14:22:56
 * @Author: manyao.zhu
-->

<template>
  <el-dialog
    title="打开3D模型"
    :modal-append-to-body="false"
    :visible.sync="isShow"
    class="search-part"
    :width="(900 / 1920) * 100 + 'vw'"
  >
    <div class="g-text-center" v-if="showTab">
      <el-radio-group v-model="activeTab" class="g-mb30">
        <el-radio-button label="component">选择测量对象</el-radio-button>
        <el-radio-button label="prd">搜索零件号</el-radio-button>
      </el-radio-group>
    </div>
    <div class="search-content" v-if="activeTab === 'prd'">
      <div class="g-mb15 g-text-right">
        <el-input
          placeholder="Part No"
          v-model="partNo"
          class="g-w350"
          @keyup.enter.native="onSearch"
        >
          <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
        </el-input>
      </div>
      <div class="g-text-center" v-loading="loading">
        <el-table
          class="g-mb15"
          :data="list"
          height="300"
          border
          highlight-current-row
          @current-change="onSelectRow"
        >
          <el-table-column prop="partNumber" label="Part No" min-width="130px"></el-table-column>
          <el-table-column prop="name" label="Name" min-width="150px"></el-table-column>
          <el-table-column prop="partName" label="Part Name" min-width="230px"></el-table-column>
          <el-table-column prop="revision" label="Rversion" min-width="100px"></el-table-column>
          <el-table-column prop="maturity" label="Maturity" min-width="130px"></el-table-column>
        </el-table>
        <!-- <el-pagination background layout="prev, pager, next" :page-size="pageSize" :total="total" @current-change="onChangePageNo"></el-pagination> -->
      </div>
    </div>

    <el-form
      v-if="activeTab === 'component'"
      ref="searchComponent"
      class="search-content"
      v-loading="loading"
    >
      <el-form-item label="Component" :label-width="(150 / 1920) * 100 + 'vw'">
        <el-cascader
          :options="compList"
          :props="cascaderProps"
          class="component-select"
          clearable
          @change="onChangeComponent"
        ></el-cascader>
      </el-form-item>
    </el-form>
    <div slot="footer" class="g-text-center">
      <el-button class="g-w70" type="primary" :disabled="!currentRow && !compId" @click="onSubmit"
        >Ok</el-button
      >
      <el-button class="g-ml20 g-w70" @click="isShow = false">Cancel</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'MyModelSearch',
  data() {
    return {
      activeTab: 'component',
      cascaderProps: {
        label: 'name',
        value: 'id',
      },
      partNo: '',
      currentRow: null,
      compId: null,
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    // 是否展示头部的切换按钮
    showTab: {
      type: Boolean,
      default: false,
    },
    // componentId数据
    componentList: {
      type: Array,
      default() {
        return []
      },
    },
    // prod 数据
    list: {
      type: Array,
      default() {
        return []
      },
    },
    // 加载列表状态
    loading: {
      type: Boolean,
      default: false,
    },
    // 是否启用vw单位
    isUseVw: {
      type: Boolean,
      default: true,
    },
    // 启用vw单位的传化比例
    vwPortRadio: {
      type: Number,
      default: 1920,
    },
  },
  watch: {
    value(val) {
      if (val && !this.showTab) {
        this.activeTab = 'prd'
        this.partNo = ''
        return
      }
      if (val && this.showTab) {
        this.activeTab = 'component'
        this.compId = ''
      }
    },
    activeTab(val) {
      this.currentRow = null
      this.compId = ''
    },
  },
  computed: {
    isShow: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      },
    },
    compList() {
      return this.mapCascaderOptions(this.componentList)
    },
  },
  methods: {
    // 对componentList 的处理，使其成为可以使用的数据
    mapCascaderOptions(list) {
      let templist = []
      for (let item of list) {
        const newObj = {}
        for (let key in item) {
          if (key.endsWith('Id')) {
            newObj.id = `${item[key]}`
          } else if (key.endsWith('Name')) {
            newObj.name = item[key]
          } else if (item[key] instanceof Array) {
            newObj.children = this.mapCascaderOptions(item[key])
          }
        }
        if (!newObj.id) {
          newObj.id = newObj.name
        }
        templist.push(newObj)
      }
      return templist
    },
    // prod 的获取数据事件
    onSearch() {
      this.currentRow = null
      this.$emit('onSearch', this.partNo)
    },

    // prd选择莫一行
    onSelectRow(currentRow) {
      this.currentRow = currentRow
    },
    // componentId选择模型
    onChangeComponent(value) {
      if (value && value.length > 0) {
        this.compId = value[value.length - 1]
        const nameArr = value.slice(0, value.length - 1)
        this.$emit('changeComponentId', {
          list: this.compList,
          id: value[value.length - 1],
          nameArr,
        })
      } else {
        this.compId = ''
      }
    },
    // 提交事件
    onSubmit() {
      if (this.activeTab === 'prd') {
        this.$emit('onSubmit', {
          type: 'prd',
          id: this.currentRow.id,
          componentId: this.currentRow.componentId,
        })
        return
      }
      this.$emit('onSubmit', { type: 'component', id: this.compId })
    },
  },
}
</script>

<style lang="scss" scoped>
.search-part {
  /deep/ .el-dialog__body {
    padding: 20px;
  }

  .search-content {
    .component-select {
      width: 560px;
    }
  }
}
</style>
