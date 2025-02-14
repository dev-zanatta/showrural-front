<template>
  <div class="full-width" style="height: 100vh">
    <DefaultHeaderPage />
    <div v-if="licencas.length == 0" class="flex flex-center full-height">
      <div class="column items-center">
        <div class="q-pa-md">
          Comece a monitorar suas licencas ambientas AGORA!!
        </div>
        <div>
          <q-btn color="button" class="semiRound" @click="openMonitorarDialog">
            <span class="q-my-sm">Novo monitoramento</span>
          </q-btn>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="flex justify-between items-center q-py-md">
        <div>
          <q-input
            v-model="search"
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
        <q-btn color="button" class="semiRound" @click="openMonitorarDialog">
          <span class="q-my-sm">Novo monitoramento</span>
        </q-btn>
      </div>
      <div class="row">
        <q-table :columns="columnsEmpresas" :rows="licencas" class="col-12" :filter="search">
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                <div class="text-h6" style="font-size: 18px">
                  {{ col.label }}
                </div>
              </q-th>
            </q-tr>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props" @click="props.expand = !props.expand">
              <q-td
                v-for="col in columnsEmpresas"
                :key="col.name"
                :props="props"
              >
                <template v-if="col.field == 'razao_social'">
                  <div
                    class="flex items-center text-h6"
                    style="font-size: 18px"
                  >
                    <q-icon name="mdi-bank-outline" size="24px" class="q-mr-md"/>
                    {{ props.row[col.field] }}
                  </div>
                </template>
                <template v-if="col.field == 'tipo'">
                  <q-item-section>
                    {{ props.row[col.field] ?? "Não cadastrado" }}
                  </q-item-section>
                </template>
                <template v-if="col.field == 'total'">
                  <q-item-section class="text-h6" style="font-size: 18px">
                    {{ props.row.monitoramento_licencas?.length }}
                  </q-item-section>
                </template>
                <template v-if="col.field == 'vencer'">
                  <q-item-section class="text-h6" style="font-size: 18px">
                    {{ countVencendo(props.row) }}
                  </q-item-section>
                </template>
                <template v-if="col.field == 'vencidas'">
                  <q-item-section class="text-h6" style="font-size: 18px">
                    {{ countVencidas(props.row) }}
                  </q-item-section>
                </template>
              </q-td>
            </q-tr>
            <q-tr v-show="props.expand" :props="props" class="full-width">
              <q-td colspan="100%">
                <div>
                  <div class="row q-pb-sm">
                    <q-input
                      v-model="search2"
                      label="Buscar"
                      class="col-4 bg-white"
                      outlined
                      dense
                    >
                      <template #append>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                    <q-space />
                    <q-btn
                      flat
                      icon="mdi-download-outline"
                      @click="downloadFile(props.row)"
                    >
                      <q-tooltip>
                        Relatório em excel
                      </q-tooltip>
                    </q-btn>
                  </div>
                  <q-table
                    :columns="columns"
                    :rows="props.row.monitoramento_licencas"
                    class="full-width"
                    :filter='search2'
                  >
                    <template #body-cell-acoes="{ row }">
                      <q-td class="flex flex-center">
                        <q-btn
                          flat
                          icon-right="mdi-file-download-outline"
                          @click="checa(row)"
                          >Baixar</q-btn
                        >
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
  </div>
</template>

<script setup>
import DefaultHeaderPage from "src/components/layout/DefaultHeaderPage.vue";
import { useQuasar } from "quasar";
import AddMonitoramentoDialog from "src/components/monitoramento/AddMonitoramentoDialog.vue";
import { onMounted, ref } from "vue";
import { api } from "src/boot/axios";
const $q = useQuasar();
const licencas = ref([]);
const search = ref("");
const search2 = ref("");

const columns = [
  {
    name: "n_protocolo",
    label: "Protocolo",
    field: "n_protocolo",
    align: "left",
    required: true,
  },
  {
    name: "n_documento",
    label: "N Documento",
    field: "n_documento",
    align: "left",
    required: true,
  },
  {
    name: "modalidade",
    label: "Modalidade",
    field: "modalidade",
    align: "left",
    required: true,
  },
  {
    name: "cidade",
    label: "Cidade",
    field: "cidade",
    align: "left",
    required: true,
  },
  {
    name: "uf",
    label: "UF",
    field: "uf",
    align: "left",
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
    required: true,
  },
  {
    name: "acoes",
    label: "Ações",
    field: "acoes",
    align: "center",
    required: true,
  },
  {
    name: "risco",
    label: "Status",
    field: "risco",
    align: "center",
    style: "width: 10%",
    required: true,
  },
];

const columnsEmpresas = [
  {
    name: "razao_social",
    field: "razao_social",
    align: "left",
    style: "width: 50%",
    required: true,
  },
  {
    name: "tipo",
    label: "Tipo",
    field: "tipo",
    align: "left",
    required: true,
  },
  {
    name: "total",
    label: "Total",
    field: "total",
    align: "right",
    required: true,
  },
  {
    name: "vencer",
    label: "Vencer",
    field: "vencer",
    align: "right",
    required: true,
  },
  {
    name: "vencidas",
    label: "Vencidas",
    field: "vencidas",
    align: "right",
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

const openMonitorarDialog = async () => {
  $q.dialog({
    component: AddMonitoramentoDialog,
  }).onOk(async () => {
    const response = await api.get("/licencas-organizadas");
    licencas.value = response.data;
    $q.notify({
      message: "Monitoramento adicionado com sucesso",
      color: "positive",
    });
  });
};

const checa = async (row) => {
  console.log(row);
  const response = await api.post("/baixar-pdf", {
    numero_protocolo: row.n_protocolo,
  });

  console.log(response);
};

const downloadFile = async (row) => {
  const response = await api.post('/gerar-excel-com-licencas', {
    licencas: row.monitoramento_licencas.map(licenca => {
      const { pdf, ...rest } = licenca;
      pdf;
      return rest;
    }),
  });
  if(response.data.base64) {
    const byteCharacters = atob(response.data.base64);
    const byteNumbers = new Array(byteCharacters.length).fill().map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'relatorio.xlsx';
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(url);
  }

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
