<template>
  <div class="w-full h-12 bg-white border-3 border-black">
    <input
      class="w-full h-full px-3 bg-transparent border-0 outline-none text-black focus:outline-none placeholder:text-gray-500 placeholder:text-lg"
      v-bind="inputAtrtrs"
      v-model="modelValue"
    />
  </div>
</template>
<script lang="ts" setup>
import { computed, useAttrs } from "vue";

defineOptions({
  inheritAttrs: false,
});

const modelValue = defineModel();
const attrs = useAttrs();

const inputAtrtrs = computed(() => {
  const { class: _c, ...rest } = attrs;
  return rest;
});
</script>
<style scoped></style>
