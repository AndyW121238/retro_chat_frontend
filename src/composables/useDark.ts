import { ref, watchEffect } from "vue";

export const useDark = () => {
  const isDark = ref<boolean>();

  const updateTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  watchEffect(updateTheme);

  const toggleDark = () => {
    isDark.value = !isDark.value;
  };

  return {
    isDark,
    toggleDark,
  };
};
