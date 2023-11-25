import request from "@/utils/request";

// 登录
export const reqLogin = (data) => {
  return request({
    url: "/user/login",
    method: "post",
    data,
  });
}
// 退出登录
export const reqLogout = (data) => {
  return request({
    url: "/user/logout",
    method: "post",
    data,
  });
}
// 注册
export const reqRegister = (data) => {
  return request({
    url: "/user/createUser",
    method: "post",
    data,
  });
}
// 获取用户信息
export const reqUserInfo = () => {
  return request({
    url: "/user/getUserInfo",
    method: "get",
  });
}
// 上传文件
export const reqUpload = (data) => {
  return request({
    url: "/user/upload",
    method: "post",
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  });
}
// 获取历史消息列表
export const reqGetRedisMsgList = (data) => {
  return request({
    url: "/user/getRedisMsgList",
    method: "post",
    data,
  });
}
// 更新用户信息
export const reqUpdateUser = (data) => {
  return request({
    url: "/user/updateUser",
    method: "post",
    data,
  });
}
// 获取群人员列表
export const reqGetGroupUserList = (data) => {
  return request({
    url: "/user/getGroupUserList",
    method: "post",
    data,
  });
}