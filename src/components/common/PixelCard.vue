<template>
  <div class="w-full h-full relative">
    <div class="absolute inset-1.5 w-full h-full bg-black z-0"></div>
    <div class="relative w-full h-full bg-white border-4 border-black z-10">
      <div class="relative z-20">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped></style>
