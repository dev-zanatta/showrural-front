<template>
  <Line ref="chart_ref" :options="chartOptions" :data="computedChartData" />
</template>

<script setup>
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Filler,
} from "chart.js";
import { computed, useTemplateRef } from "vue";
import { Line } from "vue-chartjs";
import { getCssVar } from "quasar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Filler,
);

const chart_ref = useTemplateRef(null);

const { data, lineColor, fillColor, showTooltip, showPoints } = defineProps({
  data: {
    type: Array,
    required: true,
  },
  lineColor: {
    type: String,
    default: () => getCssVar("primary"),
  },
  fillColor: {
    type: String,
    default: "rgba(25, 118, 210, 0.1)",
  },
  showTooltip: {
    type: Boolean,
    default: true,
  },
  showPoints: {
    type: Boolean,
    default: false,
  },
});

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,

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
      grid: { display: false },
    },
    y: {
      display: false,
      grid: { display: false },
      beginAtZero: true,
    },
  },

  elements: {
    line: {
      tension: 0.4,
      borderWidth: 2,
    },
    point: {
      radius: showPoints ? 3 : 0,
      hitRadius: 5,
      borderWidth: 0,
      backgroundColor: showPoints ? lineColor : "rgba(0,0,0,0)",
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
      borderColor: lineColor,
      backgroundColor: fillColor,
      fill: true,
    },
  ],
}));

defineExpose({
  chart_ref,
});
</script>
