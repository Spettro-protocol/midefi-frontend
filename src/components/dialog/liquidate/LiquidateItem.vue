<template>
  <v-list-item class="ma-0 pa-0">
    <v-row class="ma-0 liquidate-item">
      <v-col cols="6" class="d-flex justify-center">
        <div class="text-center">{{ borrowerCrop }}</div>
      </v-col>
      <v-col cols="6">
        <v-row class="d-flex align-center justify-end">
          <v-col class="d-flex justify-end" cols="8">
            {{ maxToLiquidateFormatter | formatNumber }}
          </v-col>
          <v-col class="d-flex justify-end" cols="2">
            <span>{{ collateral.token.symbol }}</span>
          </v-col>
          <v-col class="d-flex justify-end" cols="2">
            <v-btn class="pa-0" icon @click="select">
              <svg
                width="11"
                height="32"
                viewBox="0 0 11 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M1 1L9 16L1 31" stroke="#3e954a" stroke-width="2" stroke-linecap="round" />
              </svg>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-list-item>
</template>

<script>
import { ethers } from 'ethers'
export default {
  name: 'LiquidateItem',
  props: {
    borrower: {
      type: String,
      required: true,
    },
    maxToLiquidate: {
      type: Object,
      required: true,
    },
    debt: {
      type: Object,
      required: true,
    },
    borrowMarketAddress: {
      type: String,
      required: true,
    },
    collateral: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      collateralSymbol: '',
    }
  },
  computed: {
    borrowerCrop() {
      return `${this.borrower.substring(0, 4)}...${this.borrower.substring(
        this.borrower.length - 4,
        this.borrower.length,
      )}`
    },
    maxToLiquidateFormatter() {
      return ethers.utils.formatEther(this.maxToLiquidate)
    },
  },
  methods: {
    select() {
      this.$emit('selected', {
        borrower: this.borrower,
        debt: this.debt,
        maxToLiquidate: this.maxToLiquidate,
        borrowMarketAddress: this.borrowMarketAddress,
        collateral: this.collateral,
      })
    },
  },
}
</script>
