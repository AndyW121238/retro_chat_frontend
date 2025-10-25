<template>
  <div
    class="h-screen w-screen transition-colors flex justify-center items-center bg-linear-to-br from-from from-10% via-via via-30% to-to to-90%"
  >
    <div class="absolute top-10 right-10">
      <i-pixelarticons-moon @click="toggleDark" v-show="isDark" />
      <i-pixelarticons-sun-alt @click="toggleDark" v-show="!isDark" />
    </div>
    <div>
      <PixelCard>
        <div class="p-8">
          <div class="flex gap-x-3">
            <PixelButton
              :color="mode === 'login' ? 'bg-yellow-300' : 'bg-gray-300'"
              className="w-full"
              @click="goLogin"
            >
              <div class="flex px-10 py-3 justify-center text-xl gap-x-3">
                <i-pixelarticons-corner-down-right />
                <span>Login</span>
              </div>
            </PixelButton>
            <PixelButton
              :color="mode === 'register' ? 'bg-yellow-300' : 'bg-gray-300'"
              className="w-full"
              @click="goRegister"
            >
              <div class="flex px-10 py-3 justify-center text-xl gap-x-3">
                <i-pixel-user />
                <span>Register</span>
              </div>
            </PixelButton>
          </div>
          <component :is="mode === 'login' ? LoginForm : RegisterForm" />
        </div>
      </PixelCard>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { useDark } from "@/composables/useDark";
import LoginForm from "@/components/login/LoginForm.vue";
import RegisterForm from "@/components/register/RegisterForm.vue";

const mode = ref<"login" | "register">("login");
const { toggleDark, isDark } = useDark();

const goLogin = () => {
  mode.value = "login";
};

const goRegister = () => {
  mode.value = "register";
};
</script>
<style scoped></style>
