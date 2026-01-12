<template>
  <div class="w-full h-full flex flex-col bg-white">
    <div
      class="h-12 w-full border-b-3 border-b-black bg-linear-90 from-from via-via to-to flex items-center justify-between p-3 font-bold"
    >
      <h2 class="text-2xl">{{ user.username }}</h2>
      <button class="text-2xl" @click="handleVideoChat">
        <i-pixelarticons:video class="cursor-pointer" />
      </button>
    </div>

    <div
      class="grow overflow-y-auto scrollbar"
      ref="messageContainer"
      @scroll="handleScroll"
    >
      <div v-show="!isInit && isMore" class="flex justify-center text-2xl py-5">
        <i-svg-spinners:12-dots-scale-rotate />
      </div>
      <MessageItem
        v-for="message in messageHistory"
        :key="message.id"
        :message="message"
        :show-name="false"
      />
    </div>

    <div class="w-full border-t-3 border-t-black bg-gray-200 p-4">
      <div class="flex gap-3">
        <PixelInput
          v-model="textingMessage"
          placeholder="输入消息...."
          @keyup.enter="sendMessage"
        />
        <PixelButton color="bg-via" @click="sendMessage">
          <div class="px-5 text-2xl text-white">
            <i-pixel-plane-solid />
          </div>
        </PixelButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, nextTick, useTemplateRef } from "vue";
import type { ChannelMessage, DirectMessage } from "@/types/chat";
import type { User } from "@/types/entities";
import type { Ref } from "vue";
import { useRouter } from "vue-router";

interface DirectMessageChatAreaProps {
  messageHistory: Array<DirectMessage | ChannelMessage>;
  isMore: boolean;
  isLoading: boolean;
  isInit: boolean;
}

const props = defineProps<DirectMessageChatAreaProps>();
const emits = defineEmits<{
  (e: "sendMessage", message: string): void;
  (e: "loadMessageHistory"): void;
}>();

const router = useRouter();
const textingMessage = ref<string>("");
const messageContainer = useTemplateRef("messageContainer");
const user = inject<Ref<User>>("chosenUser")!;

const loadMore = () => {
  emits("loadMessageHistory");
};

const handleVideoChat = () => {
  console.log("user info", user);
  router.push({
    path: "/video-chat",
    query: {
      userId: user.value.id,
      username: user.value.username,
      userAvatar: user.value.userAvatar || "",
    },
  });
};

const handleScroll = (event: Event) => {
  const target = event.target as HTMLElement;
  if (!target) return;
  const reachTop = target.scrollTop <= 10;
  if (reachTop && !props.isInit && !props.isLoading && props.isMore) {
    loadMore();
  }
};

const scrollToBottom = async (isSmooth: boolean = false) => {
  await nextTick();
  if (!messageContainer.value) return;

  messageContainer.value.scrollTo({
    top: messageContainer.value.scrollHeight,
    behavior: isSmooth ? "smooth" : "instant",
  });
};

const sendMessage = () => {
  emits("sendMessage", textingMessage.value);
};

const clearInput = () => {
  textingMessage.value = "";
};

defineExpose({
  clearInput,
  scrollToBottom,
  getContainer: () => messageContainer.value,
});
</script>
<style scoped></style>
