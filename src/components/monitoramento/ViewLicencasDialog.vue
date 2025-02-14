<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin bg-surface-dark" style="min-width: 1200px; min-height: fit-content">
      <q-card-section
        class="column no-wrap q-mt-md q-pt-none"
        style="gap: 10px"
      >
        <div class="col-12">
          <q-table
            :columns="columns"
            :rows="props.licencas"
            class="full-width"
          >
          </q-table>
        </div>
        <div class="col-4 row">          
          <q-input
            v-model="emails"
            label="Emails"
            class="bg-white q-mr-md"
            style="width: 400px"
            outlined
            dense
          >
          </q-input>
          <q-btn
            color="button"
            label="Monitorar"
            style="padding: 10px"
            @click="onOKClick"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { useDialogPluginComponent, useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { onMounted, ref } from "vue";

defineEmits([...useDialogPluginComponent.emits]);
const $q = useQuasar();
const allLicencas = ref([]);
const emails = ref("");
const props = defineProps({
  licencas: Array,
  selected: String,
  razaoSocial: String,
});

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
];

const { onDialogOK, dialogRef, onDialogHide } = useDialogPluginComponent();

const onOKClick = async () => {
  if(!emails.value || testEmail(emails.value) == false) {
    $q.notify({
      message: "Informe os emails",
      color: "negative",
      position: "top",
    });
    return;
  }
  const response = await api.post("/novo-monitoramento", {
    razaoSocial: props.razaoSocial,
    selected: props.selected.label,
    emails: emails.value,
  });
  if (response.data) {
    onDialogOK();
  }
};

const testEmail = (emails) => {
  const emailArray = emails.split(",");
  for (let i = 0; i < emailArray.length; i++) {
    if (!emailArray[i].includes("@")) {
      return false;
    }
  }
  return true;
};

onMounted(() => {

  console.log(props.licencas);
  console.log(props.selected);
  console.log(props.razaoSocial);
  allLicencas.value = props.licencas;
});
</script>
