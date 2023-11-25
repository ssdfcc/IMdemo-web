<template>
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
    >
      <van-cell v-for="item in userStore.groupList" :key="item">
        <!-- 使用 title 插槽来自定义标题 -->
        <template #title>
          <div class="flex items-center" @click="toSingle(item)">
            <img :src="userStore.baseUrl+item.img" alt="" class="w-10 h-10 rounded-full mr-2"/>
            <span class="text-base">{{ `${item.name}(${item.memberCount})` }}</span>
          </div>
        </template>
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <van-icon name="arrow" class="!text-base !flex items-center" @click=""/>
        </template>
      </van-cell>
    </van-list>
  </van-pull-refresh>
</template>

<script setup>

import useUserStore from "@/store/modules/user.js";
import {useRouter} from "vue-router";
import {ref} from "vue";

defineOptions({
  name: "ChatGroup"
});

const userStore = useUserStore();
userStore.title = '群聊';
const $router = useRouter();
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);


const onLoad = async () => {
  loading.value = false;
  finished.value = true;
  refreshing.value = false;
};

const onRefresh = () => {
  // 清空列表数据
  finished.value = false;

  // 重新加载数据
  // 将 loading 设置为 true，表示处于加载状态
  loading.value = true;
  userStore.getGroupList();
  onLoad();
};

const toSingle = (data) => {
  data.mold = 'group';
  $router.push({path: '/chat', state: data});
}
</script>

<style lang="scss" scoped>

</style>