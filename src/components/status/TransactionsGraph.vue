<template>
  <div class="transactions-graph time-balance">
    <v-row class="ma-2 px-2 status">
      <v-col cols="6">
        <v-row class="ma-1">
          <h4>Overall market performance over time:</h4>
        </v-row>
        <v-row class="ml-1">
          <p>in USD</p>
        </v-row>
        <v-row class="mx-1">
          <v-divider />
        </v-row>
      </v-col>
      <v-col cols="6" class="d-flex justify-end align-end">
        <div class="toggle-tb d-flex align-center">
          <v-btn
            text
            :class="[period === constants.PERIOD_DAY ? 'selected' : 'notSelected']"
            @click="getChartData(constants.PERIOD_DAY)"
          >
            1D
          </v-btn>
          <v-btn
            text
            :class="[period === constants.PERIOD_WEEK ? 'selected' : 'notSelected']"
            @click="getChartData(constants.PERIOD_WEEK)"
          >
            1W
          </v-btn>
          <v-btn
            text
            :class="[period === constants.PERIOD_MONTH ? 'selected' : 'notSelected']"
            @click="getChartData(constants.PERIOD_MONTH)"
          >
            1M
          </v-btn>
          <v-btn
            text
            :class="[period === constants.PERIOD_YEAR ? 'selected' : 'notSelected']"
            @click="getChartData(constants.PERIOD_YEAR)"
          >
            1Y
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row class="ma-0 pl-4">
      <GChart class="ma-0 pa-0" type="LineChart" :data="chartData" :options="chartOptions" />
    </v-row>
  </div>
</template>

<script>
import { GChart } from 'vue-google-charts'
import * as constants from '@/store/constants'

export default {
  name: 'TimeBalanceGraph',
  components: {
    GChart,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      constants,
      chartData: [
        ['Time', 'Supplied', 'Loaned'],
        ['0', 0, 0],
      ],
      chartOptions: {
        width: 750,
        height: 250,
        legend: {
          position: 'bottom',
          alignment: 'end',
        },
        fontName: 'Rubik',
        colors: ['#24BD6B', '#3e954a'],
        chartArea: {
          left: '8%',
          width: '90%',
          height: '70%',
        },
      },
      weekLabels: [
        { key: 0, value: 'Sunday' },
        { key: 1, value: 'Monday' },
        { key: 2, value: 'Tuesday ' },
        { key: 3, value: 'Wednesday' },
        { key: 4, value: 'Thursday' },
        { key: 5, value: 'Friday' },
        { key: 6, value: 'Saturday' },
      ],
      monthLabels: [
        { key: 0, value: 'January' },
        { key: 1, value: 'February' },
        { key: 2, value: 'March ' },
        { key: 3, value: 'April' },
        { key: 4, value: 'May' },
        { key: 5, value: 'June' },
        { key: 6, value: 'July' },
        { key: 7, value: 'August' },
        { key: 8, value: 'September' },
        { key: 9, value: 'October' },
        { key: 10, value: 'November' },
        { key: 11, value: 'December' },
      ],
      period: 'week',
    }
  },
  created() {
    this.getChartData('week')
  },
  methods: {
    mapTimeToLabel(period, date) {
      switch (period) {
        case constants.PERIOD_DAY:
          return date
        case constants.PERIOD_WEEK:
          return this.weekLabels[date.getDay()].value
        case constants.PERIOD_MONTH:
          return date
        case constants.PERIOD_YEAR:
          return this.monthLabels[date.getMonth()].value
        default:
          return this.weekLabels[date.getDay()].value
      }
    },
    getChartData(period) {
      this.period = period
      this.data.market
        .getOverallBalance(period)
        .then((overallBalance) =>
          overallBalance.map(([date, supplied, loaned]) => [
            this.mapTimeToLabel(period, date),
            supplied,
            loaned,
          ]),
        )
        .then((overallBalance) => {
          overallBalance.reverse()
          this.chartData = Array.from(new Set(overallBalance.map(JSON.stringify)), JSON.parse)
          this.chartData.unshift(['Time', 'Supplied', 'Loaned'])
        })
    },
  },
}
</script>
