<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin bg-surface-dark" style="min-width: 800px">
      <q-card-section
        class="flex items-end no-wrap q-mt-md q-pt-none"
        style="gap: 10px"
      >
        <div v-for="(notificacao,index) in notificacoes" :key="index">
        
          <div v-html="notificacao">
            
          </div>
          <div>
            <q-checkbox
              v-model="checked"
              label="Estou ciente da situação do vencimento desta licença"
            />
          </div>
          <div v-if="checked" class="text-right">
            <q-btn
              label="Confirmar"
              color="primary"
              @click="closeDialog"
            />
          </div>
        </div>
       
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { useDialogPluginComponent } from "quasar";
import { api } from "src/boot/axios";
import { onMounted, ref } from "vue";

defineEmits([...useDialogPluginComponent.emits]);

const notificacoes = ref([]);
const checked = ref(false);
const { dialogRef, onDialogHide } = useDialogPluginComponent();

const closeDialog = () => {
  dialogRef.value.hide();
}

onMounted(async () => {
  const response = await api.get('/notificacoes');
  notificacoes.value.push(response.data);
});
</script>
