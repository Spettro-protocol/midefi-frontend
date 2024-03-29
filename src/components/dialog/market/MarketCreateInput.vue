<template>
  <div class="market-create-input container">
    <h2 class="mb-2">Basic Market Info</h2>
    <v-divider color="#3e954a" />
    <v-row class="ma-0 py-5 d-flex align-center">
      <v-col>
        <h3>Token address:</h3>
      </v-col>
      <v-col cols="9" class="d-flex align-center">
        <v-text-field
          v-model="tokenAddress"
          class="dataInput"
          type="text"
          solo
          flat
          :rules="[rules.requiredAddress, rules.address]"
        />
      </v-col>
    </v-row>
    <h2 class="mb-2">Initial market value</h2>
    <v-divider color="#3e954a" />
    <v-row class="ma-0 py-3 d-flex align-center">
      <v-col>
        <h3>Market price:</h3>
      </v-col>
      <v-col cols="9" class="dataInput">
        <v-row class="ma-0">
          <v-col>
            <v-text-field
              v-model="marketPrice"
              class="d-flex align-start"
              type="number"
              solo
              flat
              :rules="[rules.requiredMarketPrice]"
            />
          </v-col>
          <v-col cols="1" class="mb-4 mr-2 dataInfo d-flex justify-end"> USD </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row class="ma-0 py-3 d-flex align-center">
      <v-col class="pa-0">
        <h3>Base borrow APR:</h3>
      </v-col>
      <v-col cols="9" class="dataInput">
        <v-row class="ma-0">
          <v-col>
            <v-text-field
              v-model="baseBorrowApr"
              type="number"
              solo
              flat
              :rules="[rules.requiredBaseBorrowApr]"
            />
          </v-col>
          <v-col cols="1" class="mb-4 mr-2 dataInfo d-flex justify-end"> % </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row class="ma-0 pt-3 d-flex align-center justify-end">
      <v-btn class="buttonRight ma-0 pa-0" text @click="advancedFlag = !advancedFlag">
        <h3 class="text-left">{{ advanced.text }}</h3>
        <v-icon color="#828282" large right>{{ advanced.icon }}</v-icon>
      </v-btn>
    </v-row>
    <template v-if="advancedFlag">
      <v-card flat class="container pt-0 mr-0" width="50%">
        <v-row class="ma-0 py-3 d-flex align-center">
          <v-col class="pa-0">
            <h3>Blocks per year:</h3>
          </v-col>
          <v-col cols="6" class="dataInput">
            <v-text-field
              v-model="blocksPerYear"
              type="number"
              solo
              flat
              :rules="[rules.requiredBlocksPerYear]"
            />
          </v-col>
        </v-row>
        <v-row class="ma-0 py-3 d-flex align-center">
          <v-col class="pa-0">
            <h3>Utilization rate:</h3>
          </v-col>
          <v-col cols="6" class="dataInput">
            <v-row class="ma-0">
              <v-col>
                <v-text-field
                  v-model="utilizationRate"
                  type="number"
                  solo
                  flat
                  :rules="[rules.requiredUtilizationRate]"
                />
              </v-col>
              <v-col cols="1" class="mb-4 mr-2 dataInfo d-flex justify-end"> % </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </template>
    <v-row class="my-5 d-flex justify-center">
      <v-btn class="button" rounded color="#3e954a" :disabled="!validForm" @click="createMarket">
        Next
      </v-btn>
    </v-row>
    <v-snackbar v-model="showSnackbar" centered color="error" elevation="24" :multi-line="true">
      {{ error }}
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: 'MarketCreateInput',
  data() {
    return {
      tokenAddress: null,
      marketPrice: 0,
      baseBorrowApr: 0,
      advancedFlag: false,
      advanced: {
        text: 'Advanced',
        icon: 'arrow_drop_down',
      },
      blocksPerYear: 1e6,
      utilizationRate: 20,
      error: null,
      showSnackbar: false,
      rules: {
        requiredAddress: () => !!this.tokenAddress || 'Required.',
        requiredMarketPrice: () => !!Number(this.marketPrice) || 'Required.',
        requiredBaseBorrowApr: () => !!Number(this.baseBorrowApr) || 'Required.',
        requiredBlocksPerYear: () => !!Number(this.blocksPerYear) || 'Required.',
        requiredUtilizationRate: () => !!Number(this.utilizationRate) || 'Required.',
        address: () => /^0x[a-fA-F0-9]{40}$/.test(this.tokenAddress) || 'Not a valid address',
      },
    }
  },
  computed: {
    validForm() {
      return (
        typeof this.rules.requiredAddress() !== 'string' &&
        typeof this.rules.address() !== 'string' &&
        typeof this.rules.requiredMarketPrice() !== 'string' &&
        typeof this.rules.requiredBaseBorrowApr() !== 'string' &&
        typeof this.rules.requiredBlocksPerYear() !== 'string' &&
        typeof this.rules.requiredUtilizationRate() !== 'string'
      )
    },
  },
  watch: {
    advancedFlag() {
      if (this.advancedFlag) {
        this.advanced.icon = 'arrow_drop_up'
        this.advanced.text = 'Advanced Market Details'
      } else {
        this.advanced.icon = 'arrow_drop_down'
        this.advanced.text = 'Advanced'
        this.blocksPerYear = 1e6
        this.utilizationRate = 20
      }
    },
  },
  methods: {
    reset() {
      this.advancedFlag = false
      this.tokenAddress = null
      this.marketPrice = 0
      this.baseBorrowApr = 0
      this.blocksPerYear = 1e6
      this.utilizationRate = 20
      this.showSnackbar = false
      this.marketExists = false
    },
    async checkMarketExistence() {
      //removed - not being used - 2020-12-28
    },
    async createMarket() {
      //removed - not being used - 2020-12-28
    },
  },
}
</script>
