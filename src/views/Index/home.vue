<!--
 * @fileName:
 * @Date: 2021-03-04 11:51:44
 * @Author: manyao.zhu
-->
<template>
    <div class="home" v-loading='loading'>
 zhuye
    </div>
</template>

<script>
	import { format } from 'date-fns'

	export default {
	    name: 'home',
	    data () {
	        return {
            loading: false
	        }
	    },
	    created() {
	    },
	    methods: {
      }
	}
</script>

<style lang="scss" scoped>
  .home {
    width:1200px;
    margin: 0 auto;
    padding-top:40px;
  }
</style>

