<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin overflow-hidden" style="width: 800px">
      <q-form ref="formRef" @submit="onOKClick">
        <q-card-section class="row q-col-gutter-sm">
          <div class="col-12">Monitore a empresa pela Razão Social</div>
          <div>
            <q-input v-model="razaoSocial" label="Buscar" outlined rounded dense>
              <template #append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <q-space/>
          <div>
            <q-btn
              label="Monitorar"
              color="button"
              @click="onOKClick"
            />
          </div>
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { useDialogPluginComponent } from 'quasar';
import { api } from 'src/boot/axios';
import { ref } from 'vue';

defineEmits([
  ...useDialogPluginComponent.emits,
]);

const razaoSocial = ref('');

const { dialogRef, onDialogHide, onDialogOK } =
  useDialogPluginComponent();

const onOKClick = async () => {
  const response = await api.post('/novo-monitoramento', {
    razaoSocial: razaoSocial.value,

  })
  if(response.data) {
    onDialogOK(razaoSocial.value);
  }
};
</script>
