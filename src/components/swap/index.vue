<template>
  <v-card v-if="dataLoaded" class="swap mx-auto py-4 px-3" width="400px" rounded="xl" elevation="6">
    <!-- <h2>Swap</h2> -->
    <v-flex class="mt-3 d-flex flex-row">
      <v-text-field
        class="mr-3"
        style="font-size: 24px"
        solo
        rounded
        large
        v-model="amountInput"
        inputmode="decimal"
        autocomplete="off"
        autocorrect="off"
        type="text"
        pattern="^[0-9]*[.,]?[0-9]*$"
        placeholder="0.0"
        minlength="1"
        maxlength="79"
        spellcheck="false"
        @keyup="
          getAmountsOut(+amountInput, tokens[data.input].address, tokens[data.output].address).then(
            (amount) => {
              amountOutput = amount
              current = 'input'
            },
          )
        "
      ></v-text-field>
      <v-btn large rounded @click.stop="onInputTokenClicked()">
        <v-img
          v-if="data.input !== ''"
          class="mr-2"
          width="28px"
          :src="`https://assets.spookyswap.finance/tokens/${data.input}.png`"
        />
        {{ data.input === '' ? 'Select' : data.input }}
      </v-btn>
    </v-flex>
    <div class="d-flex">
      <svg
        class="mx-auto"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#000000"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <polyline points="19 12 12 19 5 12"></polyline>
      </svg>
    </div>
    <v-flex class="mt-3 d-flex flex-row">
      <v-text-field
        class="mr-3"
        style="font-size: 24px"
        solo
        rounded
        large
        v-model="amountOutput"
        inputmode="decimal"
        autocomplete="off"
        autocorrect="off"
        type="text"
        pattern="^[0-9]*[.,]?[0-9]*$"
        placeholder="0.0"
        minlength="1"
        maxlength="79"
        spellcheck="false"
        @keyup="
          getAmountsIn(+amountOutput, tokens[data.input].address, tokens[data.output].address).then(
            (amount) => {
              amountInput = amount
              current = 'output'
            },
          )
        "
      ></v-text-field>
      <v-btn
        large
        rounded
        @click.stop="
          dialog = true
          current = 'output'
        "
      >
        <v-img
          v-if="data.output !== ''"
          class="mr-2"
          width="28px"
          :src="`https://assets.spookyswap.finance/tokens/${data.output}.png`"
        />
        {{ data.output === '' ? 'Select' : data.output }}
      </v-btn>
    </v-flex>
    <v-btn v-if="amountInput != 0" large rounded block color="error" @click="onBtnClick()">{{
      btnStatus ? 'Swap' : 'Approve'
    }}</v-btn>
    <v-btn v-else large rounded block color="error" disabled>{{
      btnStatus ? 'Swap' : 'Approve'
    }}</v-btn>

    <template>
      <div class="text-center">
        <v-dialog v-model="dialog" width="400">
          <v-card>
            <v-card-title class="text-h5 grey lighten-2"> Select a token </v-card-title>
            <v-list>
              <v-list-item-group color="primary">
                <v-list-item v-for="(token, i) in tokens" :key="i" @click="onTokenSelect(i)">
                  <v-list-item-icon>
                    <v-img
                      class="mr-2"
                      width="28px"
                      :src="`https://assets.spookyswap.finance/tokens/${i}.png`"
                    />
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="i"></v-list-item-title>
                    <!-- <v-list-item-subtitle v-text="market.token.name"></v-list-item-subtitle> -->
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-dialog>
      </div>
    </template>
  </v-card>
  <v-card v-else flat class="loader d-flex align-center justify-center">
    <div class="container">
      <v-row class="my-5 d-flex justify-center">
        <v-progress-circular indeterminate :size="80" color="#3e954a" />
      </v-row>
    </div>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Swap',
  components: {},
  data() {
    return {
      dialog: false,
      tokens: {},
      data: {
        input: '',
        output: '',
      },
      current: '',
      dataLoaded: false,
      amountInput: 0,
      amountOutput: 0,
      btnStatus: null,
    }
  },
  watch: {},
  async created() {
    this.tokens = await this.$middleware.getTokens()
    this.dataLoaded = true
    setInterval(this.onTime, 10000)
  },
  methods: {
    async getAmountsIn(amountOut, tokenIn, tokenOut) {
      return (
        (await this.$middleware.getAmountsIn(
          (amountOut * 10 ** this.tokens[this.data.output].decimals).toString(),
          tokenIn,
          tokenOut,
        )) /
        10 ** this.tokens[this.data.input].decimals
      )
    },
    async getAmountsOut(amountIn, tokenIn, tokenOut) {
      return (
        (await this.$middleware.getAmountsOut(
          (amountIn * 10 ** this.tokens[this.data.input].decimals).toString(),
          tokenIn,
          tokenOut,
        )) /
        10 ** this.tokens[this.data.output].decimals
      )
    },
    async onInputTokenClicked() {
      this.dialog = true
      this.current = 'input'
    },
    async onTokenSelect(i) {
      this.dialog = false
      this.data[this.current] = i
      if (this.current === 'input') {
        let allow = await this.$middleware.allowanceToken(this.account, this.data.input)
        if (allow) this.btnStatus = true
        else this.btnStatus = false
      }
    },
    async approve(token) {
      await this.$middleware.approveTokenWithMaxUint(token)
      this.btnStatus = true
    },
    async onTime() {
      let allow = await this.$middleware.allowanceToken(this.account, this.data.input)
      if (allow) this.btnStatus = true
      else this.btnStatus = false
      if (this.current == 'input') {
        if (+this.amountInput == 0) return
        this.getAmountsOut(
          +this.amountInput,
          this.tokens[this.data.input].address,
          this.tokens[this.data.output].address,
        ).then((amount) => {
          this.amountOutput = amount
        })
      } else {
        if (+this.amountOutput == 0) return
        this.getAmountsIn(
          +this.amountOutput,
          this.tokens[this.data.input].address,
          this.tokens[this.data.output].address,
        ).then((amount) => {
          this.amountInput = amount
        })
      }
    },
    async onBtnClick() {
      if (this.btnStatus) {
        if (this.current == 'input') {
          if (this.data.input == 'FTM') {
            this.$middleware.swapExactETHForTokens(
              (this.amountInput * 10 ** 18).toString(),
              this.tokens[this.data.output].address,
              this.account,
            )
          } else if (this.data.output == 'FTM') {
            this.$middleware.swapExactTokensForETH(
              (this.amountInput * 10 ** this.tokens[this.data.input].decimals).toString(),
              this.tokens[this.data.input].address,
              this.account,
            )
          } else {
            this.$middleware.swapExactTokensForTokens(
              (this.amountInput * 10 ** this.tokens[this.data.input].decimals).toString(),
              this.tokens[this.data.input].address,
              this.tokens[this.data.output].address,
              this.account,
            )
          }
        } else {
          if (this.data.input == 'FTM') {
            this.$middleware.swapETHForExactTokens(
              (this.amountInput * 10 ** 18).toString(),
              (this.amountOutput * 10 ** this.tokens[this.data.output].decimals).toString(),
              this.tokens[this.data.output].address,
              this.account,
            )
          } else if (this.data.output == 'FTM') {
            this.$middleware.swapTokensForExactETH(
              (this.amountOutput * 10 ** 18).toString(),
              this.tokens[this.data.input].address,
              this.account,
            )
          } else {
            this.$middleware.swapTokensForExactTokens(
              (this.amountOutput * 10 ** this.tokens[this.data.output].decimals).toString(),
              this.tokens[this.data.input].address,
              this.tokens[this.data.output].address,
              this.account,
            )
          }
        }
      } else {
        await this.approve(this.data.input)
      }
    },
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
  },
}
</script>
