<template>
  <div>
    <div class="flex justify-between items-center">
      <div class="text-h5 q-my-sm">{{ $route.meta?.title }}</div>
      <q-btn flat round :icon="'mdi-bell-outline'" @click="openNotificacaoDialog"> </q-btn>
    </div>
    <q-separator class="q-my-sm" />
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar';
import NotificacaoDialog from '../monitoramento/NotificacaoDialog.vue';

const $q = useQuasar();

const openNotificacaoDialog = () => {
  $q.dialog({
    component: NotificacaoDialog,
    parent: this,
  });
};
</script>
