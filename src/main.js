import {createApp} from 'vue'
//引入重置样式
import "@/styles/reset.scss";
//引入tailwind.css
import "@/styles/tailwind.css";
import '@vant/touch-emulator';
import 'vant/lib/index.css';
import Vant from 'vant';
import App from './App.vue'
//引入路由
import router from "@/router";
//引入仓库
import pinia from "./store";
//引入路由鉴权
import "./permisstion";

const app = createApp(App);
//注册vant
app.use(Vant);
//注册模板路由
app.use(router);
//安装仓库
app.use(pinia);
//将应用挂载到挂载点
app.mount("#app");
