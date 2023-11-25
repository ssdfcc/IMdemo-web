<template>
  <van-tabbar v-model="active" @change="onChange">
    <van-tabbar-item icon="chat-o">好友</van-tabbar-item>
    <van-tabbar-item icon="wechat">群聊</van-tabbar-item>
    <van-tabbar-item icon="contact-o">我的</van-tabbar-item>
  </van-tabbar>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {asyncRoute} from "@/router/routers.js";
import {useRouter, useRoute} from "vue-router";

defineOptions({
  name: "ChatTabbar"
});

const active = ref(0);
const $router = useRouter();
const $route = useRoute()
const onChange = (index) => {
  $router.push(asyncRoute[index].path);
};
onMounted(() => {
  asyncRoute.forEach((item, index) => {
    if (item.path === $route.path) {
      active.value = index;
    }
  })
})
</script>

<style lang="scss" scoped>

</style>