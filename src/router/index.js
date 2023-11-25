import {createRouter, createWebHashHistory} from "vue-router";
import {constRoute} from "./routers.js";
//创建路由器
const router = createRouter({
  //路由模式hash
  history: createWebHashHistory(),
  routes: constRoute,
  //滚动行为
  scrollBehavior() {
    return {
      top: 0,
      left: 0
    };
  }
});

export default router;