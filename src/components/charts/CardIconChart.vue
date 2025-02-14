<template>
  <q-card flat class="q-pa-lg">
    <div class="column no-wrap full-width">
      <div class="flex items-center no-wrap">
        <div v-if="icon" class="round background q-mr-sm">
          <q-icon class="q-pa-sm" :name="icon" size="24px" :color="color" />
        </div>
        <span v-if="title" class="text-h5">{{ title }}</span>
      </div>
      <div class="flex no-wrap full-width justify-between q-pa-sm">
        <div class="column flex-center">
          <span class="text-h3">{{ numberCard }}</span>
          <div
            v-if="numberPorcent"
            class="flex no-wrap text-subtitle2"
            :class="numberPorcent > 0 ? 'text-positive' : 'text-negative'"
          >
            <q-icon
              :name="numberPorcent > 0 ? 'mdi-arrow-up' : 'mdi-arrow-down'"
              size="18px"
              class="q-mr-xs"
            />
            {{ numberPorcent + "%" }}
          </div>
        </div>
        <div class="flex justify-end" style="max-width: 120px; height: 80px">
          <slot name="chart">
            <MiniBarChart
              v-if="typeChart === 'bar'"
              :data="chartData"
              fill-color="rgba(0, 0, 0, 0)"
            />
            <MiniLineChart
              v-else
              :data="chartData"
              fill-color="rgba(0, 0, 0, 0)"
            />
          </slot>
        </div>
      </div>
    </div>
  </q-card>
</template>

<script setup>
import MiniBarChart from "./mini/MiniBarChart.vue";
import MiniLineChart from "./mini/MiniLineChart.vue";

const { color, title, icon, chartData, numberCard, numberPorcent } =
  defineProps({
    color: {
      type: String,
      default: "primary",
    },
    title: {
      type: String,
      default: null,
    },
    icon: {
      type: String,
      default: "mdi-account",
    },
    chartData: {
      type: Array,
      default: () =>
        Array.from({ length: 7 }, () => Math.floor(Math.random() * 100)),
    },
    numberCard: {
      type: Number,
      default: () => Math.floor(Math.random() * 100),
    },
    numberPorcent: {
      type: Number,
      default: () => null,
    },
    typeChart: {
      type: String,
      default: "bar",
    },
  });
</script>
<style lang="scss" scoped>
@use "sass:map";
@use "src/css/quasar.variables.scss";

body.body--light {
  .background {
    background: rgba(map.get($colors, "primary"), 0.2) !important;
  }
}

body.body--dark {
  .background {
    background: rgba(map.get($colors-dark, "primary"), 0.2) !important;
  }
}
</style>
