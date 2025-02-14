<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin bg-surface-dark" style="min-width: 800px">
      <q-card-section
        class="flex items-end no-wrap q-mt-md q-pt-none"
        style="gap: 10px"
      >
        <div class="flex-grow" style="flex-basis: 200px;">
          <q-input
            v-model="sigla"
            label="Sigla"
            class="bg-white"
            outlined
            dense
          >
          </q-input>
        </div>
        <div class="flex-grow" style="flex-basis: 200px;">
          <q-input
            v-model="descricao"
            label="Descrição"
            class="bg-white"
            outlined
            dense
          >
          </q-input>
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

const sigla = ref("");
const descricao = ref("");

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();

const onOKClick = async () => {
  const response = await api.post('/nova-modalidade', {
    sigla: sigla.value,
    descricao: descricao.value,
  });
  if(response.data) {
      onDialogOK();
  }

};
</script>
