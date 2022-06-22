<template>
  <div class="settings">
    <h1>Settings</h1>
    <ControllerForm />
    <MarketForm @marketCreated="getMarkets" />
    <MarketsList :market-addresses="marketAddresses" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ControllerForm from '@/components/settings/ControllerForm.vue'
import MarketForm from '@/components/settings/MarketForm.vue'
import MarketsList from '@/components/settings/MarketsList.vue'

export default {
  name: 'Settings',
  components: {
    ControllerForm,
    MarketForm,
    MarketsList,
  },
  data() {
    return {
      marketAddresses: [],
    }
  },
  computed: {
    ...mapState({
      isOwner: (state) => state.Session.isOwner,
      account: (state) => state.Session.account,
    }),
    pageHeight() {
      return document.body.scrollHeight
    },
  },
  watch: {
    isOwner(val) {
      if (!val) {
        this.$router.push({ name: 'MyActivity' })
      }
    },
    marketAddresses() {
      this.$vuetify.goTo(this.pageHeight)
    },
  },
  async created() {
    await this.getMarkets(this.account)
  },
  methods: {
    getMarkets() {
      this.$middleware.getMarkets(this.account).then((mkts) => {
        this.marketAddresses = mkts.map((mkt) => mkt.address)
      })
    },
  },
}
</script>
