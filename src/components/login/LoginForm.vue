<template>
  <form class="mt-8 text-xl flex flex-col" @submit.prevent="handleLogin">
    <FormItem label="USERNAME" :error-message="uernameErrorMessage">
      <template #icon>
        <i-pixelarticons-user />
      </template>
      <PixelInput
        autocomplete="off"
        v-model="loginForm.username"
        type="text"
        name="username"
        placeholder="Enter your username"
      />
    </FormItem>

    <FormItem label="PASSWORD" :error-message="passwordErrorMessage">
      <template #icon>
        <i-pixelarticons-lock />
      </template>
      <PixelInput
        autocomplete="off"
        v-model="loginForm.password"
        type="password"
        name="password"
        placeholder="Enter your password"
      />
    </FormItem>

    <PixelButton
      class="dark:text-whit"
      color="bg-linear-45 from-from via-via to-to"
      type="submit"
      :loading="loginLoading"
    >
      <p class="py-3">Enter chat room</p>
    </PixelButton>
  </form>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/userStore";
import { loginApi } from "@/api/login";
import { ApiError } from "@/types/error";

const router = useRouter();
const userStore = useUserStore();
const loginForm = ref({
  username: "",
  password: "",
});
const loginLoading = ref(false);

const uernameErrorMessage = ref<string>("");
const passwordErrorMessage = ref<string>("");

const handleLogin = async () => {
  try {
    uernameErrorMessage.value = "";
    passwordErrorMessage.value = "";
    loginLoading.value = true;
    const data = await loginApi(
      loginForm.value.username,
      loginForm.value.password
    );
    localStorage.setItem("token", data);
    userStore.setFromJWT(data);
    router.push("/chatroom");
  } catch (error) {
    const loginError = error as ApiError;
    if (loginError.code === 40001) {
      uernameErrorMessage.value = loginError.message;
    } else if (loginError.code === 40002) {
      passwordErrorMessage.value = loginError.message;
    }
  } finally {
    loginLoading.value = false;
  }
};
</script>
<style scoped></style>
