<template>
  <Bar
    :id="id"
    ref="chart_ref"
    :options="chartOptions"
    :data="computedChartData"
  />
</template>

<script setup>
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import { computed, useTemplateRef } from "vue";
import { Bar } from "vue-chartjs";
import { getCssVar } from "quasar";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const chart_ref = useTemplateRef(null);

const { data, barColor, horizontal, showTooltip } = defineProps({
  data: {
    type: Array,
    required: true,
  },
  barColor: {
    type: String,
    default: () => getCssVar("primary"),
  },
  horizontal: {
    type: Boolean,
    default: false,
  },
  showTooltip: {
    type: Boolean,
    default: true,
  },
  id: {
    type: String,
    default: "bar-chart",
  },
});

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: horizontal ? "y" : "x",

  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: showTooltip,
      displayColors: false,
      callbacks: {
        label: (context) => `${context.raw}`,
      },
    },
  },

  scales: {
    x: {
      display: false,
      grid: {
        display: false,
      },
    },
    y: {
      display: false,
      grid: {
        display: false,
      },
      beginAtZero: true,
    },
  },

  animation: {
    duration: 750,
    easing: "easeOutQuad",
  },
}));

const computedChartData = computed(() => ({
  labels: Array(data.length).fill(""),
  datasets: [
    {
      data: data,
      backgroundColor: barColor,
      borderRadius: 2,
      barThickness: 8,
      maxBarThickness: 10,
    },
  ],
}));

defineExpose({
  chart_ref,
});
</script>
