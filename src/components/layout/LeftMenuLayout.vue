<template>
  <q-drawer
    v-bind="$attrs"
    :model-value="true"
    show-if-above
    no-swipe-close
    no-swipe-open
    :width="250"
    :mini-width="64"
    :breakpoint="500"
    :mini="miniState"
    :behavior="'desktop'"
    class="detached-container"
  >
    <div class="column full-height q-pa-sm no-wrap">
      <div
        v-if="!$q.screen.lt.md"
        class="toggle-button-wrapper absolute"
        style="top: 50%; right: -32px; z-index: 1"
      >
        <q-btn
          flat
          round
          size="sm"
          padding="8px 8px"
          @click="miniState = !miniState"
        >
          <q-icon
            :name="miniState ? 'mdi-chevron-right' : 'mdi-chevron-left'"
          />
          <q-tooltip
            anchor="center right"
            self="center left"
            :offset="[10, 10]"
            >{{ miniState ? "Expandir Menu" : "Colapsar Menu" }}</q-tooltip
          >
        </q-btn>
      </div>

      <q-list class="column no-wrap">
        <q-item v-ripple clickable>
          <div class="flex">
            <q-item-section avatar>
              <template #default>
                <img
                  :src="logo"
                  alt="avatar"
                  style="width: 25px; height: 25px; border-radius: 50%"
                  @click="goTo('DashboardPage')"
                />
              </template>
            </q-item-section>
            <q-item-section>Lince</q-item-section>
          </div>
          <q-tooltip
            v-if="miniState"
            anchor="center right"
            self="center left"
            :offset="[10, 10]"
            >Lince</q-tooltip
          >
        </q-item>
        <template v-for="item in navigationItems" :key="item.name">
          <q-item
            v-ripple
            clickable
            exact-active-class="menu-selected"
            exact
            active-class="menu-selected"
            :to="{ name: item.name }"
            class="q-my-xs"
          >
            <q-item-section avatar>
              <q-icon :name="item.icon" style="font-size: 18px" />
            </q-item-section>
            <q-item-section>{{ item.title }}</q-item-section>
            <q-tooltip
              v-if="miniState"
              anchor="center right"
              self="center left"
              :offset="[10, 10]"
              >{{ item.title }}</q-tooltip
            >
          </q-item>
        </template>
      </q-list>

      <q-list class="q-mt-auto">
        <q-item v-ripple clickable @click="openUrl('https://softpar.inf.br')">
          <div class="flex full-width justify-center">
            <q-img
              :src="
                miniState || $q.screen.lt.md
                  ? LogoSoftparMini
                  : $q.dark.isActive
                    ? LogoSoftparLight
                    : LogoSoftparDark
              "
              style="width: 100%; height: 30px; max-width: 114px"
            />
          </div>
        </q-item>
      </q-list>
      <div class="full-width text-center text-subtitle3">
        <span class="text-caption text-weight-light">{{ version }}</span>
      </div>
    </div>
  </q-drawer>
</template>
<script setup>
import { ref, watch, watchEffect } from "vue";
import LogoSoftparLight from "src/assets/softpar_logo_light.svg";
import LogoSoftparDark from "src/assets/softpar_logo_dark.svg";
import LogoSoftparMini from "src/assets/softpar_logo_mini.svg";
import logo from "src/assets/logo.svg";
import { Cookies } from "quasar";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

const $q = useQuasar();
const router = useRouter();
const navigationItems = [
  {
    title: "Licenças",
    name: "DocumentosPage",
    icon: "folder",
    type: "single",
  },
  {
    title: "Modalidades",
    name: "CadastrosPage",
    icon: "list",
    type: "single",
  },
];

const version = "Alpha";

const miniState = ref(Cookies.get("miniState") === "true" ? true : false);

const isExpasionItemExpanded = ref(false);

const goTo = (route) => {
  router.push({ name: route });
};

watchEffect(() => {
  if ($q.screen.lt.md) {
    miniState.value = true;
    if (Array.isArray(isExpasionItemExpanded.value)) {
      isExpasionItemExpanded.value.forEach((expansion, index) => {
        isExpasionItemExpanded.value[index] = false;
      });
    } else {
      isExpasionItemExpanded.value = false;
    }
  }
});

watch(miniState, () => {
  Cookies.set("miniState", miniState.value);
});
</script>

<style lang="scss" scoped>
@import "/src/css/quasar.variables.scss";
.text-subtitle3 {
  font-size: 1.1rem !important;
  font-weight: 400 !important;
}

.menu-selected {
  background-color: rgba($primary, 0.1);
  color: $primary;
}

.toggle-button-wrapper {
  transition: transform 0.3s ease;
}

.toggle-button-wrapper:hover {
  transform: scale(1.1);
}

.menu-item--spaced {
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
