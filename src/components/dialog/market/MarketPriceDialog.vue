<template>
  <v-dialog v-model="flag" width="350" :persistent="waiting || success">
    <v-card v-click-outside="onClickOutside" class="market-price-dialog dialog container">
      <template v-if="!waiting && !success && !error">
        <div>
          <v-row class="mt-2 d-flex align-center">
            <v-col cols="3" class="ml-2 d-flex justify-end">
              <v-img
                class="ml-5"
                :src="require(`@/assets/tokens/${data.token.logo}.png`)"
                :alt="`token ${data.token.logo} icon`"
                contain
                height="70"
              />
            </v-col>
            <v-col cols="3" class="d-flex justify-center">
              <h1 class="ma-0">{{ data.token.symbol }}</h1>
            </v-col>
            <v-col />
            <v-col cols="3" class="mr-5">
              <v-row>
                <h2>price:</h2>
              </v-row>
              <v-row class="item d-flex justify-start">
                <span>{{ price | formatPrice }}</span
                ><span class="ml-2 itemInfo">usd</span>
              </v-row>
            </v-col>
          </v-row>
        </div>
        <div class="marketDialog">
          <v-row class="mx-5">
            <h3>Input new price:</h3>
          </v-row>
          <v-row class="mx-5">
            <v-text-field
              v-model="newPrice"
              class="bigger-data-input"
              full-width
              single-line
              solo
              flat
              type="number"
              required
              :rules="[rules.required, rules.integer]"
            />
          </v-row>
          <v-row class="mb-1 d-flex justify-center">
            <v-btn class="button" color="#3e954a" :disabled="!validForm" @click="setPrice">
              Modify market price
            </v-btn>
          </v-row>
        </div>
      </template>
      <template v-else>
        <ErrorDialog v-if="error" @closeDialog="closeMarketPrice" />
        <Loader v-if="waiting" />
        <MarketPriceSuccess v-if="success" :price="newPrice" @closed="closeMarketPrice" />
      </template>
    </v-card>
  </v-dialog>
</template>

<script>
import Loader from '@/components/common/Loader.vue'
import MarketPriceSuccess from '@/components/dialog/market/MarketPriceSuccess.vue'
import ErrorDialog from '@/components/dialog/ErrorDialog.vue'

export default {
  name: 'MarketPriceDialog',
  components: {
    Loader,
    MarketPriceSuccess,
    ErrorDialog,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      flag: this.data.flag,
      waiting: false,
      success: false,
      price: 0,
      newPrice: 0,
      error: false,
      rules: {
        required: () => !!Number(this.newPrice) || 'Required.',
        integer: () => !this.newPrice.toString().includes('.') || 'Not decimal positions allowed.',
      },
    }
  },
  computed: {
    validForm() {
      return typeof this.rules.required() !== 'string' && typeof this.rules.integer() !== 'string'
    },
  },
  created() {
    this.data.market.getPrice(this.data.market.address).then((marketPrice) => {
      this.price = marketPrice
    })
  },
  methods: {
    onClickOutside() {
      if (!this.waiting && !this.success) {
        this.flag = false
        this.$emit('closed')
      }
    },
    closeMarketPrice() {
      this.flag = false
      this.$emit('closed')
    },
    setPrice() {
      //removed - not being used - 2020-12-28
    },
  },
}
</script>
