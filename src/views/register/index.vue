<template>
  <van-nav-bar title="注册" fixed placeholder/>
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
        <van-field
            v-model="formData.repassword"
            type="password"
            name="确认密码"
            label="确认密码"
            placeholder="确认密码"
            clearable
            :rules="[{ required: true, message: '请填写确认密码' }]"
        />
      </van-cell-group>
      <div class="m-4">
        <van-button round block type="primary" native-type="submit">
          注册
        </van-button>
        <div class="text-center mt-6">
          <span class="text-blue-500 cursor-pointer" @click="login">账号登录</span>
        </div>
      </div>
    </van-form>
  </div>
</template>

<script setup>
import {reactive} from 'vue'
import {reqRegister} from "@/api/user.js";
import {showFailToast, showLoadingToast, showSuccessToast} from 'vant';
import {useRouter} from "vue-router";

//获取路由器
const $router = useRouter();

const formData = reactive(
    {
      name: '',
      password: '',
      repassword: ''
    }
)

const onSubmit = async () => {
  showLoadingToast({
    message: '加载中...',
    forbidClick: true,
    duration: 0,
  });
  if (formData.password !== formData.repassword) {
    showFailToast("两次密码不一致");
    return
  }
  const res = await reqRegister(formData)
  console.log(res)
  if (res.code === 0) {
    showSuccessToast('注册成功');
    await $router.push({name: 'Login'})
  } else {
    showFailToast(res.msg);
  }

}
const login = () => {
  $router.push({name: 'Login'})
}
</script>

<style lang="scss" scoped>

</style>