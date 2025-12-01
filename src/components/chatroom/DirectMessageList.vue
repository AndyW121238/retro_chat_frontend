<template>
  <div class="h-full flex flex-col min-h-0">
    <header
      class="h-8 bg-via flex items-center gap-x-1 text-md px-3 border-b-3"
    >
      <i-pixelarticons-message />
      <h2>DMs</h2>
    </header>
    <ul class="p-2 flex flex-col gap-y-2 flex-1 overflow-auto">
      <li
        v-for="user in list"
        :key="user.id"
        class="cursor-pointer"
        @click="handleChooseUser(user)"
      >
        <PixelCard
          :shadow="false"
          :class="[user.id === chosenUserId ? 'bg-yellow-300' : '']"
        >
          <div class="h-16 flex items-center gap-x-2 p-2">
            <div class="h-full aspect-square border-2">
              <UserAvatar :username="user.username" />
            </div>
            <div class="h-full flex flex-col grow justify-between">
              <p>{{ user.username }}</p>
              <p class="text-gray-400 text-sm">{{ user.lastMessageContent }}</p>
            </div>
          </div>
        </PixelCard>
      </li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import type { DirectMessageUser } from "@/types/chat";

interface DirectMessageListProps {
  list: Array<DirectMessageUser>;
}

defineProps<DirectMessageListProps>();
const emits = defineEmits<{
  (e: "chooseUser", user: DirectMessageUser): void;
}>();
const chosenUserId = ref<string | null>(null);

const handleChooseUser = (user: DirectMessageUser) => {
  emits("chooseUser", user);
  chosenUserId.value = user.id;
};
</script>
<style scoped></style>
