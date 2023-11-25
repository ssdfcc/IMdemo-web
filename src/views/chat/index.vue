<template>
  <van-nav-bar left-arrow :title="userStore.title" fixed placeholder @click-left="onClickLeft"/>
  <div class="h-[calc(100vh-96px)]">
    <section id="d1" class="h-[calc(100vh-96px)] overflow-y-scroll">
      <div v-if="isHistory" class="flex justify-center items-center text-sm text-gray-400 mt-1">
        <span @click="getMsgList">点击加载更多</span>
      </div>
      <div v-else class="flex justify-center items-center text-sm text-gray-400 mt-1">
        <span>没有更多了</span>
      </div>
      <div v-for="item in userStore.msgList[`${mold}-${id}`]" key="item">
        <div :class="item.userId !== userStore.id ? 'chat chat-start' : 'chat chat-end'">
          <div class="chat-image avatar">
            <div class="w-10 rounded-full">
              <img :src="userStore.baseUrl+userStore.avatarList[`user_${item.userId}`]" alt=""/>
            </div>
          </div>
          <div :class="item.userId !== userStore.id ? 'chat-bubble bg-white text-black' : 'chat-bubble bg-[#89d961] text-black'">
            <div v-if="item.media === 1" class="break-words">
              {{ item.content }}
            </div>
            <img class="max-w-[200px] max-h-[200px]" v-if="item.media === 2" :src="item.url" alt=""/>
            <img class="max-w-[200px] max-h-[200px]" v-if="item.media === 3" :src="userStore.baseUrl+item.url" alt=""/>
            <div v-if="item.media === 4">
              <img class="w-10 h-10 mr-4" src="@/assets/audiom.png" alt=""  @click="handlePlay"/>
              <span v-text="item.amount+'s'" class="absolute inset-y-1/3 right-1 " />
              <audio controls style="display: none;">
                <source :src="userStore.baseUrl+item.url"/>
              </audio>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
  <van-tabbar fixed class="flex items-center">
    <img src="@/assets/kbord.png" class="h-10 mx-1" alt="" v-if="isVoice" @click="isVoice=false">
    <img src="@/assets/audio.png" class="h-10 mx-1" alt="" v-else @click="isVoice=true">
    <van-button type="default" class="w-full" v-if="isVoice" @touchstart="beginRecordAction" @touchend="stopRecordAction">请按住说话</van-button>
    <van-cell-group inset v-else class="w-full">
      <van-field v-model="data" autocomplete="off"/>
    </van-cell-group>
    <img src="@/assets/smile.png" class="h-10 mx-1" alt="" @click="showEmoji=true">
    <img src="@/assets/more.png" class="h-10 mr-1" v-if="data.length===0" alt="" @click="showMore=true">
    <img src="@/assets/send.png" class="h-10 mr-1" v-else alt="" @click="sendText">
  </van-tabbar>
  <!-- 底部表情列表弹出 -->
  <van-popup v-model:show="showEmoji" position="bottom" :style="{ height: '30%' }">
    <div class="flex flex-wrap">
      <div v-for="item in emoji.assets" :key="item" class="w-1/8 h-1/4 flex items-center justify-center"
           @click="sendEmoj(item)">
        <img :src="baseEmojiUrl+item" alt="" class="w-10 h-10"/>
      </div>
    </div>
  </van-popup>
  <!-- 底部更多功能弹出 -->
  <van-popup v-model:show="showMore" position="bottom" class="h-44">
    <div class="py-5 px-1.5 grid grid-cols-4 gap-4 text-center text-sm">
      <div class="flex justify-center">
        <van-uploader :before-read="beforeRead" :after-read="afterRead"
                      accept="image/jpeg, image/png, image/bmp, image/gif">
          <img src="/src/assets/upload.png" alt="" class="w-7 h-7"/>
          <p class="mt-2">照片</p>
        </van-uploader>
      </div>
      <div class="flex justify-center">
        <van-uploader :before-read="beforeRead" :after-read="afterRead" capture="camera"
                      accept="image/jpeg, image/png, image/bmp, image/gif">
          <img src="/src/assets/camera.png" alt="" class="w-7 h-7"/>
          <p class="mt-2">拍照</p>
        </van-uploader>
      </div>
      <div class="flex justify-center">
        <div>
          <img src="/src/assets/audiocall.png" alt="" class="w-7 h-7"/>
          <p class="mt-2">语音</p>
        </div>
      </div>
      <div class="flex justify-center">
        <div>
          <img src="/src/assets/videocall.png" alt="" class="w-7 h-7"/>
          <p class="mt-2">视频</p>
        </div>
      </div>
      <div class="flex justify-center">
        <div>
          <img src="/src/assets/redpackage.png" alt="" class="w-7 h-7"/>
          <p class="mt-2">红包</p>
        </div>
      </div>
      <div class="flex justify-center">
        <div>
          <img src="/src/assets/exchange.png" alt="" class="w-7 h-7"/>
          <p class="mt-2">转账</p>
        </div>
      </div>
      <div class="flex justify-center">
        <div>
          <img src="/src/assets/address.png" alt="" class="w-7 h-7"/>
          <p class="mt-2">位置</p>
        </div>
      </div>
      <div class="flex justify-center">
        <div>
          <img src="/src/assets/person.png" alt="" class="w-7 h-7"/>
          <p class="mt-2">名片</p>
        </div>
      </div>
    </div>
