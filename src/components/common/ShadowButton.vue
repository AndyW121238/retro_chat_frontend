<template>
  <div class="relative inline-block" :class="$attrs.class">
    <div class="absolute inset-1 w-full h-full bg-black z-0"></div>
    <div
      class="relative w-full h-full border-2 border-black z-10 transition-transform active:translate-x-1 active:translate-y-1"
      :class="color"
    >
      <button
        class="relative z-20 w-full h-full px-4 py-2 cursor-pointer text-black"
        :class="color"
        v-bind="buttonAttrs"
      >
        <slot></slot>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, useAttrs } from "vue";
interface ShadowButtonProps {
  color?: string;
}

defineOptions({
  inheritAttrs: false,
});

withDefaults(defineProps<ShadowButtonProps>(), {
  color: "bg-white",
});

const attrs = useAttrs();

const buttonAttrs = computed(() => {
  const { class: _c, ...rest } = attrs;
  return rest;
});
</script>

<style scoped></style>
