<template>
  <div>
    <DefaultHeaderPage />

    <div class="col-12 row q-pb-md q-pt-sm q-my-auto">
      <div>
        <q-input
          label="Buscar"
          class="semiRound bg-white"
          style="min-width: 390px"
          outlined
          dense
        >
          <template #append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <q-space />
      <div>
        <q-btn color="button" class="semiRound" @click="openMonitorarDialog">
          <span class="q-my-sm">Novo monitoramento</span>
        </q-btn>
      </div>
    </div>
    <div v-if="licencas.length == 0" class="flex q-my-auto">
      <div>Nenhuma licença à mostrar</div>
      <div>Comece a monitorar agora</div>
      <q-img :src="sem_licencas" width="370px" height="276"></q-img>
    </div>
    <div class="row">
      <q-table :columns="columnsEmpresas" :rows="licencas" class="col-12">
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props" @click="props.expand = !props.expand">
            <q-td v-for="col in columnsEmpresas" :key="col.name" :props="props">
              <q-td v-if="col.field == 'razao_social'">
                <q-item-section>
                  {{ props.row[col.field] }}
                </q-item-section>
              </q-td>
              <q-td v-if="col.field == 'total'">
                <q-item-section @click="openTodos(props.row)">
                  <span>{{ props.row.monitoramento_licencas?.length }}</span>
                </q-item-section>
              </q-td>
              <q-td v-if="col.field == 'vencer'">
                <q-item-section @click="openVencendo(props.row)">
                  {{ countVencendo(props.row) }}
                </q-item-section>
              </q-td>
              <q-td v-if="col.field == 'vencidas'">
                <q-item-section @click="openVencidas(props.row)">
                  {{ countVencidas(props.row) }}
                </q-item-section>
              </q-td>
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props" class="full-width">
            <q-td colspan="100%">
              <div>
                <q-input
                  label="Buscar"
                  class="semiRound bg-white"
                  style="min-width: 390px"
                  outlined
                  dense
                >
                  <template #append>
                    <q-icon name="search" />
                  </template>
                </q-input>
                <q-table
                  :columns="columns"
                  :rows="props.row.monitoramento_licencas"
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
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import DefaultHeaderPage from "src/components/layout/DefaultHeaderPage.vue";
// import CardIconChart from "src/components/charts/CardIconChart.vue";
import { useQuasar } from "quasar";
import AddMonitoramentoDialog from "src/components/monitoramento/AddMonitoramentoDialog.vue";
import { onMounted, ref } from "vue";
import { api } from "src/boot/axios";
import sem_licencas from "/src/assets/sem_licencas.svg";

const $q = useQuasar();
const licencas = ref([]);

const columns = [
  {
    name: "n_protocolo",
    label: "Protocolo",
    field: "n_protocolo",
    align: "left",
    style: "width: 15%",
    required: true,
  },
  {
    name: "n_documento",
    label: "N Documento",
    field: "n_documento",
    align: "left",
    style: "width: 15%",
    required: true,
  },
  {
    name: "modalidade",
    label: "Modalidade",
    field: "modalidade",
    align: "left",
    style: "width: 15%",
    required: true,
  },
  {
    name: "cidade_uf",
    label: "Cidade/UF",
    field: "cidade_uf",
    align: "left",
    style: "width: 15%",
    required: true,
  },
  {
    name: "data_emissao",
    label: "data Emissão",
    field: "data_emissao",
    align: "left",
    style: "width: 15%",
    required: true,
  },
  {
    name: "data_validade",
    label: "Data Validade",
    field: "data_validade",
    align: "left",
    style: "width: 15%",
    required: true,
  },
  {
    name: "acoes",
    label: "Ações",
    field: "acoes",
    align: "center",
    style: "width: 10%",
    required: true,
  },
];

const columnsEmpresas = [
  {
    name: "razao_social",
    label: "Nome",
    field: "razao_social",
    align: "center",
    style: "width: 25%",
    required: true,
  },
  {
    name: "total",
    label: "Total",
    field: "total",
    align: "center",
    style: "width: 25%",
    required: true,
  },
  {
    name: "vencer",
    label: "Vencer",
    field: "vencer",
    align: "center",
    style: "width: 25%",
    required: true,
  },
  {
    name: "vencidas",
    label: "Vencidas",
    field: "vencidas",
    align: "center",
    style: "width: 25%",
    required: true,
  },
];

const countVencendo = (row) => {
  return row.monitoramento_licencas.filter((licenca) => {
    const hoje = new Date();
    const dataValidade = new Date(licenca.data_validade);

    // Calculate the difference in days
    const diffTime = dataValidade - hoje;
    const diffDays = diffTime / (1000 * 60 * 60 * 24); // Convert milliseconds to days

    return diffDays > 0 && diffDays <= 120;
  }).length;
};

const countVencidas = (row) => {
  return row.monitoramento_licencas.filter((licenca) => {
    const hoje = new Date();
    const dataValidade = new Date(licenca.data_validade);

    // Calculate the difference in days
    const diffTime = dataValidade - hoje;
    const diffDays = diffTime / (1000 * 60 * 60 * 24); // Convert milliseconds to days

    return diffDays < 0;
  }).length;
};

const openMonitorarDialog = () => {
  $q.dialog({
    component: AddMonitoramentoDialog,
  }).onOk(() => {
    $q.notify({
      message: "Monitoramento adicionado com sucesso",
      color: "positive",
    });
  });
};

const openVencendo = (monitoramento) => {
  let vencendo = monitoramento.monitoramento_licencas.filter((licenca) => {
    const hoje = new Date();
    const dataValidade = new Date(licenca.data_validade);

    // Calculate the difference in days
    const diffTime = dataValidade - hoje;
    const diffDays = diffTime / (1000 * 60 * 60 * 24); // Convert milliseconds to days

    return diffDays > 0 && diffDays <= 120;
  });
  console.log(vencendo);
};

const openVencidas = (monitoramento) => {
  let vencidas = monitoramento.monitoramento_licencas.filter((licenca) => {
    const hoje = new Date();
    const dataValidade = new Date(licenca.data_validade);

    // Calculate the difference in days
    const diffTime = dataValidade - hoje;
    const diffDays = diffTime / (1000 * 60 * 60 * 24); // Convert milliseconds to days

    return diffDays < 0;
  });
  console.log(vencidas);
};

const openTodos = (monitoramento) => {
  console.log(monitoramento.monitoramento_licencas);
};

const checa = (row) => {
  console.log(row);
  console.log(row.n_protocolo)
};

onMounted(async () => {
  const response = await api.get("/licencas-organizadas");
  licencas.value = response.data;
});
</script>
<style scoped>
.gap {
  gap: 16px;
}
</style>
