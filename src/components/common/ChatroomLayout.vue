<template>
  <div
    class="h-screen w-screen p-3 transition-colors bg-linear-to-br from-from from-10% via-via via-30% to-to to-90% flex flex-col gap-y-3"
  >
    <header class="h-10">
      <PixelCard>
        <slot name="header"></slot>
      </PixelCard>
    </header>
    <main class="grow min-h-0">
      <slot></slot>
    </main>
  </div>
</template>
<script lang="ts" setup></script>
<style scoped></style>
