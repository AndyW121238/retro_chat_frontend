<template>
  <ChatroomLayout>
    <!-- header -->
    <template #header>
      <div class="h-full flex items-center justify-between p-2">
        <h1 class="font-bold text-xl">Retro Chat</h1>
        <div class="flex">
          <router-link to="/" class="block">
            <PixelButton color="bg-via" :shadow="false">
              <p>退出</p>
            </PixelButton>
          </router-link>
        </div>
      </div>
    </template>

    <!-- main section -->
    <template #default>
      <div class="h-full w-full flex">
        <!-- left section -->
        <div class="w-2/12">
          <div class="h-full flex flex-col gap-y-1">
            <div class="h-1/12">
              <PixelCard :shadow="false">
                <div class="flex gap-x-1 h-full p-1">
                  <PixelButton
                    @click="changeMode('channels')"
                    class="w-6/12"
                    :color="
                      leftSideMode === 'channels'
                        ? 'bg-yellow-300'
                        : 'bg-gray-300'
                    "
                    :shadow="false"
                  >
                    <p>群聊</p>
                  </PixelButton>
                  <PixelButton
                    @click="changeMode('DM')"
                    class="w-6/12"
                    :color="
                      leftSideMode === 'DM' ? 'bg-yellow-300' : 'bg-gray-300'
                    "
                    :shadow="false"
                  >
                    <p>私聊</p>
                  </PixelButton>
                </div>
              </PixelCard>
            </div>

            <PixelCard :shadow="false">
              <keep-alive>
                <component
                  :is="leftSideComponent"
                  :list="directMessageUserList || []"
                  @choose-user="handleChooseUser"
                ></component>
              </keep-alive>
            </PixelCard>
            <div class="h-fit">
              <PixelCard :shadow="false">
                <UserInfoPannel />
              </PixelCard>
            </div>
          </div>
        </div>

        <!-- middle section -->
        <div class="w-8/12 px-2 h-full">
          <PixelCard>
            <DirectMessageChatArea
              ref="chatArea"
              v-if="chosenUser"
              :message-history="messageHistory"
              :is-more="isMoreMessageHistory"
              :is-loading="isLoadingMessageHistory"
              :is-init="isInitFetchMessageHistory"
              @send-message="handleSendMessage"
              @load-message-history="handleLoadMoreMessageHistory"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center text-2xl text-gray-500"
            >
              请选择一个聊天开始
            </div>
          </PixelCard>
        </div>

        <!-- right section -->
        <div class="w-2/12">
          <PixelCard :shadow="false">右侧栏</PixelCard>
        </div>
      </div>
    </template>
  </ChatroomLayout>
</template>
<script lang="ts" setup>
import type { DirectMessage, DirectMessageUser } from "@/types/chat";
import type { SendMessageRequest } from "@/api/chatroom";
import {
  ref,
  computed,
  onMounted,
  provide,
  onUnmounted,
  useTemplateRef,
  nextTick,
} from "vue";
import { useUserStore } from "@/store/userStore";
import { useStompStore } from "@/store/stompStore";
import {
  getChatHistoryApi,
  getDMsListApi,
  sendDirectMessageApi,
} from "@/api/chatroom";
import ChannelList from "@/components/chatroom/ChannelList.vue";
import DirectMessageList from "@/components/chatroom/DirectMessageList.vue";

type Mode = "channels" | "DM";

defineOptions({
  name: "Chatroom",
});
const userStore = useUserStore();
const stompStore = useStompStore();
const leftSideMode = ref<Mode>("DM");
const directMessageUserList = ref<Array<DirectMessageUser>>([]);
const chosenUser = ref<DirectMessageUser | null>(null);
const messageHistory = ref<Array<DirectMessage>>([]);
const current = ref<number>(1);
const pageSize = ref<number>(40);
const isLoadingMessageHistory = ref<boolean>(false);
const isMoreMessageHistory = ref<boolean>(false);
const chatArea = useTemplateRef("chatArea");
const isInitFetchMessageHistory = ref<boolean>(true);

// 保存订阅回调引用，用于取消订阅
let privateMessageCallback: ((message: any) => void) | null = null;
let videoCallCallback: ((message: any) => void) | null = null;
let videoCallResultCallback: ((message: any) => void) | null = null;

const leftSideComponent = computed(() => {
  return leftSideMode.value === "channels" ? ChannelList : DirectMessageList;
});

provide("chosenUser", chosenUser);

