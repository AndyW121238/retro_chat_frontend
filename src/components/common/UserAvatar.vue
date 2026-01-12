<template>
  <div class="w-full h-full bg-via">
    <img
      :src="avatar"
      :alt="username"
      class="block h-full w-full dark:bg-slate-800"
    />
  </div>
</template>
<script lang="ts" setup>
import { computed } from "vue";
interface UserAvatarProps {
  username: string;
  avatar: string;
}
const props = defineProps<UserAvatarProps>();

const avatar = computed(() => props.avatar);
</script>
<style scoped></style>
