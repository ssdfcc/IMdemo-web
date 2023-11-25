//创建用户相关的小仓库
import {defineStore} from "pinia";
//引入本地存储的工具方法
import {SET_TOKEN, GET_TOKEN, REMOVE_TOKEN} from "@/utils/token.js";
import {reqGetGroupUserList, reqGetRedisMsgList, reqLogin, reqLogout, reqUserInfo} from "@/api/user.js";
//引入深拷贝方法
import cloneDeep from "lodash/cloneDeep";
import {constRoute, anyRoute, asyncRoute, highRoute} from "@/router/routers.js";
import router from "@/router";
import {reqSearchFriend, reqSearchGroup} from "@/api/contact.js";
//创建用户小仓库
const useUserStore = defineStore("User", {
  state: () => {
    return {
      //用户信息
      id: 0,
      //用户名称
      name: "",
      //用户头像
      avatar: "",
      //默认地址
      baseUrl: `${import.meta.env.VITE_BASE_PATH}:${import.meta.env.VITE_SERVER_PORT}/`,
      //用户token
      token: GET_TOKEN(),
      //用户路由
      menuRoutes: constRoute,
      //用户当前页
      title: "",
      //websocket连接
      socket: null,
      //消息列表
      msgList: {},
      //好友列表
      friendList: [],
      //群组列表
      groupList: [],
      //头像列表
      avatarList: {}
    }
  },
  //异步|逻辑的地方
  actions: {
    //设置token
    setToken(token, expires) {
      SET_TOKEN(token, expires);
      this.token = token;
    },
    //用户登录的方法
    async userLogin(data) {
      //登录请求
      const result = await reqLogin(data);
      if (result.code === 0) {
        this.token = result.data.token;
        //本地存储一份
        this.setToken(result.data.token, result.data.expiresAt);
        return result.msg;
      } else {
        return Promise.reject(result.msg);
      }
    },
    //获取用户信息方法
    async userInfo() {
      //获取用户信息进行存储仓库当中[用户头像、名字]
      const result = await reqUserInfo();
      if (result.code === 0) {
        this.id = result.data.id;
        this.name = result.data.name;
        this.avatar = result.data.avatar;
        this.avatarList[`user_${result.data.id}`] = this.avatar;
        this.menuRoutes[2].children.push(...cloneDeep(asyncRoute), anyRoute);
        this.menuRoutes.push(...cloneDeep(highRoute));
        this.menuRoutes.forEach((route) => {
          router.addRoute(route);
        });
        const url = `${this.baseUrl}chat?Authorization=${this.token}`.replace("http://", "ws://").replace("https://", "wss://");
        this.initWebScoket(url);
        setInterval(() => {
          this.heartBeat();
        },1000*2)
        return "ok";
      } else {
        //清除仓库及本地存储
        this.clearStorage();
        return Promise.reject(new Error(result.msg));
      }
    },
    //获取好友列表
    async getFriendList() {
      const result = await reqSearchFriend();
      if (result.code === 0) {
        this.friendList = result.data.list;
        this.friendList.forEach((item) => {
          this.avatarList[`user_${item.id}`] = item.avatar;
        });
        return "ok";
      } else {
        return Promise.reject(new Error(result.msg));
      }
    },
    //获取群列表
    async getGroupList() {
      const result = await reqSearchGroup();
      if (result.code === 0) {
        this.groupList = result.data.list;
        return "ok";
      } else {
        return Promise.reject(new Error(result.msg));
      }
    },
    //获取群列表
    async getGroupUserList(data) {
      const result = await reqGetGroupUserList(data);
      if (result.code === 0) {
        result.data.list?.forEach((item) => {
          this.avatarList[`user_${item.id}`] = item.avatar;
        });
        return "ok";
      } else {
        return Promise.reject(new Error(result.msg));
      }
    },
    //清除仓库及本地存储
    clearStorage() {
      REMOVE_TOKEN();
      this.id = 0;
      this.name = "";
      this.token = "";
      this.avatar = "";
      this.title = "";
      this.menuRoutes = constRoute;
      this.socket = null;
    },
    //退出登录
    async userLogout() {
      const result = await reqLogout();
      if (result.code === 0) {
        //清除仓库及本地存储
        this.clearStorage();
        return "ok";
      } else {
        //清除仓库及本地存储
        this.clearStorage();
        return Promise.reject(new Error(result.msg));
      }
    },
    //初始化websocket
    initWebScoket(url = "") {
      // 正在连接或连接成功
      if (this.socket && (this.socket?.readyState < 2)) {
        return
      }
      this.socket = new WebSocket(url) // 创建对象
      this.socket.onerror = this.webSocketOnError; // 连接错误处理
      this.socket.onclose = this.closeWebsocket; // 连接关闭处理
      this.socket.onopen = this.openWebsocket; // 连接打开处理
      this.socket.onmessage = (e) => {
        if (e.data.indexOf("}") > -1) {
          const msg = JSON.parse(e.data);
          if (msg.type === 1) {
            this.addMsg(msg.userId, msg, 'single');
          } else {
            this.addMsg(msg.targetId, msg, 'group');
          }
        }
        return e
      }; // 接收处理
    },
    //websocket连接打开回调
    openWebsocket() {
      console.log("WebSocket连接打开...");
    },
    //websocket连接关闭回调
    closeWebsocket() {
      console.log("您已自动下线")
      // this.initWebScoket();
    },
    //websocket连接错误回调
    webSocketOnError(e) {
      console.log("WebSocket连接发生错误...", e);
      this.initWebScoket();
    },
    //添加消息
    addMsg(id, msg, mold) {
      if (!this.msgList[`${mold}-${id}`]) {
        this.msgList[`${mold}-${id}`] = [];
      }
      this.msgList[`${mold}-${id}`].push(msg);
    },
    //心跳
    heartBeat() {
      console.log("心跳");
      const msg = {
        userId: this.id,
        targetId: -1,
        type: -1,
        media: -1,
        content: "心跳",
      }
      this.socket.send(JSON.stringify(msg));
    },
  }
});

//对外暴露获取小仓库
export default useUserStore;