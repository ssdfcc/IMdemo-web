<template>
  <van-nav-bar left-arrow :title="userStore.title" fixed placeholder @click-left="onClickLeft"/>
  <van-field v-model="userForm.name" type="text" placeholder="请输入用户名" label="用户名" autocomplete="off"/>
  <van-field name="uploader" label="头像上传">
    <template #input>
      <van-uploader v-model="fileList" :before-read="beforeRead" :after-read="afterRead" capture="camera" accept="image/jpeg, image/png, image/bmp, image/gif" ax-count="1" />
    </template>
  </van-field>
  <van-cell class="mt-10 !bg-blue-500">
    <template #title>
      <div class="flex items-center justify-center" @click="save">
        <span class="text-base text-white">确定</span>
      </div>
    </template>
  </van-cell>
</template>

<script setup>
import useUserStore from "@/store/modules/user.js";
import {ref,reactive} from "vue";
import {showFailToast, showSuccessToast} from "vant";
import {reqAddFriend, reqAddGroup, reqCreateGroup} from "@/api/contact.js";
import {useRouter} from "vue-router";
import {reqUpdateUser, reqUpload} from "@/api/user.js";
defineOptions({
  name: "PersonalInfo"
});

const userStore = useUserStore();
userStore.title = '个人信息';
const userForm = reactive({
  name: userStore.name,
  avatar: userStore.avatar
})
const fileList = ref([{url: userStore.baseUrl+userStore.avatar}])
console.log(fileList.value)
const onClickLeft = () => history.back();

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
    userForm.avatar = res.data.path
    fileList.value = [{url: userStore.baseUrl+res.data.path}]
  } else {
    showFailToast(res.msg)
  }
}

const save = async () => {
  const res = await reqUpdateUser(userForm)
  if (res.code === 0) {
    showSuccessToast('修改成功')
    userStore.avatar = res.data.avatar
    userStore.name = res.data.name
    userStore.avatarList[`user_${userStore.id}`] = res.data.avatar
    history.back()
  } else {
    showFailToast(res.msg)
  }
}
</script>

<style lang="scss" scoped>

</style>