<template>
  <v-container>
    <v-row>
      <v-col cols="3" class="hidden-sm-and-down">
        <DocSideMenu />
      </v-col>
      <v-col :class="colSize">    
    <section>
      <h2 id="oracle">Oracles:</h2>
      <p>
        A Price Oracle maintains the current exchange rate of each supported asset. These values are
        used to determine borrowing capacity, collateral requirements and for all functions which
        require calculating the value equivalent of an account.
      </p>
      <p>
        Although <a href="/docs/keyConcepts#interestModel">interest rates</a> are determined by the
        balance between supply and demand, <strong>MIDefi</strong> relies partially on market
        prices. Since the protocol has the ability of listing dozens of markets, each requiring
        it&#39;s own Oracle with it&#39;s own set of rules,
        <strong>we created a customizable Oracle subsystem</strong> as part of the
        <strong>MIDefi Protocol</strong>.
      </p>
    </section>
    <section>
      <h2 id="architecture">Architecture:</h2>

          <p>
            <strong>MIDefi</strong>&#39;s Oracle subsystem is comprised by a set of
            <a href="https://github.com/riflending/rlending-protocol/tree/master/contracts"
              >smart contracts</a
            >.
          </p>

          <p>
            The main smart contract is the
            <a
              href="https://github.com/riflending/rlending-protocol/tree/master/contracts/PriceOracleProxy.sol"
              >PriceOracleProxy</a
            >. This contract acts as the single point of price consultation for the entire platform.
          </p>
          <p>
            Since there is no standard on how Oracles report their values and each market listed in
            the protocol requires an independent interaction with an oracle that provides its
            current exchange rate, we included an &quot;Adapter&quot; layer that acts as a
            middle-man between the
            <em>PriceProxyOracle</em> and the actual Oracle Contracts providing rates for each
            market.
          </p>
          <p>
            In order to preserve decentralization,
            <strong>MIDefi</strong> does not manage any of the oracles the protocol is currently
            using. We will talk in detail about this in the next section
            <a href="#security">Security and Audits</a>.
          </p>
          <p>Here is a diagram on the current state of the Oracle subsystem:</p>
          <p align="center">
            <v-img
              contain
              max-height="650"
              max-width="850"
              src="@/assets/docs/oracles.png"
              alt="Oracles Subsystem Graph"
            />
          </p>
        </section>
        <div class="pan-container">
          <a href="/docs/contracts">&laquo; Contracts</a>
          <a href="#">Back to top</a>
          <a href="/docs/securityAudits">Security and audits &raquo;</a>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DocSideMenu from './DocSideMenu'

export default {
  name: 'Oracles',
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
}
</script>
