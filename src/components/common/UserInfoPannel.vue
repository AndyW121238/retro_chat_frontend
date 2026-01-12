<template>
  <div class="w-full h-fit">
    <div class="p-2">
      <div class="flex items-center gap-2">
        <div
          class="w-10 aspect-square border-2 cursor-pointer"
          @click="handleShowUserInfo"
        >
          <UserAvatar
            :avatar="userStore.userInfo?.userAvatar!"
            :username="userStore.userInfo?.userAvatar!"
          />
        </div>
        <span ref="userName">{{ userStore.userInfo?.username }}</span>
      </div>
    </div>
  </div>
  <Dialog v-model="userDialogVisible" title="编辑头像">
    <div class="w-150 flex flex-col gap-y-3 items-center">
      <div class="w-30 aspect-square rounded-full overflow-hidden border-3">
        <UserAvatar
          :avatar="userStore.userInfo?.userAvatar!"
          :username="userStore.userInfo?.username!"
        />
      </div>
      <span class="text-black text-3xl">
        {{ userStore.userInfo?.username }}
      </span>
      <PixelCard :shadow="false">
        <div class="p-5 flex justify-between text-xl">
          <span>邮箱地址</span>
          <span>{{ userStore.userInfo?.email }}</span>
        </div>
      </PixelCard>
      <PixelButton
        class="w-full"
        color="bg-linear-to-r from-via to-from"
        @click="handleChangeAvatar"
      >
        <div class="p-2 flex items-center gap-x-2 text-xl">
          <i-material-symbols:android-camera-outline />
          <span>变换头像</span>
        </div>
      </PixelButton>
    </div>
    <div
      v-show="editAvatarVisible"
      class="absolute left-full top-0 ml-5 h-full aspect-square bg-white border-4"
    ></div>
  </Dialog>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { useUserStore } from "@/store/userStore";

const userStore = useUserStore();
const userDialogVisible = ref(false);
const editAvatarVisible = ref(false);

const handleShowUserInfo = () => {
  userDialogVisible.value = true;
};

const handleChangeAvatar = () => {
  editAvatarVisible.value = true;
};
</script>
<style scoped></style>
