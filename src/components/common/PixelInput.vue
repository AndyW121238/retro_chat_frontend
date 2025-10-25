<template>
  <div class="w-full h-12 bg-white border-3 border-black">
    <input
      v-model="modelValue"
      class="w-full h-full px-3 bg-transparent border-0 outline-none text-black focus:outline-none placeholder:text-gray-500 placeholder:text-lg"
      v-bind="$attrs"
    />
  </div>
</template>
<script lang="ts" setup>
defineOptions({
  inheritAttrs: false,
});
const modelValue = defineModel();
</script>
<style scoped></style>
