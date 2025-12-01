<template>
  <ChatroomLayout>
    <!-- header -->
    <template #header>
      <div class="h-full flex items-center justify-between p-2">
        <h1 class="font-bold text-xl">Retro Chat</h1>
        <div class="flex">
          <router-link to="/" class="block">
            <PixelButton class="h-full" color="bg-via" :shadow="false">
              <div class="h-full px-1 flex justify-center items-center">
                <i-pixelarticons-logout />
              </div>
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
                    CHANNELS
                  </PixelButton>
                  <PixelButton
                    @click="changeMode('DM')"
                    class="w-6/12"
                    :color="
                      leftSideMode === 'DM' ? 'bg-yellow-300' : 'bg-gray-300'
                    "
                    :shadow="false"
                  >
                    DMs
                  </PixelButton>
                </div>
              </PixelCard>
            </div>

            <PixelCard :shadow="false">
              <keep-alive>
                <component
                  :is="leftSideComponent"
                  :list="directMessageUserList"
                  @choose-user="handleChooseUser"
                ></component>
              </keep-alive>
            </PixelCard>
          </div>
        </div>

        <!-- middle section -->
        <div class="w-8/12 px-2 h-full">
          <PixelCard>
            <DirectMessageChatArea
              ref="charArea"
              v-if="chosenUser"
              :message-history="messageHistory"
              @send-message="handleSendMessage"
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
          <PixelCard :shadow="false">右侧烂</PixelCard>
        </div>
      </div>
    </template>
  </ChatroomLayout>
</template>
<script lang="ts" setup>
import type { Client as ClientType, StompSubscription } from "@stomp/stompjs";
import type { DirectMessage, DirectMessageUser } from "@/types/chat";
import type { SendMessageRequest } from "@/api/chatroom";
import {
  ref,
  computed,
  onMounted,
  provide,
  onUnmounted,
  useTemplateRef,
} from "vue";
import { useUserStore } from "@/store/userStore";
import { Client } from "@stomp/stompjs";
import {
  getChatHistoryApi,
  getDMsListApi,
  sendDirectMessageApi,
} from "@/api/chatroom";
import ChannelList from "@/components/chatroom/ChannelList.vue";
import DirectMessageList from "@/components/chatroom/DirectMessageList.vue";

type Mode = "channels" | "DM";

const userStore = useUserStore();
const leftSideMode = ref<Mode>("DM");
const directMessageUserList = ref<Array<DirectMessageUser>>([]);
const chosenUser = ref<DirectMessageUser | null>(null);
const messageHistory = ref<Array<DirectMessage>>([]);
const client = ref<ClientType | null>(null);
const DMSubscription = ref<StompSubscription | null>(null);
const chatArea = useTemplateRef("charArea");

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
  } catch (err) {
    const targetMessaeg = messageHistory.value.find((m) => m.id === tempId)!;
    targetMessaeg.status = "failed";
    console.log(err);
  }
};

// 用户切换聊天模式
const changeMode = (newMode: Mode) => {
  leftSideMode.value = newMode;
};

const handleChooseUser = (user: DirectMessageUser) => {
  chosenUser.value = user;
  fetchChatHistory();
};

// 获取当前聊天的聊天记录
const fetchChatHistory = async () => {
  const result = await getChatHistoryApi(chosenUser.value?.roomId!);
  messageHistory.value = result.map(
    ({ id, content, timestamp, senderId, senderName }) => ({
      id,
      content,
      timestamp,
      senderId,
      senderName,
    })
  );
};

onMounted(async () => {
  const result = await getDMsListApi();

  directMessageUserList.value = result.map(
    ({ id, username, email, userAvatar, lastMessageContent, roomId }) => ({
      id,
      username,
      email,
      userAvatar,
      lastMessageContent,
      roomId,
    })
  );

  // 与后端建立 stomp 连接
  client.value = new Client({
    brokerURL: `/ws/chat-ws?Authorization=${localStorage.getItem("token")}`,
    connectHeaders: {
      Authorization: localStorage.getItem("token")!,
    },
  });
  client.value.onConnect = (frame) => {
    console.log("Stomp连接成功", frame);
    // 订阅私聊消息
    DMSubscription.value = client.value?.subscribe(
      "/user/queue/private",
      (frame) => {
        console.log("私聊消息订阅callback", JSON.parse(frame.body));
        const receivedMessage = JSON.parse(frame.body) as DirectMessage;
        if (receivedMessage.senderId === chosenUser.value?.id) {
          messageHistory.value.push(receivedMessage);
        } else {
          // todo: 显示在左侧栏目中
        }
      }
    )!;
    console.log("订阅所有私聊消息成功");

    // todo：订阅群聊消息
  };
  client.value.activate();
});

onUnmounted(() => {
  DMSubscription.value!.unsubscribe();
});
</script>
<style scoped></style>
