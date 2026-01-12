<template>
  <teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 w-full h-full flex items-center justify-center"
      @click="handleBackdropClick"
    >
      <!-- 遮罩层 -->
      <div class="absolute inset-0 bg-black/20"></div>

      <!-- 弹窗内容 -->
      <div class="relative z-10 w-fit">
        <PixelCard class="relative">
          <!-- 关闭按钮 -->
          <button
            v-if="closable"
            class="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-black hover:bg-gray-100 transition-colors z-30"
            @click="handleClose"
          >
            ✕
          </button>

          <!-- 标题 -->
          <div
            v-if="title"
            class="px-4 py-3 border-b-2 border-black bg-linear-to-r from-from via-via to-to"
          >
            <h3 class="text-lg font-bold text-black">{{ title }}</h3>
          </div>

          <!-- 内容 -->
          <div class="p-4">
            <slot></slot>
          </div>

          <!-- 底部按钮区域 -->
          <div
            v-if="$slots.footer"
            class="px-4 py-3 border-t-2 border-black flex justify-end gap-2"
          >
            <slot name="footer"></slot>
          </div>
        </PixelCard>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts" setup>
import { watch } from "vue";
import PixelCard from "./PixelCard.vue";

interface DialogProps {
  modelValue: boolean;
  title?: string;
  closable?: boolean;
  maskClosable?: boolean;
}

const props = withDefaults(defineProps<DialogProps>(), {
  closable: true,
  maskClosable: true,
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const handleClose = () => {
  emit("update:modelValue", false);
};

const handleBackdropClick = (event: MouseEvent) => {
  if (props.maskClosable && event.target === event.currentTarget) {
    handleClose();
  }
};

// 监听ESC键关闭弹窗
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      document.addEventListener("keydown", handleEscKey);
    } else {
      document.removeEventListener("keydown", handleEscKey);
    }
  }
);

const handleEscKey = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    handleClose();
  }
};

// 组件卸载时清理事件监听
import { onUnmounted } from "vue";
onUnmounted(() => {
  document.removeEventListener("keydown", handleEscKey);
});
</script>

<style scoped></style>
