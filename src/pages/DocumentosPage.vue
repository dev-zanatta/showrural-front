<template>
  <q-page class="">
    <!-- <div class="row col-12 q-pb-md"> -->
      <!-- <div>Total de dados no excel: {{ dadosExcel.length }}</div> -->
      <!-- <q-file filled v-model="excelInput" label="Clique para inserir novas licenças" class="col-2"/> -->
    <!-- </div> -->
    <div class="row col-12 q-pb-md">
      Todas as licenças cadastradas
    </div>
    <div class="row q-pb-sm">
      <q-input
        v-model="search"
        label="Buscar"
        class="col-4 bg-white"
        outlined
        dense
      >
        <template #append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>
    <q-table
      :columns="columns"
      :rows="licencas"
      :loading="loading"
      :filter="search"
    >
      <template #body-cell-atividade="{row}">
        <q-td style="width: 15%">
          <q-item-section>
            <span>{{ excerpt(row.atividade) }}</span>
            <q-tooltip style="font-size: 15px">{{ row.atividade }}</q-tooltip>
          </q-item-section>
        </q-td>
      </template>
    </q-table>
  </q-page>
  
</template>

<script setup>
import { api } from 'src/boot/axios';
import { onMounted, ref, watch } from 'vue';

const licencas = ref([]);

const dadosExcel = ref([]);
const excelInput = ref(null);
const loading = ref(true);
const search = ref("");

const columns = [
  {
    name: "n_protocolo",
    label: "Protocolo",
    field: "n_protocolo",
    align: "left",
    style: "width: 10%",
    required: true,
  },
  {
    name: "nome_razao_social",
    label: "Nome/Razão Social",
    field: "nome_razao_social",
    align: "left",
    style: "width: 10%",
    required: true,
  },
  {
    name: "atividade",
    label: "Atividade",
    field: "atividade",
    align: "left",
    style: "width: 10%",
    required: true,
  },
  {
    name: "cidade_uf",
    label: "Cidade/UF",
    field: "cidade_uf",
    align: "left",
    style: "width: 10%",
    required: true,
  },
  {
    name: "modalidade",
    label: "Modalidade",
    field: "modalidade",
    align: "left",
    style: "width: 10%",
    required: true,
  },
  {
    name: "n_documento",
    label: "N Documento",
    field: "n_documento",
    align: "left",
    style: "width: 10%",
    required: true,
  },
  {
    name: "data_emissao",
    label: "data Emissão",
    field: "data_emissao",
    format: (val) => {
      return val.split('-').reverse().join('/');
    },
    align: "left",
    style: "width: 10%",
    required: true,
  },
  {
    name: "data_validade",
    label: "Data Validade",
    field: "data_validade",
    format: (val) => {
      return val.split('-').reverse().join('/');
    },
    align: "left",
    style: "width: 10%",
    required: true,
  },
  {
    name: "vence_em",
    label: "Vence em",
    field: "vence_em",
    align: "left",
    style: "width: 10%",
    required: true,
  },
];

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

const excerpt = (string, size = 30) => {
  if(size == null) return string;
  if (string.length > size) {
    string = string.substring(0, size) + "...";
  }
  return string;
};

watch(dadosExcel, async (dados) => {
  const response = await api.post('/cadastrar-novas-licencas', {base64excel: dados});
  console.log(response);
});

onMounted( async () => {
  loading.value = true;
  const response = await api.get('/licencas');
  licencas.value = response.data;
  loading.value = false;
});
</script>
