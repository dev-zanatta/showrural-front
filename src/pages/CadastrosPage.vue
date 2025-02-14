<template>
  <q-page class="">
    <div class="row q-pb-md">
      <q-input
        label="Buscar"
        class="semiRound bg-white"
        style="width: 390px"
        outlined
        dense
      >
        <template #append>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-space />
      <q-btn color="button" class="semiRound" @click="newModalidadeDialog">
        <span class="q-my-sm">Novo</span>
      </q-btn>
    </div>
    <q-table
      :columns="columns"
      :rows="modalidades"
      class="full-width"
    >
      <template #body-cell-acoes="{ row }">
        <q-td>
          <q-item-section>
            <q-btn @click="checa(row)">Baixar</q-btn>
          </q-item-section>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import AddModalidadeDialog from 'src/components/monitoramento/AddModalidadeDialog.vue';
import { onMounted, ref } from 'vue';

//
const $q = useQuasar();
const modalidades = ref([]);
const columns = [
  {
    name: 'sigla',
    label: 'Sigla',
    field: 'sigla',
    align: 'left',
    style: 'width: 25%',
    required: true,
  },
  {
    name: 'descricao',
    label: 'Descrição',
    field: 'descricao',
    align: 'left',
    style: 'width: 75%',
    required: true,
  },
];

const newModalidadeDialog = () => {
  $q.dialog({
    component: AddModalidadeDialog,
  }).onOk( async () => {
    const response = await api.get('/all-modalidades');
    modalidades.value = response.data;
  });
};

onMounted(async () => {
  const response = await api.get('/all-modalidades');
  modalidades.value = response.data;
});
</script>
