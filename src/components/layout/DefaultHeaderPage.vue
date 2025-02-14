<template>
  <div>
    <div class="flex justify-between items-center">
      <div class="text-h5 q-my-sm">{{ $route.meta?.title }}</div>
      <q-btn flat round :icon="'mdi-bell-outline'" @click="openMonitorarDialog"> </q-btn>
    </div>
    <q-separator class="q-my-sm" />
  </div>
</template>

<script setup></script>
