# pinnacle-pc-geniustribal

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm start

# build for production with minification
npm run build
```

# 3D 应用业务包的主要构建及使用说明
#### 1.包含的主要组件模块
1. 3d 应用框架组件  my-application
2. 3d 模型检索组件  my-model-search
3. 3d 左侧模型树组件  my-model-tree
4. 3d 模型功能菜单组件  my-model-menu

#### 2.组件的主要使用配置信息

**my-application 模型组件**

- 接受属性 Attributes
![image.png](http://note.youdao.com/yws/res/16029/WEBRESOURCE6b179762ace1aeb06e29db640b15999b)

- 事件 Event
![image.png](http://note.youdao.com/yws/res/16031/WEBRESOURCE8089a7ae6944d34838638cb4abc64532)

- 插槽 Slot
![image.png](http://note.youdao.com/yws/res/16033/WEBRESOURCE90f3d9cd792edd4f1ad10409bfce682c)

- 使用的代码片段

```
<my-application
  :headerHeight="50"
  :modelData="modelData"
  :isLoading="appIsLoading"
  :isCollapsedMenu="true"
  :hasOtherTree="pointsTree.length > 0"
  @changeEnginSize="changeEnginSize"
  @fetchJtFile="fetchJtFile"
  @selectPointChange="selectPointChange"
  @setApploading="setApploading"
  @changeModelSearch="changeModelSearch"
  @onCollapse="onCollapse"
>
   <!-- 左侧菜单加载测点数据按钮 -->
  <template v-slot:tree-loading-point> </template>

  <!-- 左侧菜单其他按钮的位置 以及相关弹窗的组件位置-->
  <template v-slot:tree-other> </template>

  <!-- 检索组件 -->
  <template v-slot:search>
    <my-model-search
      v-model="showModelSearch"
      :componentList="$NDQSComponentSelector"
      :loading="searchLoading"
      :list="prdModelList"
      :showTab="true"
      @onSearch="onSearch"
      @changeComponentId="changeComponentId"
      @onSubmit="onSubmit"
    ></my-model-search>
  </template>

  ......
</my-application>

export default {
   methods: {
     // 下载JT文件
      fetchJtFile(obj){
        web3dClient
          .getJtFile(obj.fileId)
          .then((data) => {
            if(data.data.debug_msg){
              obj.cb([]);
              return;
            }
            data.data.key = obj.fileId[0];
            obj.cb([data.data]);
          })
          .catch((err) => {
            this.$message.error(err.message)
          })
      },
      ......
   }
}
```


**my-model-search  3d模型数据检索组件**

- 接受属性 Attributes
![image.png](http://note.youdao.com/yws/res/16038/WEBRESOURCEe32f1bb6ca7c6417d26b2ff1e87b2894)

- 事件 Event
![image.png](http://note.youdao.com/yws/res/16040/WEBRESOURCE930a91279ca90759a383177b0d76547e)

- 插槽 Slot

无


- 使用的代码片段


```
<my-model-search
  v-model="showModelSearch"
  :componentList="$NDQSComponentSelector"
  :loading="searchLoading"
  :list="prdModelList"
  :showTab="true"
  @onSearch="onSearch"
  @changeComponentId="changeComponentId"
  @onSubmit="onSubmit"
></my-model-search>
```



**My-model-tree组件  和  my-model-menu组件 在集成的时候时在插件内部集成，这里就不加以说明**

#### 3. 3d-application 的安装集成
安装

```
npm install @styleofpicasso/3d-application --save
// 或
yarn add @styleofpicasso/3d-application
```



引入使用

```
// 在项目的入口文件中
import Application from '@styleofpicasso/3d-application'
Vue.use(Application)
// 直接使用主题色
import '@styleofpicasso/3d-application/dist/index.min.css';

// 自定义主题色
$--color: 色值
$--static-color: 色值
@import '@styleofpicasso/3d-application/src/plugin/package/css/index.scss';

// 这里需要注意

要将element-ui中关于字体的文件夹 fonts文件夹 直接移入到项目的静态资源 static文件夹内
```


页面集成
- html 案例代码
<!-- 在集成页面中可以直接使用这些组件 -->

```
<template>
 <div class="application-contain">
   <my-application
      :headerHeight="50"
      :modelData="modelData"
      :isLoading="appIsLoading"
      :isCollapsedMenu="true"
      :hasOtherTree="false"
      @fetchJtFile="fetchJtFile"
      @setApploading="setApploading"
      @changeModelSearch="changeModelSearch"
    >
      <!-- 加载测点数据按钮 -->
      <template v-slot:tree-loading-point>
      <!-- 3d左侧上木按钮样式案例 -->
        <el-tooltip class="item" effect="light" content="加载测点" placement="bottom">
          <el-button class="g-mr10" type="text" size="mini">
            <i class="el-ndqs-point"></i>
          </el-button>
        </el-tooltip>
      </template>

      <!-- 右侧菜单其他按钮的位置 以及相关弹窗的组件位置-->
      <template v-slot:tree-other></template>

      <!-- 右侧菜单中添加的其他树形结构 -->
      <template v-slot:tree-other-tree> </template>

      <!-- 检索组件 -->
      <template v-slot:search>
        <my-model-search
          v-model="showModelSearch"
          :loading="searchLoading"
          :list="prdModelList"
          @onSearch="onSearch"
          @onSubmit="onSubmit"
        ></my-model-search>
      </template>

      <!-- 3d的统计图框视图层 (这里面需要在生成pdf时用，和3d视图层在一起) -->
      <template v-slot:layer></template>

      <!-- 页面关于3d的操作按钮的插槽 -->
      <template v-slot:menu-operation>
        <!-- 3d自定义的按钮样式案例 -->
        <el-popover
          placement="bottom"
          trigger="hover"
          popper-class="my-tip-content"
          class="menu-content"
        >
          <el-tooltip class="item" effect="light" content="剪切pdf文本" placement="bottom">
            <el-button  class="action-statistics g-mr10" type="text">
              <i class="el-icon-camera"></i>
            </el-button>
          </el-tooltip>
        </el-popover>
      </template>

      <!-- 页面的其他图层 <也就是在模型上方展示的> -->
      <template v-slot:outer-layer></template>

    </my-application>
 </div>
 </template>
