<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin bg-surface-dark" style="min-width: 800px">
      <q-card-section
        class="flex items-end no-wrap q-mt-md q-pt-none"
        style="gap: 10px"
      >
        <div class="flex-grow" style="flex-basis: 200px;">
          <div class="q-py-sm">Informe a Razão Social</div>
          <RazaoSocialSelect 
            v-model="razaoSocial"
          />
        </div>
        <div class="flex-grow">
          <div class="q-py-sm">Informe o tipo</div>
          <q-select
            v-model="selected"
            :options="options"
            class="flex-grow bg-white"
            :label="'Selecione'"
            outlined
            dense
          />
        </div>
        <q-btn
          color="button"
          icon="mdi-magnify"
          style="padding: 10px"
          @click="onOKClick"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { useDialogPluginComponent, useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref } from "vue";
import ViewLicencasDialog from "./ViewLicencasDialog.vue";
import RazaoSocialSelect from "/src/components/RazaoSocialSelect.vue";

defineEmits([...useDialogPluginComponent.emits]);

const $q = useQuasar();
const razaoSocial = ref("");
const selected = ref("");
const options = [
  { label: "Produtor Suíno", value: "suino" },
  { label: "Produtor Peixes", value: "peixes" },
  { label: "Produtor Aves", value: "aves" },
  { label: "Indústria", value: "industria" },
];

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();

const onOKClick = async () => {
  const response = await api.get('/all-licencas-por-razao-social', {
    params: {
      razaoSocial: razaoSocial.value,
    },
  });
  if(response.data) {
    $q.dialog({
      component: ViewLicencasDialog,
      componentProps: {
        licencas: response.data,
        selected: selected.value,
        razaoSocial: razaoSocial.value.nome_razao_social,
      }
    }).onOk(() => {
      onDialogOK(razaoSocial.value);
    });
  }

  // const response = await api.post("/novo-monitoramento", {
  //   razaoSocial: razaoSocial.value,
  //   selected: selected.value.label,
  // });
  // if (response.data) {
  //   onDialogOK(razaoSocial.value);
  // }
};
</script>
