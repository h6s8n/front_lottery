<template>
  <div class="trading-page">
    <!-- هدر اطلاعات قیمت -->
    <div class="price-header">
      <div class="price-display">
        <h1>XAU/USD</h1>
        <div class="current-price">
          <span class="price">{{ currentPrice }}</span>
          <span class="currency">USD</span>
        </div>
        <div class="price-change" :class="priceChange >= 0 ? 'profit' : 'loss'">
          {{ priceChange >= 0 ? '+' : '' }}{{ priceChange }}%
        </div>
      </div>
      <div class="trade-info" v-if="activeTrade">
        <div class="trade-type" :class="activeTrade.type">
          {{ activeTrade.type === 'buy' ? 'BUY' : 'SELL' }}
        </div>
        <div class="trade-price">
          Entry: {{ activeTrade.entryPrice }}
        </div>
        <div class="trade-pnl" :class="activeTrade.pnl >= 0 ? 'profit' : 'loss'">
          P&L: {{ activeTrade.pnl >= 0 ? '+' : '' }}{{ activeTrade.pnl }}%
        </div>
      </div>
    </div>

    <!-- چارت قیمت -->
    <div class="chart-container">
      <div class="chart" ref="chartRef"></div>
    </div>

    <!-- دکمه‌های معامله -->
    <div class="trading-actions">
      <button class="buy-btn" @click="openTrade('buy')">
        <span class="action-type">BUY</span>
        <span class="action-price">{{ currentPrice }}</span>
      </button>
      <button class="sell-btn" @click="openTrade('sell')">
        <span class="action-type">SELL</span>
        <span class="action-price">{{ currentPrice }}</span>
      </button>
    </div>

    <!-- تنظیمات معامله -->
    <div class="trade-settings" v-if="showTradeSettings">
      <div class="setting-item">
        <label>Take Profit (TP)</label>
        <input type="number" v-model="tpPips" placeholder="Pips" />
      </div>
      <div class="setting-item">
        <label>Stop Loss (SL)</label>
        <input type="number" v-model="slPips" placeholder="Pips" />
      </div>
      <button class="confirm-btn" @click="confirmTrade">Confirm Trade</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { createChart } from 'lightweight-charts'
import { useIntervalFn } from '@vueuse/core'

const API_KEY = 'VWWN9D9H5Z8RBQWU'
const API_URL = 'https://www.alphavantage.co/query'

// Refs
const chartRef = ref(null)
let chart: any = null
let candlestickSeries: any = null
let tpLine: any = null
let slLine: any = null
let priceLine: any = null

// داده‌های قیمت
const currentPrice = ref(0)
const priceChange = ref(0)
const priceHistory = ref<{
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}[]>([
  { time: '10:00', open: 2000, high: 2010, low: 1995, close: 2005 },
  { time: '10:01', open: 2005, high: 2015, low: 2000, close: 2010 },
  { time: '10:02', open: 2010, high: 2020, low: 2005, close: 2015 },
  { time: '10:03', open: 2015, high: 2025, low: 2010, close: 2020 },
  { time: '10:04', open: 2020, high: 2030, low: 2015, close: 2025 }
])

// تنظیمات معامله
const showTradeSettings = ref(false)
const tpPips = ref(50)
const slPips = ref(30)
const activeTrade = ref<{
  type: 'buy' | 'sell';
  entryPrice: number;
  pnl: number;
} | null>(null)

// دریافت داده‌های تاریخی
async function fetchHistoricalData() {
  try {
    const response = await fetch(
      `${API_URL}?function=TIME_SERIES_INTRADAY&symbol=XAUUSD&interval=1min&apikey=${API_KEY}&outputsize=compact`
    )
    const data = await response.json()
    
    if (data['Time Series (1min)']) {
      const timeSeries = data['Time Series (1min)']
      const formattedData = Object.entries(timeSeries).map(([time, values]: [string, any]) => ({
        time: time.split(' ')[1], // فقط ساعت و دقیقه
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close'])
      }))
      
      priceHistory.value = formattedData.reverse()
      currentPrice.value = priceHistory.value[priceHistory.value.length - 1].close
      
      // محاسبه تغییر قیمت
      if (priceHistory.value.length > 1) {
        const firstPrice = priceHistory.value[0].open
        priceChange.value = ((currentPrice.value - firstPrice) / firstPrice) * 100
      }
      
      updateChart()
    }
  } catch (error) {
    console.error('Error fetching historical data:', error)
  }
}

// دریافت قیمت لحظه‌ای
const { pause, resume } = useIntervalFn(async () => {
  try {
    const response = await fetch(
      `${API_URL}?function=GLOBAL_QUOTE&symbol=XAUUSD&apikey=${API_KEY}`
    )
    const data = await response.json()
    
    if (data['Global Quote']) {
      const quote = data['Global Quote']
      const price = parseFloat(quote['05. price'])
      currentPrice.value = price
      
      // به‌روزرسانی آخرین کندل
      if (priceHistory.value.length > 0) {
        const lastCandle = priceHistory.value[priceHistory.value.length - 1]
        lastCandle.high = Math.max(lastCandle.high, price)
        lastCandle.low = Math.min(lastCandle.low, price)
        lastCandle.close = price
      }
      
      updateChart()
      updateTradeLines()
      updatePnL()
    }
  } catch (error) {
    console.error('Error fetching current price:', error)
  }
}, 1000)