// 用户发送消息
const handleSendMessage = async (message: string) => {
  const trimmedMessage = message.trim();
  if (!trimmedMessage || !chosenUser.value || !userStore.userInfo) {
    return;
  }

  chatArea.value?.clearInput();

  const tempId = `temp-${Date.now()}`;
  const optimisticMessage: DirectMessage = {
    id: tempId,
    content: trimmedMessage,
    timestamp: new Date().toISOString(),
    senderId: userStore.userInfo.id,
    senderName: userStore.userInfo.username,
    status: "pending",
  };
  messageHistory.value.push(optimisticMessage);
  chatArea.value!.scrollToBottom(true);

  const body: SendMessageRequest = {
    content: trimmedMessage,
    chatRoomId: chosenUser.value.roomId,
    receiverId: chosenUser.value.id,
    timestamp: Date.now().toString(),
    messageFormat: 1,
  };
  try {
    const result = await sendDirectMessageApi(body);
    const targetMessaeg = messageHistory.value.find((m) => m.id === tempId)!;
    targetMessaeg.id = result.id;
    targetMessaeg.timestamp = result.timestamp;
    targetMessaeg.status = "sent";

    const targetUser = directMessageUserList.value.find(
      (user) => user.id === chosenUser.value!.id
    );
    if (targetUser) {
      targetUser.lastMessageContent = targetMessaeg.content;
    }
  } catch (err) {
    const targetMessaeg = messageHistory.value.find((m) => m.id === tempId)!;
    targetMessaeg.status = "failed";
  }
};

// 用户切换聊天模式
const changeMode = (newMode: Mode) => {
  leftSideMode.value = newMode;
};

const handleChooseUser = async (user: DirectMessageUser) => {
  chosenUser.value = user;
  messageHistory.value = [];
  isInitFetchMessageHistory.value = true;
  current.value = 1;
  await fetchChatHistory();
  isInitFetchMessageHistory.value = false;
};

// 获取与选中好友的聊天记录
const fetchChatHistory = async () => {
  if (isLoadingMessageHistory.value) return;
  isLoadingMessageHistory.value = true;
  try {
    const result = await getChatHistoryApi(
      chosenUser.value?.roomId!,
      current.value,
      pageSize.value
    );
    messageHistory.value.unshift(
      ...result?.records.map(
        ({ id, content, timestamp, senderId, senderName }) => ({
          id,
          content,
          timestamp,
          senderId,
          senderName,
        })
      )
    );
    isMoreMessageHistory.value = !(
      messageHistory.value.length >= +result.totalRow
    );
    if (isInitFetchMessageHistory.value) {
      await chatArea.value?.scrollToBottom();
    }
  } finally {
    isLoadingMessageHistory.value = false;
  }
};

// 加载更多聊天记录
const handleLoadMoreMessageHistory = async () => {
  console.log("加载更多消息");
  const el = chatArea.value?.getContainer();
  const prevHeight = el?.scrollHeight ?? 0;
  const prevTop = el?.scrollTop ?? 0;
  current.value++;
  await fetchChatHistory();
  await nextTick();
  if (el) {
    const diff = el.scrollHeight - prevHeight;
    el.scrollTop = prevTop + diff;
  }
};

onMounted(async () => {
  const result = await getDMsListApi();
  directMessageUserList.value = result?.map(
    ({ id, username, email, userAvatar, lastMessageContent, roomId }) => ({
      id,
      username,
      email,
      userAvatar: userAvatar,
      lastMessageContent,
      roomId,
    })
  );

  // 与后端建立 stomp 连接
  try {
    await stompStore.connect();

    // 定义回调函数，便于后续取消订阅时使用
    privateMessageCallback = (receivedMessage: any) => {
      console.log("私聊消息订阅callback", receivedMessage);
      const message = receivedMessage as DirectMessage;
      messageHistory.value.push(message);
      const targetUser = directMessageUserList.value.find(
        (user) => user.id === message.senderId
      );
      if (targetUser) {
        targetUser.lastMessageContent = message.content;
      }
    };

    videoCallCallback = (message: any) => {
      console.log("视频通话消息订阅callback", message);
      console.log(message);
    };

    videoCallResultCallback = (message: any) => {
      console.log("视频通话结果订阅callback", message);
    };

    // 订阅私聊消息
    await stompStore.subscribe("/user/queue/private", privateMessageCallback);

    // 订阅视频通话消息
    await stompStore.subscribe("/user/queue/video", videoCallCallback);

    // 订阅视频通话结果
    await stompStore.subscribe("/app/video/call", videoCallResultCallback);
  } catch (error) {
    console.error("Stomp连接失败", error);
  }
});

onUnmounted(() => {
  // 取消订阅（只移除当前页面的回调）
  if (privateMessageCallback) {
    stompStore.unsubscribe("/user/queue/private", privateMessageCallback);
  }
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
