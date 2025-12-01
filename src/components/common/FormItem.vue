<template>
  <div>
    <p class="flex gap-x-2">
      <slot name="icon"></slot>
      <span>{{ label }}</span>
    </p>
    <slot></slot>
    <p
      class="text-red-500 text-sm"
      :class="{ 'opacity-100': errorMessage, 'opacity-0': !errorMessage }"
    >
      {{ errorMessage || "&nbsp;" }}
    </p>
  </div>
</template>
<script lang="ts" setup>
interface FormItemProps {
  label: string;
  errorMessage?: string;
}
defineProps<FormItemProps>();
</script>
<style scoped></style>
