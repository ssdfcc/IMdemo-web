<template>
  <div>
    <van-cell>
      <!-- 使用 title 插槽来自定义标题 -->
      <template #title>
        <div class="flex items-center" @click="$router.push({path: '/personalInfo'})">
          <img :src="userStore.baseUrl+userStore.avatar" alt="" class="w-10 h-10 rounded-full mr-2"/>
          <span class="text-base">{{ userStore.name }}</span>
        </div>
      </template>
      <!-- 使用 right-icon 插槽来自定义右侧图标 -->
      <template #right-icon>
        <van-icon name="arrow" class="!text-base !flex items-center" @click=""/>
      </template>
    </van-cell>
    <van-cell>
      <template #title>
        <div class="flex items-center" @click="">
          <span class="text-base">通知公告</span>
        </div>
      </template>
      <template #right-icon>
        <van-icon name="arrow" class="!text-base !flex items-center" @click=""/>
      </template>
    </van-cell>
    <van-cell>
      <template #title>
        <div class="flex items-center" @click="addFriendDialog=true">
          <span class="text-base">添加好友</span>
        </div>
      </template>
      <template #right-icon>
        <van-icon name="arrow" class="!text-base !flex items-center" @click=""/>
      </template>
    </van-cell>
    <van-cell>
      <template #title>
        <div class="flex items-center" @click="addGroupDialog=true">
          <span class="text-base">加入群</span>
        </div>
      </template>
      <template #right-icon>
        <van-icon name="arrow" class="!text-base !flex items-center" @click=""/>
      </template>
    </van-cell>
    <van-cell>
      <template #title>
        <div class="flex items-center" @click="openCreateGroupDialog">
          <span class="text-base">创建群</span>
        </div>
      </template>
      <template #right-icon>
        <van-icon name="arrow" class="!text-base !flex items-center" @click=""/>
      </template>
    </van-cell>
    <van-cell class="mt-10">
      <template #title>
        <div class="flex items-center justify-center" @click="logout">
          <span class="text-base text-red-600">退出登录</span>
        </div>
      </template>
    </van-cell>


    <!-- 添加好友 -->
    <van-dialog v-model:show="addFriendDialog" title="添加好友" @confirm="addFriend" @cancel="friendId=''"  show-cancel-button>
      <div class="p-5">
        <van-field v-model="friendId" type="digit" placeholder="请输入好友id" class="border-2" autocomplete="off"/>
      </div>
    </van-dialog>
    <!-- 添加群 -->
    <van-dialog v-model:show="addGroupDialog" title="加入群" @confirm="addGroup" @cancel="groupId=''"  show-cancel-button>
      <div class="p-5">
        <van-field v-model="groupId" type="digit" placeholder="请输入群id" class="border-2" autocomplete="off"/>
      </div>
    </van-dialog>
    <!-- 创建群 -->
    <van-dialog v-model:show="createGroupDialog" title="创建群" @confirm="createGroup" show-cancel-button>
      <div class="p-5">
        <van-field v-model="groupData.name" type="text" placeholder="请输入群名" label="群名" autocomplete="off"/>
        <van-field name="uploader" label="群图片上传">
          <template #input>
            <van-uploader v-model="fileList" :before-read="beforeRead" :after-read="afterRead" capture="camera" accept="image/jpeg, image/png, image/bmp, image/gif" ax-count="1" />
          </template>
        </van-field>
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import useUserStore from "@/store/modules/user.js";
import {ref,reactive} from "vue";
import {showFailToast, showSuccessToast} from "vant";
import {reqAddFriend, reqAddGroup, reqCreateGroup} from "@/api/contact.js";
import {useRouter} from "vue-router";
import {reqUpload} from "@/api/user.js";
defineOptions({
  name: "ChatPersonal"
});

const userStore = useUserStore();
const $router = useRouter();
userStore.title = '个人中心';
const addFriendDialog = ref(false);
const addGroupDialog = ref(false);
const createGroupDialog = ref(false);
const friendId = ref('')
const groupId = ref('')
const groupData = reactive({
  name: '',
  img: ''
})
const fileList = ref([])
// 添加好友
const addFriend = async () => {
  if (friendId.value === '') {
    showFailToast('请输入好友id')
    return
  }
  if (Number(friendId.value) === 0) {
    showFailToast('请输入好友id')
    friendId.value=''
    return
  }
  const res = await reqAddFriend({id: Number(friendId.value)})
  if (res.code === 0) {
    showFailToast('添加成功')
    // addFriendDialog.value = false
  } else {
    showFailToast(res.msg)
  }
  friendId.value=''
}
// 添加群
const addGroup = async () => {
  if (groupId.value === '') {
    showFailToast('请输入群id')
    return
  }
  if (Number(groupId.value) === 0) {
    showFailToast('请输入群id')
    groupId.value=''
    return
  }
  const res = await reqAddGroup({id: Number(groupId.value)})
  if (res.code === 0) {
    showFailToast('加入群成功')
    // addFriendDialog.value = false
  } else {
    showFailToast(res.msg)
  }
  groupId.value=''
}
// 退出登录
const logout = async () => {
  await userStore.userLogout();
  //跳转到登录页面
  await $router.push({ path: "/login" });
  //强制刷新
  location.reload();
};
// 检查图片
const beforeRead = (file) => {
  const isJPG = file.type === "image/jpeg";
  const isPng = file.type === "image/png";
  const isBmp = file.type === "image/bmp";
  const isGif = file.type === "image/gif";
  if (!isJPG && !isPng && !isBmp && !isGif) {
    showFailToast('请上传图片类型的文件');
    return false;
  } else if (file.size / 1024 / 1024 > 5) {
    showFailToast("图片大小不能大于5MB!");
    return false;
  }
  return true;
}
// 上传图片
const afterRead = async (file) => {
  const formData = new FormData();
  formData.append("file", file.file);
  const res = await reqUpload(formData)
  if (res.code === 0) {
    groupData.img = res.data.path
    fileList.value = [{url: userStore.baseUrl+res.data.path}]
  } else {
    showFailToast(res.msg)
  }
}
const openCreateGroupDialog = () => {
  Object.assign(groupData, {name: '', img: ''})
  createGroupDialog.value = true
}
const createGroup = async () => {
  const res = await reqCreateGroup(groupData)
  if (res.code === 0) {
    showSuccessToast('创建成功')
    createGroupDialog.value = false
  } else {
    showFailToast(res.msg)
  }
}
</script>

<style lang="scss" scoped>

</style>