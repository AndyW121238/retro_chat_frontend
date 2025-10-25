<template>
  <div class="relative" :class="className">
    <div class="absolute inset-1 w-full h-full bg-black z-0"></div>
    <div
      class="relative w-full h-full border-2 border-black z-10 transition-colors"
      :class="[color]"
    >
      <button class="relative z-20 w-full cursor-pointer" v-bind="$attrs">
        <slot></slot>
      </button>
    </div>
  </div>
</template>
<script lang="ts" setup>
interface PixelButtonProps {
  color: string;
  className?: string;
}
defineOptions({
  inheritAttrs: false,
});

defineProps<PixelButtonProps>();
</script>
<style scoped></style>
