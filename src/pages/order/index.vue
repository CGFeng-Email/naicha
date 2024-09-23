<template>
	<view>
		333
		<h3>counter: {{ counter }}</h3>
		<h3>username: {{ username }}</h3>
	</view>
</template>

<script setup>
import { computed } from 'vue';
import { useStore, mapState } from 'vuex';
import { useState } from '../../hooks/useState';

const {username, counter} = useState(['username', 'age', 'counter']);

</script>

<style></style>
