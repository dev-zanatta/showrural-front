<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin bg-surface-dark" style="min-width: 800px">
      <q-card-section
        class="flex items-end no-wrap q-mt-md q-pt-none"
        style="gap: 10px"
      >
        <div class="flex-grow" style="flex-basis: 200px;">
          <div class="q-py-sm">Informe a Razão Social</div>
          <q-input
            v-model="razaoSocial"
            label="Buscar"
            class="bg-white"
            outlined
            dense
          >
            <template #append>
              <q-icon name="search" />
            </template>
          </q-input>
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
import { useDialogPluginComponent } from "quasar";
import { api } from "src/boot/axios";
import { ref } from "vue";

defineEmits([...useDialogPluginComponent.emits]);

const razaoSocial = ref("");
const selected = ref("");
const options = [
  { label: "Empresa 1", value: "1" },
  { label: "Empresa 2", value: "2" },
  { label: "Empresa 3", value: "3" },
];

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();

const onOKClick = async () => {
  const response = await api.post("/novo-monitoramento", {
    razaoSocial: razaoSocial.value,
  });
  if (response.data) {
    onDialogOK(razaoSocial.value);
  }
};
</script>
