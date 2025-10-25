<template>
  <form
    class="mt-8 text-xl flex flex-col gap-y-4"
    @submit.prevent="handleRegister"
  >
    <div>
      <p class="flex gap-x-2">
        <i-pixelarticons-user />
        <span>USERNAME</span>
      </p>
      <PixelInput
        v-model="registerForm.username"
        type="text"
        name="username"
        placeholder="Enter your username"
      />
    </div>
    <div>
      <p class="flex gap-x-2">
        <i-pixelarticons-mail />
        <span>EMAIL</span>
      </p>
      <PixelInput
        v-model="registerForm.email"
        type="text"
        name="email"
        placeholder="Enter your email"
      />
    </div>
    <div>
      <p class="flex gap-x-2">
        <i-pixelarticons-lock />
        <span>PASSWORD</span>
      </p>
      <PixelInput
        v-model="registerForm.password"
        type="password"
        name="password"
        placeholder="Enter your password"
      />
    </div>
    <div>
      <p class="flex gap-x-2">
        <i-pixelarticons-keyboard />
        <span>CODE</span>
      </p>
      <div class="flex items-center gap-x-1">
        <PixelInput
          v-model="code"
          type="text"
          name="code"
          placeholder="Enter the code sent to you"
        />
        <PixelButton color="bg-pink-500" type="button" @click="sendVerifyCode">
          <p class="px-10 py-2 w-30">
            {{ countDown ? resendCountDown : "Send" }}
          </p>
        </PixelButton>
      </div>
    </div>
    <PixelButton color="bg-linear-45 from-from via-via to-to" type="submit">
      <p class="px-10 py-3">Create account</p>
    </PixelButton>
  </form>
</template>
<script lang="ts" setup>
import { registerApi, sendVerifyCodeApi } from "@/api/login";
import { ref } from "vue";

const registerForm = ref({
  username: "",
  email: "",
  password: "",
});

const code = ref("");
const countDown = ref<boolean>(false);
const resendCountDown = ref(60);
let countDownTimer: number | undefined = undefined;
const handleRegister = async () => {
  try {
    await registerApi(
      registerForm.value.username,
      registerForm.value.email,
      registerForm.value.password,
      code.value
    );
  } catch (error) {
    console.error(error);
  }
};

const sendVerifyCode = async () => {
  if (!registerForm.value.email) {
    console.log("请输入邮箱地址");
    return;
  }
  try {
    await sendVerifyCodeApi(registerForm.value.email);
    countDown.value = true;
    countDownTimer = setInterval(() => {
      if (resendCountDown.value === 0) {
        countDown.value = false;
        clearInterval(countDownTimer);
        resendCountDown.value = 60;
      }
      resendCountDown.value--;
    }, 1000);
  } catch (error) {
    console.error(error);
  }
};
</script>
<style scoped></style>
