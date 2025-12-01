<template>
  <div>
    <img
      :src="avatar"
      :alt="username"
      class="block h-auto w-full max-w-full bg-gray-100 dark:bg-slate-800"
    />
    <slot />
  </div>
</template>
<script lang="ts" setup>
import { computed } from "vue";
interface UserAvatarProps {
  username: string;
  avatar?: string;
}
const props = defineProps<UserAvatarProps>();

const avatar = computed(
  () =>
    props.avatar ??
    `https://api.dicebear.com/9.x/pixel-art/svg?seed=${props.username.replace(
      /[^a-z0-9]+/gi,
      "-"
    )}`
);
</script>
<style scoped></style>