<!--    <van-grid square :border="false">-->
<!--      <van-grid-item>-->
<!--        <van-uploader :before-read="beforeRead" :after-read="afterRead"-->
<!--                      accept="image/jpeg, image/png, image/bmp, image/gif">-->
<!--          <img src="/src/assets/upload.png" alt="" class="w-7 h-7"/>-->
<!--          <p class="van-grid-item__text mt-2 text-center">照片</p>-->
<!--        </van-uploader>-->
<!--      </van-grid-item>-->
<!--      <van-grid-item class="!h-5">-->
<!--        <van-uploader :before-read="beforeRead" :after-read="afterRead" capture="camera"-->
<!--                      accept="image/jpeg, image/png, image/bmp, image/gif">-->
<!--          <img src="/src/assets/camera.png" alt="" class="w-7 h-7"/>-->
<!--          <p class="van-grid-item__text mt-2 text-center">拍照</p>-->
<!--        </van-uploader>-->
<!--      </van-grid-item>-->
<!--      <van-grid-item icon="/src/assets/audiocall.png" text="语音"/>-->
<!--      <van-grid-item icon="/src/assets/videocall.png" text="视频"/>-->
<!--      <van-grid-item icon="/src/assets/redpackage.png" text="红包"/>-->
<!--      <van-grid-item icon="/src/assets/exchange.png" text="转账"/>-->
<!--      <van-grid-item icon="/src/assets/address.png" text="地址"/>-->
<!--      <van-grid-item icon="/src/assets/person.png" text="名片"/>-->
<!--    </van-grid>-->
  </van-popup>
</template>

<script setup>
import useUserStore from "@/store/modules/user.js";
import {ref, watch, onMounted, nextTick, reactive} from "vue";
import {emoji} from "@/assets/doutu/emoj/info.js";
import {showFailToast} from "vant";
import {reqGetRedisMsgList, reqUpload} from "@/api/user.js";

const userStore = useUserStore();
const onClickLeft = () => history.back();
const data = ref('')
const id = history.state.id
const mold = history.state.mold
const isVoice = ref(false)
const showEmoji = ref(false)
const showMore = ref(false)
const baseEmojiUrl = '/src/assets/doutu/emoj/'
let recorder = ref({})
let reqData = {
  id: id,
  type: history.state.mold === 'single' ? 1 : 2,
  offset: 10,
}
// 是否有历史记录
const isHistory = ref(true)

const getMsgList = async () => {
  let msgListLength = userStore.msgList[`${mold}-${id}`].length
  if (msgListLength>=10) {
    reqData.offset = reqData.offset + msgListLength
  }
  const res = await reqGetRedisMsgList(reqData)
  if (res.code !== 0) {
    return
  }
  if (res.data.list === null) {
    isHistory.value = false
    return
  }
  if (res.data.list.length < 10) {
    isHistory.value = false
  }
  userStore.msgList[`${mold}-${id}`] = [...res.data.list,...userStore.msgList[`${mold}-${id}`]]
}

onMounted(()=>{
  if (userStore.msgList[`${mold}-${id}`] === undefined) {
    userStore.msgList[`${mold}-${id}`] = []
    getMsgList();
  }
  if (mold === "group") {
    userStore.getGroupUserList({id:id})
  }
})

