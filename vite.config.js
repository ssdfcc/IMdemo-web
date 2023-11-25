import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  //获取各种环境下的对应的变量
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        "@": path.resolve("./src") // 相对路径别名配置，使用 @ 代替 src
      }
    },
    //代理
    server: {
      host: "0.0.0.0",
      proxy: {
        [env.VITE_APP_BASE_API]: {
          //获取数据的服务器地址设置
          target: `${env.VITE_BASE_PATH}:${env.VITE_SERVER_PORT}`,
          //需要代理跨域
          changeOrigin: true,
          //路径重写
          rewrite: (path) =>
              path.replace(new RegExp("^" + env.VITE_APP_BASE_API), "")
        }
      }
    }
  }
})
