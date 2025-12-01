<template>
  <div class="w-full h-full relative">
    <div
      v-show="shadow"
      class="absolute inset-1 w-full h-full bg-black z-0"
    ></div>
    <div class="relative w-full h-full border-4 border-black z-10">
      <div class="relative z-20 h-full bg-white" v-bind="$attrs">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface PixelCardProps {
  shadow?: boolean;
}

defineOptions({
  inheritAttrs: false,
});

withDefaults(defineProps<PixelCardProps>(), {
  shadow: true,
});
</script>

<style scoped></style>
