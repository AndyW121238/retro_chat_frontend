<template>
  <form
    class="mt-8 text-xl flex flex-col gap-y-4"
    @submit.prevent="handleLogin"
  >
    <div>
      <p class="flex gap-x-2">
        <i-pixelarticons-user />
        <span>USERNAME</span>
      </p>
      <PixelInput
        v-model="loginForm.username"
        type="text"
        name="username"
        placeholder="Enter your username"
      />
    </div>
    <div>
      <p class="flex gap-x-2">
        <i-pixelarticons-lock />
        <span>PASSWORD</span>
      </p>
      <PixelInput
        v-model="loginForm.password"
        type="password"
        name="password"
        placeholder="Enter your password"
      />
    </div>
    <PixelButton color="bg-linear-45 from-from via-via to-to" type="submit">
      <p class="px-10 py-3">Enter chat room</p>
    </PixelButton>
  </form>
</template>
<script lang="ts" setup>
import { loginApi } from "@/api/login";
import { ref } from "vue";

const loginForm = ref({
  username: "",
  password: "",
});

const handleLogin = async () => {
  try {
    const data = await loginApi(
      loginForm.value.username,
      loginForm.value.password
    );
    console.log("登录成功", data);
  } catch (error) {
    console.error(error);
  }
};
</script>
<style scoped></style>