```

- Js 案例代码

```
// 这里实现的时纯框架自带的结构数据展示以及操作 （其他各个业务需要的需要自己去集成）

<script>
  import _ from 'lodash'
  import {web3dClient, swanAPI} from '~/common/client'
  import CONFIG from '../../config'
  export default {
    name: 'three-app',
    data() {
      return {
        modelData: null,
        appIsLoading: false,

        showModelSearch: false,
        searchLoading: false,
        prdModelList: [],

        submitLoading: true
      }
    },
    created() {},
    methods: {
      // 下载JT文件
      fetchJtFile(obj){
        console.log(obj)
        web3dClient
          .getJtFile(obj.fileId)
          .then((data) => {
            if(data.data.debug_msg){
              obj.cb([]);
              return;
            }
            data.data.key = obj.fileId[0];
            obj.cb([data.data]);
          })
          .catch((err) => {
            this.$message.error(err.message)
          })
      },

      // 模型渲染之后去除页面加载loading
      setApploading(bool) {
        this.appIsLoading = bool
      },

      // 搜索模型数据弹框事件
      changeModelSearch() {
        this.getModelData()
        this.showModelSearch = true
      },

      // prd的检索事件
      onSearch(no) {
        this.getModelData(no)
      },

      // 获取模型的确定事件
      onSubmit(obj) {
        if (!this.submitLoading) {
          this.$message.warning("正在获取模型数据,请耐心等待！")
          return;
        }
        this.submitLoading = false
        switch(obj.type) {
          case 'prd':
            this.getPrdModel(obj.id)
            break;
          default:
        }
      },

      // 通过prd 获取模型数据
      getPrdModel(id) {
        if (!id) {
          this.$message.warning('请选择零件')
          return
        }
        this.searchLoading = true
        swanAPI
          .queryPartDetail( { id } )
          .then(data => {
            this.modelData = data
            this.showModelSearch = false
            this.appIsLoading = true
          })
          .catch((err) => {
            this.$message.error(err.message)
          })
          .finally(() => {
            this.searchLoading = false
            setTimeout(() => {
              this.submitLoading = true
            }, 3000)
          })
      },

       // 获取模型列表数据
      getModelData(no = '') {
        this.searchLoading = true
        swanAPI
          .searchePart({
            part_number: _.trim(no) || '*',
            offset: 0,
            limit: 200,
          })
          .then((res) => {
            if(res){
              this.prdModelList = res
            }else{
              this.prdModelList = []
            }
          })
          .catch((err) => {
            this.$message.error(err.message)
          })
          .finally(() => {
            this.searchLoading = false
          })
      },


    }
  }
</script>
```


- shared.scss

```
// 主题active色
$themeColor: #409eff;
// 主题色的默认色
$themeDefaultColor: rgba(64, 158, 255, .7);
```


- scss 案例代码

```
/* 集成页面的样式 */
  @import '~/css/common/shared.scss';
  /* 这里是关于左侧操作按钮的样式 */
  .application-contain {
    width: 100%;
    height: 100%;
    .tree-action {
      padding: 2px 10px;
      height: 46px;
      border-bottom: 1px solid #e2e2e2;
      [class*='el-ndqs-'],
      [class^='el-ndqs-'],
      [class*='el-icon-'],
      [class^='el-icon-'] {
        font-size: 30px;
        color: $themeDefaultColor;
        &:hover {
          color: $themeColor;
        }
      }
      .el-ndqs-checkbox {
        color: $themeDefaultColor;
        &:hover {
          color: $themeDefaultColor;
        }
        &.checked {
          color:  $themeColor;
        }
      }
    }
  }

  /* 这个时关于3d上面操作按钮样式 */
  .my-tip-content {
    padding: 0px 0px 0px 15px !important;
    [class*=' el-ndqs-'],
    [class^='el-ndqs-'] {
      font-size: 38px !important;
      color: $themeDefaultColor;
      &:hover {
        color: $themeColor;
      }
    }
    [class*= 'el-icon-'],
    [class^= 'el-icon-'] {
      font-size: 34px !important;
      color: $themeDefaultColor;
      &:hover {
        color: $themeColor;
      }
    }
  }
```
#### 详细地址
https://ithinkdt.feishu.cn/docs/doccnWsZg68Y7fjcmcRKIvcMn4b#PA07fp
