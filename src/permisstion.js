//路由鉴权
import router from "@/router";
//获取用户相关的小仓库内部token数据,去判断用户是否登录成功
import useUserStore from "@/store/modules/user.js";
import pinia from "./store";

const userStore = useUserStore(pinia);
//全局守卫:项目当中任意路由切换都会触发的钩子
//全局前置守卫
//@ts-ignore
router.beforeEach(async (to, from, next) => {
  document.title = `${import.meta.env.VITE_APP_TITLE} - ${to.meta.title}`;
  //to:你将要访问那个路由
  //from:你从来个路由而来
  //next:路由的放行函数
  //获取token,去判断用户登录、还是未登录
  const token = userStore.token;
  //获取用户名字
  const name = userStore.name;
  const arr = ["/login", "/register"]
  //用户登录判断
  if (token) {
    //登录成功,访问login,不能访问,指向首页
    if (arr.indexOf(to.path) !== -1) {
      next({path: "/contacts"});
    } else {
      //登录成功访问其余路由(登录、注册排除)
      //有用户信息,直接放行
      if (name) {
        //放行
        next();
      } else {
        //如果没有用户信息,在守卫这里发请求获取到了用户信息再放行
        try {
          //获取用户信息
          await userStore.userInfo();
          //获取好友列表
          await userStore.getFriendList();
          //获取群列表
          await userStore.getGroupList();
          //放行
          //万一:刷新的时候是异步路由,有可能获取到用户信息、异步路由还没有加载完毕,出现空白的效果
          next({...to});
        } catch (error) {
          //token过期:获取不到用户信息了
          //用户手动修改本地存储token
          //退出登录->用户相关的数据清空
          userStore.clearStorage();
          // next({ path: "/login" });
          // location.reload();
        }
      }
    }
  } else {
    //用户未登录判断
    if (arr.indexOf(to.path) !== -1) {
      next();
    } else {
      next({path: "/login"})
    }
  }
});

//全局后置守卫
router.afterEach((to, from) => {
});
