<script setup lang="ts"></script>

<template>
  <router-view v-slot="{ Component }">
    <keep-alive include="Chatroom">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<style scoped></style>
