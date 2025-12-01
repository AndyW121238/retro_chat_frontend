<template>
  <div
    class="w-full flex gap-x-2 p-3"
    :class="{
      'flex-row-reverse': isSelfMessage,
    }"
  >
    <div class="w-10 h-10 border-2 shrink-0">
      <UserAvatar
        :username="isSelfMessage ? userStore.userInfo?.username! : user.username"
      />
    </div>
    <div
      class="w-full flex flex-col"
      :class="{
        'items-end': isSelfMessage,
      }"
    >
      <p v-if="showName" class="text-sm text-gray-400">
        {{ message.senderName }}
      </p>
      <div
        class="h-fit min-h-10 flex w-fit max-w-5/12 items-center gap-2"
        :class="{ 'flex-row-reverse': isSelfMessage }"
      >
        <PixelCard>
          <p class="px-2 h-full flex items-center">
            {{ message.content }}
          </p>
        </PixelCard>
        <span v-show="isSelfMessage && message.status === 'pending'">
          <i-eos-icons:bubble-loading />
        </span>
        <span
          v-show="isSelfMessage && message.status === 'failed'"
          class="text-red-500"
        >
          <i-pixelarticons:warning-box />
        </span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { DirectMessage, ChannelMessage } from "@/types/chat";
import type { User } from "@/types/entities";
import { computed, inject, watch } from "vue";
import { useUserStore } from "@/store/userStore";

const props = withDefaults(
  defineProps<{
    message: DirectMessage | ChannelMessage;
    showName?: boolean;
  }>(),
  {
    showName: true,
  }
);

watch(
  () => props.message,
  () => {
    console.log("props.message变化了");
  },
  {
    deep: true,
  }
);

const userStore = useUserStore();
const user = inject<User>("chosenUser")!;
const isSelfMessage = computed(() => {
  return userStore.userInfo?.id === props.message.senderId;
});
</script>
<style scoped></style>
