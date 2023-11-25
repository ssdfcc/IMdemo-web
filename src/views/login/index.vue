<template>
  <van-nav-bar title="登录" fixed placeholder/>
  <div class="mt-4">
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
            v-model="formData.name"
            name="用户名"
            label="用户名"
            placeholder="用户名"
            clearable
            :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
            v-model="formData.password"
            type="password"
            name="密码"
            label="密码"
            placeholder="密码"
            clearable
            :rules="[{ required: true, message: '请填写密码' }]"
        />
      </van-cell-group>
      <div class="m-4">
        <van-button round block type="primary" native-type="submit">
          登录
        </van-button>
        <div class="text-center mt-6">
          <span class="text-blue-500 cursor-pointer" @click="register">注册账号</span>
          <span class="text-gray-500">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
          <span class="text-blue-500 cursor-pointer">忘记密码</span>
        </div>
      </div>
    </van-form>
  </div>
</template>

<script setup>
import {reactive} from 'vue'
import {showFailToast, showSuccessToast} from 'vant';
import {useRouter} from "vue-router";
import useUserStore from "@/store/modules/user.js";
import {showLoadingToast} from 'vant';

const userStore = useUserStore();
//获取路由器
const $router = useRouter();

const formData = reactive(
    {
      name: '',
      password: ''
    }
)

const onSubmit = async () => {
  showLoadingToast({
    message: '加载中...',
    forbidClick: true,
    duration: 0,
  });

  await userStore.userLogin(formData)
      .then((res) => {
        if (res) {
          $router.push({path: "/"});
          showSuccessToast('登录成功');
        }
      })
      .catch((err) => {
        showFailToast(err);
      });
}
const register = () => {
  $router.push({name: 'Register'})
}
</script>

<style lang="scss" scoped>

</style>