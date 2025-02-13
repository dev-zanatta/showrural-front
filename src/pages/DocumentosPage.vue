<template>
  <q-page class="">
    <div>
      <!-- <div>Total de dados no excel: {{ dadosExcel.length }}</div> -->
      <q-file filled v-model="excelInput" />
    </div>
  </q-page>
  
</template>

<script setup>
import { api } from 'src/boot/axios';
import { onMounted, ref, watch } from 'vue';

const licencas = ref([]);

const dadosExcel = ref([]);
const excelInput = ref(null);

watch(excelInput, (file) => {
  if (!file) return;

  const blob = new Blob([file], { type: file.type });
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        dadosExcel.value = e.target.result;
        resolve();
      };
      reader.readAsDataURL(blob);
    });

});

watch(dadosExcel, async (dados) => {
  const response = await api.post('/cadastrar-novas-licencas', {base64excel: dados});
  console.log(response);
});

onMounted( async () => {
  const response = await api.get('/licencas');
  licencas.value = response.data;
});
</script>
