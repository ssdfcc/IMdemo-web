<template>
  <van-nav-bar :title="userStore.title" fixed placeholder/>
  <!-- 路由组件 -->
  <router-view v-slot="{ Component }">
    <component :is="Component" class="min-h-[calc(100vh-50px)]"/>
  </router-view>
  <ChatTabbar/>
</template>

<script setup>
import useUserStore from "@/store/modules/user.js";
import ChatTabbar from "@/layout/tabbar/index.vue";

const userStore = useUserStore();
</script>

<style lang="scss" scoped>

</style>