document.oncontextmenu = function (e) {
  e.preventDefault();
}
// 发送文本
const sendText = () => {
  const textData = {
    userId: userStore.id,
    targetId: id,
    type: 1,
    media: 1,
    content: data.value,
  }
  if (mold === 'group') {
    textData.type = 2
  }
  userStore.socket.send(JSON.stringify(textData))
  if (mold === 'single') {
    userStore.addMsg(id, textData, mold)
  }
  data.value = ''
}
// 发送表情
const sendEmoj = (item) => {
  const emojData = {
    userId: userStore.id,
    targetId: id,
    type: 1,
    media: 2,
    url: baseEmojiUrl + item,
  }
  if (mold === 'group') {
    emojData.type = 2
  }
  userStore.socket.send(JSON.stringify(emojData))
  if (mold === 'single') {
    userStore.addMsg(id, emojData, mold)
  }
  showEmoji.value = false
}
userStore.title = mold === 'single' ? `和${history.state.name}聊天中` : history.state.name;
// 检查图片
const beforeRead = (file) => {
  const isJPG = file.type === "image/jpeg";
  const isPng = file.type === "image/png";
  const isBmp = file.type === "image/bmp";
  const isGif = file.type === "image/gif";
  if (!isJPG && !isPng && !isBmp && !isGif) {
    showFailToast('请上传图片类型的文件');
    return false;
  } else if (file.size / 1024 / 1024 > 5) {
    showFailToast("图片大小不能大于5MB!");
    return false;
  }
  return true;
}
// 上传图片消息
const afterRead = async (file) => {
  const formData = new FormData();
  formData.append("file", file.file);
  const res = await reqUpload(formData)
  if (res.code === 0) {
    const imgData = {
      userId: userStore.id,
      targetId: id,
      type: 1,
      media: 3,
      url: res.data.path,
    }
    if (mold === 'group') {
      imgData.type = 2
    }
    userStore.socket.send(JSON.stringify(imgData))
    if (mold === 'single') {
      userStore.addMsg(id, imgData, mold)
    }
  } else {
    showFailToast(res.msg)
  }
  showMore.value = false
}
// 录制语音消息
const beginRecordAction = () => {
  const startTime =Date.now();
  navigator.mediaDevices.getUserMedia({audio: true,video: false}).then((stream) => {
        recorder.value = new MediaRecorder(stream);
        recorder.value.start();
        recorder.value.ondataavailable = async (event) => {
          const amount = Math.floor((Date.now() - startTime) / 1000)
          const formData = new FormData();
          formData.append("file", event.data,`${Date.now()}.webm`);
          const res = await reqUpload(formData);
          if (res.code === 0) {
            const mediaData = {
              userId: userStore.id,
              targetId: id,
              type: 1,
              media: 4,
              url: res.data.path,
              amount: amount
            };
            if (mold === 'group') {
              mediaData.type = 2
            }
            userStore.socket.send(JSON.stringify(mediaData));
            if (mold === 'single') {
              userStore.addMsg(id, mediaData, mold);
            }
          } else {
            showFailToast(res.msg);
          }
          stream.getTracks().forEach((track) => {
            track.stop();
          });
        };
      }).catch((err) => {
        showFailToast("获取媒体设备失败");
      });
  console.log('开始录音');
};
// 停止录制语音消息
const stopRecordAction = async (e) => {
  recorder.value.stop();
  console.log('结束录音')
  e.preventDefault(); //阻止浏览器默认行为
}
const handlePlay = (event) => {
  console.log(event.target.nextElementSibling.nextElementSibling.play())
}
watch(() => userStore.msgList[`${mold}-${id}`]?.length, (newValue, oldValue) => {
  nextTick(() => {
    const scroll = document.getElementById('d1')
    scroll.scrollTop = scroll.scrollHeight
  })
}, {immdiate: true, deep: true})
</script>

<style lang="scss" scoped>
.van-field {
  padding: 5px 5px;

}

.van-cell-group--inset {
  margin: 0;
  border: 2px solid #ccc;

}

.van-grid-item__content {
  height: 10px !important;
}
.van-grid-item__content--center {
  align-items: flex-start !important;
}
</style>