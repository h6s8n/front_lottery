<template>
  <div>
    <div class="timeframe-selector">
      <button v-for="tf in timeframes" :key="tf" @click="setTimeframe(tf)">
        {{ tf }}
      </button>
    </div>
    <div id="chartContainer" style="width: 100%; height: 400px;"></div>
  </div>
</template>

<script>
import { createChart, AreaSeries, CandlestickSeries } from 'lightweight-charts';

export default {
  name: 'GoldChart',
  data() {
    return {
      chart: null,
      candlestickSeries: null,
      timeframes: ['1m', '5m', '15m', '30m', '1h', '4h', '1d'],
      currentData: [],
    };
  },
  mounted() {
    this.chart = createChart(document.getElementById('chartContainer'), {
      layout: {
        textColor: 'black',
        background: { type: 'solid', color: 'white' },
      },
    });

    // ایجاد سری AreaSeries
    const areaSeries = this.chart.addSeries(AreaSeries, {
      lineColor: '#2962FF',
      topColor: '#2962FF',
      bottomColor: 'rgba(41, 98, 255, 0.28)',
    });

    // اضافه کردن داده‌ها به سری
    areaSeries.setData([
      { time: '2018-12-22', value: 32.51 },
      { time: '2018-12-23', value: 31.11 },
      { time: '2018-12-24', value: 27.02 },
      { time: '2018-12-25', value: 27.32 },
      { time: '2018-12-26', value: 25.17 },
      { time: '2018-12-27', value: 28.89 },
      { time: '2018-12-28', value: 25.46 },
      { time: '2018-12-29', value: 23.92 },
      { time: '2018-12-30', value: 22.68 },
      { time: '2018-12-31', value: 22.67 },
    ]);

    this.candlestickSeries = this.chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    this.setTimeframe('1m');
  },
  methods: {
    setTimeframe(timeframe) {
      // داده‌های نمونه برای هر تایم‌فریم
      const data = [
        { time: '2018-12-22', open: 75.16, high: 82.84, low: 36.16, close: 45.72 },
        { time: '2018-12-23', open: 45.12, high: 53.90, low: 45.12, close: 48.09 },
        { time: '2018-12-24', open: 60.71, high: 60.71, low: 53.39, close: 59.29 },
        { time: '2018-12-25', open: 68.26, high: 68.26, low: 59.04, close: 60.50 },
        { time: '2018-12-26', open: 67.71, high: 105.85, low: 66.67, close: 91.04 },
        { time: '2018-12-27', open: 91.04, high: 121.40, low: 82.70, close: 111.40 },
        { time: '2018-12-28', open: 111.51, high: 142.83, low: 103.34, close: 131.25 },
        { time: '2018-12-29', open: 131.33, high: 151.17, low: 77.68, close: 96.43 },
        { time: '2018-12-30', open: 106.33, high: 110.20, low: 90.39, close: 98.10 },
        { time: '2018-12-31', open: 109.87, high: 114.69, low: 85.66, close: 111.26 },
      ];
      this.currentData = data;
      this.candlestickSeries.setData(this.currentData);
      this.chart.timeScale().fitContent();
    },
  },
};
</script>

<style scoped>
.timeframe-selector {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.timeframe-selector button {
  margin: 0 5px;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  background-color: #2962FF;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.timeframe-selector button:hover {
  background-color: #0039cb;
}

#chartContainer {
  border: 1px solid #ccc;
  border-radius: 8px;
}
</style>
  