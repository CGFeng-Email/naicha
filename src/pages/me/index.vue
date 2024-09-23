<!-- 页面路径：pages/index/index.vue -->
<template>
	<view>
		<text>用户名2：{{ username2 }}</text>
	</view>
</template>
<script>
import { computed } from 'vue';
import store from '../../store/index';
export default {
	computed: {
		username2() {
			return store.state.username
		}
	},

	setup() {
		return {

		}
	}
};
</script>
