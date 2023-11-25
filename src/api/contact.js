import request from "@/utils/request";

// 获取好友列表
export const reqSearchFriend = () => {
  return request({
    url: "/contact/searchFriend",
    method: "get",
  });
}
// 添加好友
export const reqAddFriend = (data) => {
  return request({
    url: "/contact/addFriend",
    method: "post",
    data,
  });
}
// 获取群列表
export const reqSearchGroup = () => {
  return request({
    url: "/contact/searchGroup",
    method: "get",
  });
}
// 添加群
export const reqAddGroup = (data) => {
  return request({
    url: "/contact/addGroup",
    method: "post",
    data,
  });
}
// 创建群
export const reqCreateGroup = (data) => {
  return request({
    url: "/contact/createGroup",
    method: "post",
    data,
  });
}