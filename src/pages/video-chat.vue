<template>
  <div
    class="w-full h-screen overflow-x-hidden bg-linear-45 from-to via-via to-from flex flex-col"
  >
    <div
      class="w-full h-15 bg-linear-to-r from-from via-via to-to flex items-center px-10 text-white border-4 border-black"
    >
      <div class="flex items-center gap-x-4">
        <i-pixelarticons:video class="text-2xl" />
        <h1 class="text-xl">视频通话</h1>
      </div>
    </div>

    <!-- Video Area -->
    <div class="grow flex min-h-0 p-10 gap-x-5">
      <div class="grow w-full h-full bg-white border-4 border-black">
        <video
          ref="myCamera"
          class="block w-full h-full object-contain bg-via"
          autoplay
          playsinline
          muted
        ></video>
      </div>
      <div class="grow w-full h-full bg-white border-4 border-black relative">
        <video
          ref="friendCamera"
          class="block w-full h-full object-contain bg-via"
          autoplay
          playsinline
          muted
          v-show="callStatus === 'connected'"
        ></video>
        <!-- 呼叫中状态 -->
        <div
          v-if="callStatus === 'calling'"
          class="w-full h-full flex flex-col items-center justify-center bg-via relative overflow-hidden"
        >
          <!-- 用户头像 -->
          <div
            v-if="targetUser"
            class="relative z-10 w-32 h-32 border-4 border-black bg-white rounded-full overflow-hidden mb-6"
          >
            <UserAvatar
              :username="targetUser.username"
              :avatar="targetUser.userAvatar"
            />
          </div>
          <div
            v-else
            class="relative z-10 w-32 h-32 border-4 border-black bg-white rounded-full flex items-center justify-center mb-6"
          >
            <i-pixelarticons:user class="text-6xl text-gray-600" />
          </div>
          <!-- 呼叫文本 -->
          <div class="relative z-10 text-center">
            <p class="text-2xl font-bold mb-2">
              {{
                targetUser
                  ? `正在呼叫 ${targetUser.username}...`
                  : "正在呼叫..."
              }}
            </p>
            <p class="text-lg text-gray-700">等待对方接听</p>
          </div>
        </div>
      </div>
    </div>

    <!-- footer -->
    <div
      class="h-30 border-4 border-black bg-linear-to-r from-[#482ced] to-via flex items-center justify-center gap-x-5"
    >
      <ShadowButton class="aspect-square w-15">
        <div class="w-full h-full flex justify-center items-center">
          <i-iconamoon:microphone-light class="text-2xl" />
        </div>
      </ShadowButton>
      <ShadowButton
        class="aspect-square w-15"
        color="bg-red-600"
        @click="handleStopVideo"
      >
        <div class="w-full h-full flex justify-center items-center">
          <i-hugeicons:call-end-04 class="text-2xl text-white" />
        </div>
      </ShadowButton>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useTemplateRef, ref, onMounted, computed, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { User } from "@/types/entities";
import UserAvatar from "@/components/common/UserAvatar.vue";
import { useStompStore } from "@/store/stompStore";
import { launchVideoCall } from "@/api/chatroom";

type CallStatus = "calling" | "connected" | "idle";

const route = useRoute();
const router = useRouter();
const stompStore = useStompStore();
const myCameraRef = useTemplateRef("myCamera");
// 对方摄像头引用，用于 WebRTC 连接后设置视频流
// 暂时注释掉，等 WebRTC 连接实现后再启用
// const friendCameraRef = useTemplateRef("friendCamera");

// 从路由参数获取目标用户信息
const targetUser = computed<User | null>(() => {
  const userId = route.query.userId as string;
  const username = route.query.username as string;
  const userAvatar = route.query.userAvatar as string;

  if (!userId || !username) {
    return null;
  }

  return {
    id: userId,
    username: username,
    email: "",
    userAvatar: userAvatar || "",
  };
});

// 呼叫状态
const callStatus = ref<CallStatus>("calling");

// 保存订阅回调引用，用于取消订阅
let videoCallCallback: ((message: any) => void) | null = null;
let videoCallResultCallback: ((message: any) => void) | null = null;

// 保存媒体流对象，用于后续关闭摄像头
let mediaStream = ref<MediaStream | null>(null);

const handleStopVideo = () => {
  router.push("/chatroom");
};

const startCamera = async () => {
  try {
    mediaStream.value = await navigator.mediaDevices.getUserMedia({
      video: { width: 480, height: 480 },
    });

    if (myCameraRef.value) {
      myCameraRef.value.srcObject = mediaStream.value;
    }
  } catch (error) {
    console.error("获取摄像头流失败：", error);
    alert("无法访问摄像头，请确认已授权并连接设备");
  }
};

onMounted(async () => {
  startCamera();
  if (!targetUser.value) {
    console.warn("未找到目标用户信息，请从聊天页面发起视频通话");
    return router.push("/chatroom");
  }

  // 确保 Stomp 连接已建立
  try {
    await stompStore.connect();

    // 定义回调函数，便于后续取消订阅时使用
    videoCallCallback = (message: any) => {
      console.log("视频通话消息订阅callback", message);
      // TODO: 处理视频通话消息
      // 有人向我打我电话，客户端需要做出处理
    };

    videoCallResultCallback = (message: any) => {
      console.log("视频通话结果订阅callback", message);
      // TODO: 处理视频通话结果
      // 例如：对方接听、拒绝等状态更新
      // 获取对方接听的结果，拒绝就关闭通话，接听就开始建立webRTC
      // callStatus.value = message.status;
    };

    // 订阅视频通话相关消息
    await stompStore.subscribe("/user/queue/video", videoCallCallback);

    await stompStore.subscribe("/app/video/call", videoCallResultCallback);
  } catch (error) {
    console.error("Stomp连接失败", error);
  }

  // 发起 视频通话http 请求
  const result = await launchVideoCall(targetUser.value?.id);
  console.log(result);
});

onUnmounted(() => {
  console.log("挂断电话");
  // 取消订阅（只移除当前页面的回调）
  if (videoCallCallback) {
    stompStore.unsubscribe("/user/queue/video", videoCallCallback);
  }
  if (videoCallResultCallback) {
    stompStore.unsubscribe("/app/video/call", videoCallResultCallback);
  }
  // 注意：这里不调用 disconnect()，因为我们希望连接保持活跃供其他页面使用
});
</script>
<style scoped></style>
