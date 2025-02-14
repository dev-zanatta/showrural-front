<template>
  <div class="full-width full-height">
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
            label="Buscar"
            class="bg-white"
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
        <q-table :columns="columnsEmpresas" :rows="licencas" class="col-12">
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
                    <q-icon
                      name="mdi-bank-outline"
                      size="24px"
                      class="q-pa-xs"
                    />
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
                      icon="mdi-microsoft-excel"
                      @click="downloadFile"
                    >
                    </q-btn>
                  </div>
                  <q-table
                    :columns="columns"
                    :rows="props.row.monitoramento_licencas"
                    class="full-width"
                    @row-click="(evt, row) => onRowClick(row)"
                  >
                    <template #body-cell-acoes="{ row }">
                      <q-td class="flex flex-center no-wrap">
                        <q-btn
                          flat
                          :icon="
                            row.pdf
                              ? 'mdi-file-download-outline'
                              : 'mdi-magnify'
                          "
                          @click="
                            row.pdf
                              ? PdfDownloader({
                                  base64Data: row.pdf,
                                  filename: `${row.n_protocolo}.pdf`,
                                })
                              : downloadPdf(row)
                          "
                          :loading="loadingPDF[row.n_protocolo]"
                        >
                        </q-btn>
                      </q-td>
                    </template>
                    <template #body-cell-risco="{ row }">
                      <q-td>
                        <div class="flex flex-center full-width">
                          <q-badge
                            rounded
                            :color="
                              row.risco == 'Baixa'
                                ? 'green'
                                : row.risco == 'Media'
                                  ? 'warning'
                                  : row.risco == 'Alta'
                                    ? 'red'
                                    : 'gray'
                            "
                            :label="row.risco"
                            class="q-px-sm q-py-xs"
                            style="font-size: 14px"
                          />
                        </div>
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
import LicencaDialog from "src/components/licencas/LicencaDialog.vue";
const $q = useQuasar();
const licencas = ref([]);
const loadingPDF = ref({});

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
    label: "Documento",
    field: "n_documento",
    align: "right",
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
    label: "Emissão",
    field: "data_emissao",
    align: "left",
    required: true,
  },
  {
    name: "data_validade",
    label: "Validade",
    field: "data_validade",
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
    label: "Risco",
    field: "risco",
    align: "center",
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
    align: "center",
    required: true,
  },
  {
    name: "vencer",
    label: "Vencer",
    field: "vencer",
    align: "center",
    required: true,
  },
  {
    name: "vencidas",
    label: "Vencidas",
    field: "vencidas",
    align: "center",
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

const downloadPdf = async (row) => {
  loadingPDF.value[row.n_protocolo] = true;
  const response = await api.post("/baixar-pdf", {
    numero_protocolo: row.n_protocolo,
  });
  row.pdf = response.data.licenca.pdf;
  PdfDownloader({
    base64Data: response.data.licenca.pdf,
    filename: `${row.n_protocolo}.pdf`,
  });
  loadingPDF.value[row.n_protocolo] = false;
};

const PdfDownloader = ({ base64Data, filename = "document.pdf" }) => {
  try {
    // Clean the base64 string if it includes data URI
    const cleanBase64 = base64Data.replace(
      /^data:application\/pdf;base64,/,
      ""
    );

    // Convert base64 to Blob
    const binaryString = window.atob(cleanBase64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: "application/pdf" });

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to download PDF:", error);
  }
};

const onRowClick = (row) => {
  $q.dialog({
    component: LicencaDialog,
    componentProps: {
      licenca: row,
      monitoramento: licencas.value.find(
        (monitoramento) => monitoramento.id === row.monitoramento_id
      ),
    },
  });
};

const downloadFile = () => {
  console.log("Download");
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
