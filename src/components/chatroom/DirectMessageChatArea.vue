<template>
  <div class="w-full h-full flex flex-col bg-white">
    <div
      class="h-12 w-full border-b-3 border-b-black bg-linear-90 from-from via-via to-to flex items-center p-3 font-bold"
    >
      <h2 class="text-2xl">{{ user.username }}</h2>
    </div>

    <div class="grow overflow-y-auto scrollbar" ref="messageContainer">
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
import { ref, inject, nextTick, useTemplateRef, watch } from "vue";
import type { ChannelMessage, DirectMessage } from "@/types/chat";
import type { User } from "@/types/entities";

interface DirectMessageChatAreaProps {
  messageHistory: Array<DirectMessage | ChannelMessage>;
}

const props = defineProps<DirectMessageChatAreaProps>();
const emits = defineEmits<{
  (e: "sendMessage", message: string): void;
}>();

const textingMessage = ref<string>("");
const messageContainer = useTemplateRef("messageContainer");

const user = inject<User>("chosenUser")!;

const scrollToBottom = async () => {
  await nextTick();
  if (!messageContainer.value) return;

  messageContainer.value.scrollTo({
    top: messageContainer.value.scrollHeight,
    behavior: "smooth",
  });
};

watch(
  () => props.messageHistory,
  () => {
    scrollToBottom();
  },
  { deep: true }
);

const sendMessage = () => {
  emits("sendMessage", textingMessage.value);
};

const clearInput = () => {
  textingMessage.value = "";
};

defineExpose({
  clearInput,
});
</script>
<style scoped></style>
