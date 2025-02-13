<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          color="black"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <div >
          <img src="~assets/logo.jpeg" alt="Quasar logo" style="width: 60px; height: 60px"/>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-primary"
    >
      <q-list>
        <div
          v-for="link in linksList"
          :key="link.title"
          @click="goTo(link.route)"
        >
          <q-item clickable>
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ link.title }}</q-item-label>
              <q-item-label caption>{{ link.caption }}</q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter();
const linksList = [
  {
    title: 'Home',
    caption: '',
    route: '/',
    icon: 'home'
  },
  {
    title: 'Documentos',
    caption: '',
    route: '/documentos',
    icon: 'folder'
  },
  {
    title: 'Cadastros',
    caption: '',
    route: '/cadastros',
    icon: 'list'
  },
];

const goTo = (route) => {
  router.push(route)
}

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
