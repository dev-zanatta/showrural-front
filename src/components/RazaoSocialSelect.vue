<template>
  <q-select
    outlined
    use-input
    hide-selected
    fill-input
    clearable
    dense
    :options="razoesSociais"
    option-value="id"
    option-label="nome_razao_social"
    :label="props.label"
    :model-value="razaoSocial"
    :loading="loading"
    input-debounce="500"
    v-bind="$attrs"
    @filter="filterFn"
    @update:model-value="(value) => emit('update:razaoSocial', value)"
  >
    <template #no-option>
      <q-item>
        <q-item-section class="text-grey"> Nenhum resultado </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup>
import { api } from "src/boot/axios.js";
import { ref } from "vue";

const emit = defineEmits(["update:razaoSocial"]);

const loading = ref(false);
const razaoSocialBase = ref([]);
const razoesSociais = ref([]);

const props = defineProps({
  razaoSocial: {
    type: String,
    default: null,
  },
  label: {
    type: String,
    default: "Razão Social",
  },
});

const filterFn = async (val, update, abort) => {
  if (val == '' || val.length < 3) {
    abort();
    return;
  }

  await getRazaoSocial(val);
  const filter = () => {
    const needle = val.toLowerCase();
    razoesSociais.value = razaoSocialBase.value.filter(
      (v) => v.nome_razao_social.toLowerCase().indexOf(needle) > -1
    );
  };

  update(filter);
};

const getRazaoSocial = async (val) => {
  loading.value = true;

  const response = await api.get(`/search-razao-social`, {
    params: {
      search: val,
    },
  });
  razaoSocialBase.value = response.data;

  loading.value = false;
};
</script>
