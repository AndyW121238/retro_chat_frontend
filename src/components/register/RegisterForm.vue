<template>
  <form class="mt-8 text-xl flex flex-col" @submit.prevent="handleRegister">
    <FormItem label="USERNAME">
      <template #icon>
        <i-pixelarticons-user />
      </template>
      <PixelInput
        autocomplete="off"
        v-model="registerForm.username"
        type="text"
        name="username"
        placeholder="Enter your username"
      />
    </FormItem>

    <FormItem label="EMAIL">
      <template #icon>
        <i-pixelarticons-mail />
      </template>
      <PixelInput
        autocomplete="off"
        v-model="registerForm.email"
        type="text"
        name="email"
        placeholder="Enter your email"
      />
    </FormItem>

    <FormItem label="PASSWORD">
      <template #icon>
        <i-pixelarticons-lock />
      </template>
      <PixelInput
        autocomplete="off"
        v-model="registerForm.password"
        type="password"
        name="password"
        placeholder="Enter your password"
      />
    </FormItem>

    <FormItem label="CODE">
      <template #icon>
        <i-pixelarticons-keyboard />
      </template>
      <div class="flex items-center gap-x-1">
        <PixelInput
          autocomplete="off"
          v-model="code"
          type="text"
          name="code"
          placeholder="Enter the code sent to you"
        />
        <PixelButton
          class="dark:text-white"
          color="bg-via"
          type="button"
          @click="sendVerifyCode"
        >
          <p class="py-2">
            {{ countDown ? resendCountDown : "Send" }}
          </p>
        </PixelButton>
      </div>
    </FormItem>

    <PixelButton
      color="bg-linear-45 from-from via-via to-to"
      class="dark:text-white"
      type="submit"
    >
      <p class="py-3">Create account</p>
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
