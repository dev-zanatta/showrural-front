<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="min-width: 900px">
      <q-card-section
        class="flex items-center text-weight-bold"
        style="font-size: 20px"
      >
        {{ licenca.nome_razao_social }}
      </q-card-section>
      <q-card-section>
        <q-card flat bordered class="colunm q-pa-md no-wrap">
          <div class="flex" style="gap: 12px">
            <div class="flex flex-grow">
              <div class="column">
                <div class="text-weight-bold" style="font-size: 15px">
                  Protocolo
                </div>
                <div>
                  {{ licenca.n_protocolo }}
                </div>
              </div>
            </div>
            <div class="flex flex-grow">
              <div class="column">
                <div class="text-weight-bold" style="font-size: 15px">
                  Documento
                </div>
                <div>
                  {{ licenca.n_documento }}
                </div>
              </div>
            </div>
            <div class="flex flex-grow" style="flex-basis: 20%">
              <div class="column">
                <div class="text-weight-bold" style="font-size: 15px">
                  Modalidade
                </div>
                <div>
                  {{ licenca.modalidade }}
                </div>
              </div>
            </div>
            <div class="flex flex-grow">
              <div class="column">
                <div class="text-weight-bold" style="font-size: 15px">
                  Municipio
                </div>
                <div>
                  {{ licenca.cidade + "-" + licenca.uf }}
                </div>
              </div>
            </div>
            <div class="flex flex-grow">
              <div class="column">
                <div class="text-weight-bold" style="font-size: 15px">
                  Emissao
                </div>
                <div>
                  {{ licenca.data_emissao }}
                </div>
              </div>
            </div>
            <div class="flex flex-grow">
              <div class="column">
                <div class="text-weight-bold" style="font-size: 15px">
                  Validade
                </div>
                <div>
                  {{ licenca.data_validade }}
                </div>
              </div>
            </div>
            <div class="flex flex-grow">
              <div class="column">
                <div class="text-weight-bold" style="font-size: 15px">
                  Risco
                </div>
                <div>
                  <q-badge
                    rounded
                    :color="
                      licenca.risco == 'Baixa'
                        ? 'green'
                        : licenca.risco == 'Media'
                          ? 'warning'
                          : licenca.risco == 'Alta'
                            ? 'red'
                            : 'gray'
                    "
                    :label="licenca.risco"
                    style="font-size: 14px"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="flex q-px-sm q-py-md">
            <div class="flex flex-grow" style="flex-basis: 90%">
              {{
                licenca.condicionamento
                  ? licenca.condicionamento
                  : "Sem condicionamento"
              }}
            </div>
            <div class="flex flex-center flex-grow">
              <div>
                <q-btn
                  flat
                  :icon="
                    licenca.pdf ? 'mdi-file-download-outline' : 'mdi-magnify'
                  "
                  @click="
                    licenca.pdf
                      ? PdfDownloader({
                          base64Data: licenca.pdf,
                          filename: `${licenca.n_protocolo}.pdf`,
                        })
                      : downloadPdf(licenca)
                  "
                  :loading="loadingPDF[licenca.n_protocolo]"
                >
                </q-btn>
              </div>
            </div>
          </div>
        </q-card>
      </q-card-section>
      <!-- <q-card-section>
        <q-card flat bordered>
          <div v-if="monitoramento?.emails?.split(/,|;/).length > 0">
            <div
              v-for="email in monitoramento.emails.split(/,|;/)"
              :key="email"
            >
              <div class="flex flex-grow">
                <div class="column">
                  <div>
                    <div>
                        Email
                    </div>
                    <div>

                    </div>
                  </div>
                  <div>
                    {{ email }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="q-pa-md">Nenhum email enviado</div>
        </q-card>
      </q-card-section> -->
    </q-card>
  </q-dialog>
</template>
<script setup>
import { useDialogPluginComponent } from "quasar";
import { api } from "src/boot/axios";
import { ref } from "vue";

defineEmits([...useDialogPluginComponent.emits]);

defineProps({
  licenca: {
    type: Object,
    required: true,
  },
  monitoramento: {
    type: Object,
    required: true,
  },
});

const loadingPDF = ref({});

const { dialogRef, onDialogHide } = useDialogPluginComponent();

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
</script>
