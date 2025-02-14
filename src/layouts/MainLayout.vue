<template>
  <q-layout class="relative" view="hHh lpR fFf">
    <LeftMenuLayout v-if="!$q.screen.lt.sm" />
    <q-header v-if="$q.screen.lt.sm" class="bg-transparent q-pa-sm">
      <q-toolbar
        class="flex justify-between bg-surface"
        style="border-radius: 6px !important"
      >
        <q-btn dense flat @click="toggleLeftDrawer">
          <q-icon name="menu" :color="$q.dark.isActive ? 'white' : 'black'" />
        </q-btn>
        <q-btn dense flat>
          <img
            :src="someAvatar()"
            alt="avatar"
            style="width: 20px; height: 20px; border-radius: 50%"
          />
          <q-menu anchor="center right" self="top start">
            <q-list class="column no-wrap overflow-hidden">
              <q-item
                v-ripple
                v-close-popup
                clickable
                :to="{ name: 'ProfilePage' }"
                exact
                exact-active-class="menu-selected"
              >
                <div class="flex">
                  <q-item-section avatar>
                    <q-icon
                      name="account_circle"
                      color="primary"
                      style="font-size: 18px"
                    />
                  </q-item-section>
                  <q-item-section>{{ $t("user.profile.self") }}</q-item-section>
                </div>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page>
        <q-scroll-area
          ref="scrollAreaRef"
          style="position: relative"
          :style="
            $q.screen.lt.sm
              ? 'height: calc(100dvh - 68px - env(safe-area-inset-top)) !important;'
              : 'height: calc(100dvh - env(safe-area-inset-top)) !important;'
          "
        >
          <router-view v-slot="{ Component }">
            <Transition mode="out-in">
              <component
                :is="Component"
                style="padding: 20px !important; padding-right: 10px !important"
                :style="$q.screen.lt.sm ? 'padding-left: 10px !important;' : ''"
              />
            </Transition>
          </router-view>
          <img class="fixed-bottom-right q-pa-lg" :src="BottomLogo" alt="logo" />
        </q-scroll-area>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, useTemplateRef, watch } from "vue";
import { useRoute } from "vue-router";
// import { useAuth } from "src/composables/useAuth";
// import { useRouter } from "vue-router";
import LeftMenuLayout from "src/components/layout/LeftMenuLayout.vue";
import BottomLogo from "src/assets/bottom_logo.svg";
// import LeftMenuLayoutMobile from "src/components/layout/LeftMenuLayoutMobile.vue";

defineOptions({
  name: "MainLayout",
});

// const { logout } = useAuth();
const route = useRoute();
const leftDrawerOpen = ref(false);
const scrollAreaRef = useTemplateRef("scrollAreaRef");
// const router = useRouter();

let oldValue = route.path;

const someAvatar = () => {
  return "https://cdn.quasar.dev/img/avatar4.jpg";
};

// const logoutFn = async () => {
//   await logout();
//   router.push({ name: "LoginPage" });
// };

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

watch(route, (value) => {
  if (oldValue.path != value.path) {
    scrollAreaRef.value.setScrollPosition("vertical", 0, 0);
    scrollAreaRef.value.setScrollPosition("horizontal", 0, 0);
  }
  oldValue = value.path;
});
</script>
<style scoped>
.v-enter-active {
  opacity: 1;
  transition: all 0.15s ease-in;
}

.v-leave-active {
  opacity: 1;
  transition: all 0.15s ease-out;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transition: all 0.15s ease-in;
}

.v-leave-to {
  transition: all 0.15s ease-out;
}
</style>
