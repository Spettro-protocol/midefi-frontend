<template>
  <v-container>
    <v-row>
      <v-col cols="3" class="hidden-sm-and-down">
        <DocSideMenu />
      </v-col>
      <v-col :class="colSize">
        <section>
          <h2>Introduction:</h2>
          <p>
            <strong>MIDefi</strong> is a decentralized investment and finance (DEFI) platform that
            takes advantage on <strong>Bitcoin</strong>&#39;s stability and the
            <strong>MIDefi ecosystem</strong> to allow users to invest in a safe way.
          </p>
          <p>
            <strong>MIDefi-protocol</strong> is based upon our own core of
            <a href="https://github.com/riflending/rlending-protocol">Smart Contracts</a>
            which form an algorithmic distributed protocol deployed on the MIDefi network. This
            protocol defines pools of assets with algorithmically derived
            <a href="/docs/keyConcepts#interestModel">interest rates</a>, based on the supply and
            demand for the assets. Suppliers (and borrowers) of an asset interact directly with the
            protocol, earning (and paying) a floating interest rate, without having to negotiate
            terms such as maturity, interest rate or collateral with a peer or counterparty.
          </p>
          <p>
            Our main motivation is to allow users to lend crypto assets as collateral and to borrow
            them based on interest rates set by real-time supply and demand.
          </p>
          <p>
            In other words:
            <strong
              >Lenders earn revenue in exchange for their supplied assets and borrowers pay
              interests for the assets they used.</strong
            >
          </p>
          <p>
            In this pages we&#39;ll guide you through some of the basic features you will most
            likely be interested in using.
          </p>
        </section>
        <div class="pan-container">
          <a>&laquo; -</a>
          <a href="#">Back to top</a>
          <a href="/docs/keyConcepts">Key concepts &raquo;</a>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import DocSideMenu from './DocSideMenu'
import * as constants from '@/store/constants'
import { mapMutations } from 'vuex'

export default {
  name: 'Introduction',
  components: {
    DocSideMenu,
  },
  computed: {
    colSize() {
      const breakPoint = this.$vuetify.breakpoint.name
      if (breakPoint === 'xs' || breakPoint === 'sm') return 'col-12'
      return 'col-9'
    },
  },
  created() {
    this.emitDrawer()
  },
  methods: {
    emitDrawer() {
      this.setDrawerProperty({ isDoc: true })
      this.setDrawerProperty({ isFaq: false })
    },
    ...mapMutations({
      setDrawerProperty: constants.DRAWER_SET_PROPERTY,
    }),
  },
}
</script>
