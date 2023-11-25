//对外暴露配置路由
export const constRoute = [
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    name: "Login",
    meta: {
      title: "登录", //菜单标题
    }
  },
  {
    path: "/register",
    component: () => import("@/views/register/index.vue"),
    name: "Register",
    meta: {
      title: "注册", //菜单标题
    }
  },
  {
    path: "/",
    component: () => import("@/layout/index.vue"),
    name: "Layout",
    meta: {
      title: "",
    },
    redirect: "/contacts",
    children: []
  },
];

export const asyncRoute = [
  {
    path: "/contacts",
    name: "ChatContacts",
    component: () => import("@/views/contacts/index.vue"),
    meta: {
      title: "联系人",
    }
  },
  {
    path: "/group",
    name: "ChatGroup",
    component: () => import("@/views/group/index.vue"),
    meta: {
      title: "群聊",
    }
  },
  {
    path: "/personal",
    name: "ChatPersonal",
    component: () => import("@/views/personal/index.vue"),
    meta: {
      title: "个人中心",
    }
  }
]

export const anyRoute = {
  path: "/:pathMatch(.*)*",
  redirect: "/",
  meta: {
    title: "任意路由",
  }
};

export const highRoute = [
  {
    path: "/chat",
    name: "Chat",
    component: () => import("@/views/chat/index.vue"),
    meta: {
      title: "聊天",
    }
  },
  {
    path: "/personalInfo",
    name: "PersonalInfo",
    component: () => import("@/views/personal_info/index.vue"),
    meta: {
      title: "个人信息",
    }
  }
]