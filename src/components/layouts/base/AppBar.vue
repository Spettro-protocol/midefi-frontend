<template>
  <Fragment>
    <div class="system-var-beta">
      <v-system-bar dark color="black" dense fixed app>
        <v-spacer></v-spacer>

        <span class="d-none d-sm-none d-md-flex">
          This website is still in <a target="_blank" href="/terms"> BETA</a>. This means MIDeFi is
          in a testing phase and it is likely to contain errors
        </span>
        <span class="d-sm-flex d-md-none d-lg-none d-xl-none">
          This website is still in <a target="_blank" href="/terms"> BETA</a>.
        </span>
        <v-spacer></v-spacer>
      </v-system-bar>
      <br />
    </div>
    <v-app-bar flat clipped-left class="app-bar" color="transparent">
      <v-toolbar flat fill-height align-center m-0 p-0 class="app-toolbar">
        <v-app-bar-nav-icon
          v-if="$route.path.includes('doc') || $route.path.includes('faq')"
          class="hidden-md-and-up"
          @click.stop="emitCloseDrawer"
        ></v-app-bar-nav-icon>
        <v-btn large text class="title-button" @click="gotToLanding">
          <v-app-bar-title>
            <!-- <h2 v-show="isTestnet" class="red--text text--darken-1">Testnet</h2> -->
          </v-app-bar-title>
          <v-img class="title-logo" :src="require(`@/assets/mi_invert.png`)" alt="rLending logo" />
        </v-btn>
        <v-spacer></v-spacer>

        <v-toolbar-items v-if="isLogged" class="hidden-sm-and-down align-center">
          <v-btn text to="/myActivity" active-class="is-active" exact>Dashboard</v-btn>
          <v-btn text to="/supplyBorrow" active-class="is-active" exact>Supply/Borrow</v-btn>
          <v-btn text to="/swap" active-class="is-active" exact>Swap</v-btn>
          <v-btn text to="/status" active-class="is-active" exact>Markets</v-btn>
          <v-btn text to="/docs/introduction" active-class="is-active" exact>Docs</v-btn>
          <v-btn text to="/faq" active-class="is-active" exact>FAQs</v-btn>
          <v-btn rounded outlined class="disconnected-btn">
            {{ accountCutOff }}
          </v-btn>
        </v-toolbar-items>

        <v-toolbar-items v-if="!isLogged" class="hidden-sm-and-down align-center">
          <v-btn text to="/" active-class="is-active" exact>Home</v-btn>
          <v-btn text to="/status" active-class="is-active" exact>Markets</v-btn>
          <v-btn text to="/docs/introduction" active-class="is-active" exact>Docs</v-btn>
          <v-btn text to="/faq" active-class="is-active" exact>FAQs</v-btn>
          <v-btn
            id="connectButton"
            ref="connectButton"
            style="background-color: green !important"
            rounded
            class="connected-btn"
            @click="connect"
          >
            Connect wallet
          </v-btn>
        </v-toolbar-items>
        <v-toolbar-items class="hidden-md-and-up align-center">
          <v-menu bottom left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn dark icon color="black" v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>

            <DisconnectedDropdown v-if="!isLogged" :connect="connect" />
            <ConnectedDropdown v-if="isLogged" :account="accountCutOff" />
          </v-menu>
        </v-toolbar-items>
      </v-toolbar>
    </v-app-bar>
    <v-alert
      dismissible
      border="left"
      colored-border
      type="error"
      elevation="2"
      :value="shouldDisplayWarningValidNetwork"
    >
      The network you are trying to connect is not supported...
    </v-alert>
    <template>
      <Snackbar />
    </template>
  </Fragment>
</template>

<script>
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
import * as constants from '@/store/constants'
import Vue from 'vue'
import { ethers } from 'ethers'
import { Fragment } from 'vue-fragment'
import { NETWORK_ID } from '@/config/constants'
import Snackbar from '@/components/common/Snackbar.vue'
import DisconnectedDropdown from '@/components/layouts/base/menues/disconnectedDropdown.vue'
import ConnectedDropdown from '@/components/layouts/base/menues/connectedDropdown.vue'

export default {
  name: 'AppBar',
  components: {
    Fragment,
    Snackbar,
    ConnectedDropdown,
    DisconnectedDropdown,
  },
  data() {
    return {
      shouldDisplayWarningValidNetwork: false,
      isTestnet: false,
    }
  },
  computed: {
    ...mapGetters({
      isLogged: constants.SESSION_IS_LOGGED,
    }),
    ...mapState({
      account: (state) => state.Session.account,
      isOwner: (state) => state.Session.isOwner,
    }),
    title() {
      if (this.$route.path === '/supplyBorrow') return 'Supply/Borrow'
      if (this.$route.path === '/myActivity') return 'My Activity'
      if (this.$route.path === '/status') return 'Status'
      return ''
    },
    accountCutOff() {
      return `${this.account?.substring(0, 4)}...${this.account?.substring(
        this.account.length - 4,
        this.account.length,
      )}`
    },
  },
  watch: {
    isOwner(val) {
      if (val) this.$router.push({ name: 'Status' })
    },
    isLogged(val) {
      if (val) this.$router.push({ name: 'SupplyBorrow' })
    },
  },
  async created() {
    this.isTestnet = NETWORK_ID === 3 || NETWORK_ID === 1337 || NETWORK_ID === 4002
    setTimeout(() => this.connect(), 1000)
  },
  methods: {
    ...mapActions({
      connectToWeb3: constants.SESSION_CONNECT_WEB3,
    }),
    validateNetwork(chainId) {
      this.shouldDisplayWarningValidNetwork = NETWORK_ID != parseInt(chainId)
      // Close the alert in 5 seconds
      setTimeout(() => {
        this.shouldDisplayWarningValidNetwork = false
      }, 5000)
    },
    gotToLanding() {
      if (this.$route.path !== '/') this.$router.push({ name: 'Landing' })
    },
    async connect() {
      try {
        // eslint-disable-next-line no-undef
        const chainId = window?.ethereum?.chainId ?? 0
        console.log('chainId', chainId)
        console.log('NETWORK_ID', NETWORK_ID)
        this.validateNetwork(chainId)
        // const rLoginResponse = await this.$rLogin.connect()

        const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
        await provider.send('eth_requestAccounts', [])

        this.$provider = provider
        this.$provider.on('accountsChanged', () => {
          window.location.reload(false)
        })
        this.$provider.on('error', (error) => {
          throw error
        })
        this.$provider.on('chainChanged', () => {
          window.location.reload(false)
        })
        Vue.provider = this.$provider
        this.$web3Provider = new ethers.providers.Web3Provider(this.$provider)
        // Fix transaction format from etherjs getTransactionReceipt as transactionReceipt format
        // checks root to be a 32 bytes hash when on RSK its 0x01
        const format = this.$web3Provider.formatter.formats
        format.receipt.root = format.receipt.logsBloom
        Object.assign(this.$web3Provider.formatter, { format })
        // Vue.web3Provider = this.$web3Provider
        Vue.web3Provider = Vue.provider
        this.connectToWeb3()
      } catch (e) {
        this.$rLogin.clearCachedProvider()
      }
    },
    emitCloseDrawer() {
      this.setDrawer()
    },
    ...mapMutations({
      setDrawer: constants.DRAWER_SET,
    }),
  },
}
</script>