function updateChart() {
  if (!chart || !chartRef.value) return

  if (!candlestickSeries) {
    candlestickSeries = chart.addCandlestickSeries({
      upColor: '#4CAF50',
      downColor: '#F44336',
      borderVisible: false,
      wickUpColor: '#4CAF50',
      wickDownColor: '#F44336'
    })
  }

  candlestickSeries.setData(priceHistory.value)
  chart.timeScale().fitContent()
}

function updateTradeLines() {
  if (!chart || !activeTrade.value) return

  const price = currentPrice.value
  const entryPrice = activeTrade.value.entryPrice
  const isBuy = activeTrade.value.type === 'buy'

  // حذف خطوط قبلی
  if (tpLine) chart.removeSeries(tpLine)
  if (slLine) chart.removeSeries(slLine)
  if (priceLine) chart.removeSeries(priceLine)

  // ایجاد خط TP
  tpLine = chart.addLineSeries({
    color: '#4CAF50',
    lineWidth: 2,
    lineStyle: 2
  })
  tpLine.setData([{
    time: priceHistory.value[0].time,
    value: isBuy ? entryPrice + (tpPips.value * 0.01) : entryPrice - (tpPips.value * 0.01)
  }])

  // ایجاد خط SL
  slLine = chart.addLineSeries({
    color: '#F44336',
    lineWidth: 2,
    lineStyle: 2
  })
  slLine.setData([{
    time: priceHistory.value[0].time,
    value: isBuy ? entryPrice - (slPips.value * 0.01) : entryPrice + (slPips.value * 0.01)
  }])

  // ایجاد خط قیمت فعلی
  priceLine = chart.addLineSeries({
    color: '#FFD700',
    lineWidth: 1,
    lineStyle: 0
  })
  priceLine.setData([{
    time: priceHistory.value[0].time,
    value: price
  }])
}

function updatePnL() {
  if (!activeTrade.value) return
  
  const price = currentPrice.value
  const entryPrice = activeTrade.value.entryPrice
  const isBuy = activeTrade.value.type === 'buy'
  
  activeTrade.value.pnl = isBuy 
    ? ((price - entryPrice) / entryPrice) * 100
    : ((entryPrice - price) / entryPrice) * 100
}

function openTrade(type: 'buy' | 'sell') {
  showTradeSettings.value = true
  activeTrade.value = {
    type,
    entryPrice: currentPrice.value,
    pnl: 0
  }
}

function confirmTrade() {
  showTradeSettings.value = false
  updateTradeLines()
}

onMounted(async () => {
  if (!chartRef.value) return

  chart = createChart(chartRef.value, {
    width: chartRef.value.clientWidth,
    height: 400,
    layout: {
      background: { color: '#1e1e1e' },
      textColor: '#d1d4dc',
    },
    grid: {
      vertLines: { color: '#2B2B43' },
      horzLines: { color: '#2B2B43' },
    },
    timeScale: {
      timeVisible: true,
      secondsVisible: false,
    },
    crosshair: {
      mode: 1,
    },
  })

  // نمایش داده‌های نمونه
  updateChart()
  
  // دریافت داده‌های تاریخی
  await fetchHistoricalData()
  
  // شروع دریافت قیمت لحظه‌ای
  resume()
})

onUnmounted(() => {
  pause()
})
</script>

<style scoped>
.trading-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
}

.price-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background: #1e1e1e;
  padding: 20px;
  border-radius: 8px;
}

.price-display {
  text-align: left;
}

.price-display h1 {
  font-size: 24px;
  margin: 0;
  color: #FFD700;
}

.current-price {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin: 8px 0;
}

.price {
  font-size: 32px;
  font-weight: bold;
  color: #fff;
}

.currency {
  font-size: 16px;
  color: #888;
}

.price-change {
  font-size: 14px;
  font-weight: 500;
}

.trade-info {
  background: #2a2a2a;
  padding: 12px;
  border-radius: 6px;
  min-width: 150px;
}

.trade-type {
  font-weight: bold;
  margin-bottom: 4px;
}

.trade-type.buy {
  color: #4CAF50;
}

.trade-type.sell {
  color: #F44336;
}

.trade-price, .trade-pnl {
  font-size: 12px;
  color: #888;
}

.chart-container {
  height: 400px;
  background: #1e1e1e;
  border-radius: 8px;
  margin-bottom: 20px;
}

.trading-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.buy-btn, .sell-btn {
  flex: 1;
  padding: 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.buy-btn {
  background: #4CAF50;
  color: white;
}

.sell-btn {
  background: #F44336;
  color: white;
}

.action-type {
  font-size: 18px;
  font-weight: bold;
}

.action-price {
  font-size: 14px;
}

.trade-settings {
  background: #1e1e1e;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.setting-item {
  margin-bottom: 15px;
}

.setting-item label {
  display: block;
  margin-bottom: 5px;
  color: #888;
}

.setting-item input {
  width: 100%;
  padding: 8px;
  border: 1px solid #333;
  border-radius: 4px;
  background: #2a2a2a;
  color: #fff;
}

.confirm-btn {
  width: 100%;
  padding: 12px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.profit {
  color: #4CAF50;
}

.loss {
  color: #F44336;
}
</style> 