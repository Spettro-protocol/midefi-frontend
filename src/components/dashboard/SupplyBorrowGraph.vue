<template>
  <div class="supply-borrow-graph">
    <v-row class="ma-0 d-flex align-center">
      <v-col cols="3 d-flex align-center" style="gap: 10px">
        <div>
          <img src="../../assets/myActivity/dashboard-supply.png" width="75" />
        </div>
        <div style="width: 100%" class="d-flex justify-left supply-borrow-graph-text-item">
          <h3 class="text-left">Supplied</h3>
          <p class="blackish text-left">{{ totalSuppliedWithoutCollateral | formatPrice }}</p>
        </div>
      </v-col>
      <v-col cols="3 d-flex align-center" style="gap: 10px">
        <div>
          <img src="../../assets/myActivity/dashboard-coll.png" width="75" />
        </div>
        <div style="width: 100%" class="d-flex justify-left supply-borrow-graph-text-item">
          <h3 class="text-left">Collateral</h3>
          <p class="blackish text-left">{{ totalSuppliedAsCollateral | formatPrice }}</p>
        </div>
      </v-col>
      <v-col cols="3 d-flex align-center" style="gap: 10px">
        <div>
          <img src="../../assets/myActivity/dashboard-borrow.png" width="75" />
        </div>
        <div style="width: 100%" class="d-flex justify-left supply-borrow-graph-text-item">
          <h3 class="text-left">Borrowed</h3>
          <p class="blackish text-left">{{ totalBorrowed | formatPrice }}</p>
        </div>
      </v-col>
      <v-col cols="3 d-flex align-center" style="gap: 10px">
        <div>
          <img src="../../assets/myActivity/dashboard-heart.png" width="75" />
        </div>
        <div style="width: 100%" class="d-flex justify-left supply-borrow-graph-text-item">
          <h3 class="text-left">Health Factor</h3>
          <p class="blackish text-left">{{ healthfactor }} %</p>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { ethers } from 'ethers'

export default {
  name: 'SupplyBorrowGraph',
  components: {},
  props: ['healthfactor'],
  data() {
    return {
      totalBorrowed: 0,
      totalSuppliedWithoutCollateral: 0,
      totalSuppliedAsCollateral: 0,
      totalBorrowLimit: 0,
      emptyChart: [
        ['Type', 'Value'],
        ['data', 1],
      ],
      chartData: [
        ['Type', 'Value'],
        ['Supplied', 0],
        ['Supplied as Collateral', 0],
        ['Borrowed', 0],
      ],
      rBTCPrice: 0,
    }
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
    supplyBorrow() {
      return !!Number(this.totalBorrowed) || !!Number(this.totalSupply)
    },
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      const {
        supplyValue,
        supplyValueAsCollateral,
        borrowValue,
      } = await this.$middleware.getTotalSupplysAndBorrows(this.account)
      this.totalSuppliedWithoutCollateral = supplyValue.minus(supplyValueAsCollateral)
      this.totalBorrowed = borrowValue
      this.totalSuppliedAsCollateral = supplyValueAsCollateral
      this.getBorrowLimit()
      this.updateDiagramData()
    },
    async getBorrowLimit() {
      const {
        err,
        accountLiquidityInExcess,
        accountShortfall,
      } = await this.$middleware.getAccountLiquidity(this.account)
      if (err != 0) console.log('ERROR IN ACCOUNT LIQUIDITY. Code:', err)
      if (accountLiquidityInExcess != 0) {
        this.totalBorrowLimit = ethers.utils.formatEther(accountLiquidityInExcess)
      } else {
        this.totalBorrowLimit = ethers.utils.formatEther(accountShortfall) * -1
      }
    },
    updateDiagramData() {
      this.chartData = [
        ['Type', 'Value'],
        ['Supplied', +this.totalSuppliedWithoutCollateral],
        ['Supplied as Collateral', +this.totalSuppliedAsCollateral],
        ['Borrowed', +this.totalBorrowed],
      ]
    },
  },
}
</script>

<style scoped></style>
