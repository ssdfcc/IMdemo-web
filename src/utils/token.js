import Cookies from "js-cookie";
//封装本地存储数据与读取数据方法
export const TokenKey = "authorized-token";
export const SET_TOKEN = (token, expires) => {
  Cookies.set(TokenKey, token, {
    expires: (expires - Date.parse(new Date().toString()) / 1000) / 86400
  });
};
//本地存储获取数据
export const GET_TOKEN = () => {
  return Cookies.get(TokenKey);
};
//本地存储删除数据方法
export const REMOVE_TOKEN = () => {
  Cookies.remove(TokenKey);
};
