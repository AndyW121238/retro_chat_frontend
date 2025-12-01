<template>
  <div class="relative" :class="$attrs.class">
    <div
      v-show="shadow"
      class="absolute inset-1 w-full h-full bg-black z-0"
    ></div>
    <div
      class="relative w-full h-full border-2 border-black z-10 transition-colors"
      :class="[color]"
    >
      <button
        class="relative z-20 w-full h-full cursor-pointer"
        v-bind="buttonAtrtrs"
      >
        <slot v-if="!loading"></slot>
        <i-eos-icons:bubble-loading v-else />
      </button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, useAttrs } from "vue";

interface PixelButtonProps {
  color: string;
  shadow?: boolean;
  loading?: boolean;
}

withDefaults(defineProps<PixelButtonProps>(), {
  shadow: true,
  loading: false,
});

defineOptions({
  inheritAttrs: false,
});

const attrs = useAttrs();

const buttonAtrtrs = computed(() => {
  const { class: _c, ...rest } = attrs;
  return rest;
});
</script>
<style scoped></style>
