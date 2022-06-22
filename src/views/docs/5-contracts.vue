<template>
  <v-container>
    <v-row>
      <v-col cols="3" class="hidden-sm-and-down">
        <DocSideMenu />
      </v-col>
      <v-col :class="colSize">
        <section>
          <h2 id="architecture">Architecture:</h2>
          <p align="center">
            <v-img
              contain
              max-height="650"
              max-width="850"
              src="@/assets/docs/contractGraph.png"
              alt="Architecture Graph"
            />
          </p>
        </section>
        <section>
          <h2 id="ctokensContracts">cTokens:</h2>
          <p>
            cTokens are the primary means of interacting with the
            <strong>MIDefi</strong> Protocol; when a user mints, redeems, borrows, repays a
            borrow, liquidates a borrow, or transfers cTokens, she will do so using the cToken
            contract.
          </p>
          <p>
            There are currently two types of cTokens: CErc20 and CRBTC. Though both types expose the
            EIP-20 interface, CErc20 wraps an underlying ERC-20 asset, while CRBTC simply wraps rBTC
            itself. As such, the core functions which involve transferring an asset into the
            protocol have slightly different interfaces depending on the type, each of which is
            shown below.
          </p>
          <p>
            Remember that the amount of rBTC that can be exchanged for cRBTC increases every rBTC
            block, which is about every 30 seconds. This means that the exchange rate of underlying
            to cToken increases over time. There is no minimum or maximum amount of time that
            suppliers need to keep their asset in the protocol. See the varying exchange rate for
            each cToken by clicking selecting one from the list at
            <a href="www.rlending.app/status"><strong>MIDefi</strong> market status</a>.
          </p>
        </section>
        <section>
          <h2 id="riskManagement">Risk Management:</h2>
          <p>
            The risk management layer of the <strong>MIDefi</strong> protocol is comprised of
            <strong>Comptroller</strong>, <strong>Unitroller</strong> and the
            <a href="/docs/keyConcepts#interestModel">interest rate models</a>.
            <strong>Comptroller</strong> is the main contract that determines how much collateral a
            user is required to maintain and whether (and by how much) a user can be liquidated.
            Each time a user interacts with a cToken, the <strong>Comptroller</strong> is asked to
            approve or deny the transaction.
          </p>
          <p>
            The <strong>Comptroller</strong> maps user balances to prices (via the Price Oracle) to
            risk weights (called Collateral Factors) to make its determinations. Users explicitly
            list which assets they would like included in their risk scoring, by calling Enter
            Markets and Exit Market (toggling each market in the Supply / Borrow tab).
          </p>
          <p>
            The <strong>Comptroller</strong> is implemented as an upgradeable proxy. This means the
            <strong>Unitroller</strong> proxies all logic to the
            <strong>Comptroller</strong> implementation, but storage values are actually set on the
            <strong>Unitroller</strong>.
          </p>
        </section>
        <section>
          <h2 id="oracleExplain">Oracles:</h2>
          <p>
            An oracle is a way for a blockchain or smart contract to interact with external data.
            Since
            <em>DEFI</em> usually requires the interaction with real life information (<em
              >i.e. the current rBTC price</em
            >), Oracles are a critical component in every serious project. In the next section, the
            <strong>MIDefi</strong> Oracle subsystem is explained in detail.
          </p>
        </section>
        <section>
          <h2 id="testnet">Testnet Deploy:</h2>
          <ul>
            <li class="mb-4">
              Unitroller:
              <a
                href="https://explorer.testnet.rsk.co/address/0x3a983c7597b3ac4fbc3e0cf484d7631d70d04c05"
                >0x3a983C7597B3ac4fbC3E0Cf484d7631D70D04C05</a
              >
            </li>
            <li class="mb-4">
              PriceOracleProxy:
              <a
                href="https://explorer.testnet.rsk.co/address/0xbe898c9fc63c0185bc6e403e7b9c12e341a60aa7"
                >0xBE898C9fC63c0185Bc6E403E7B9C12e341a60Aa7</a
              >
            </li>
            <li class="mb-4">
              RIF PriceOracleAdapter:
              <a
                href="https://explorer.testnet.rsk.co/address/0x5a9003e5f443607b7e0491dc27cad6796d309055"
                >0x5a9003E5f443607b7E0491dc27cAd6796D309055</a
              >
            </li>
            <li class="mb-4">
              RBTC PriceOracleAdapter:
              <a
                href="https://explorer.testnet.rsk.co/address/0xc02c09c578ae2680796e33f6662b779580cd84b6"
                >0xc02c09c578ae2680796e33f6662b779580cd84b6</a
              >
            </li>
            <li class="mb-4">
              Comptroller (logic only): 0x2e64b3acd75d86a8Ff17B98e02dAe4dCf2852a94
            </li>
            <li class="mb-4">
              JumpRateModelV2:
              <a
                href="https://explorer.testnet.rsk.co/address/0xf8b35564e85800d60043ccdde0af47ba3463b6ce"
                >0xf8B35564E85800d60043CcDde0Af47Ba3463b6cE</a
              >
            </li>
            <li class="mb-4">
              WhitePaperInterestRateModel:
              <a
                href="https://explorer.testnet.rsk.co/address/0xa9a4da01daea36da9000f83f34691ba6132e5e87"
                >0xA9a4Da01DaeA36DA9000F83F34691Ba6132e5E87</a
              >
            </li>
            <li class="mb-4">
              cRIF:
              <a
                href="https://explorer.testnet.rsk.co/address/0x4664d4cbd5104a0e974354724cbc8e0d9bd1aca3"
                >0x4664D4cbd5104a0E974354724cbC8e0D9BD1ACA3</a
              >
            </li>
            <li class="mb-4">
              cRBTC:
              <a
                href="https://explorer.testnet.rsk.co/address/0xc19f0882bf318c9f8767c7d520018888e878417b"
                >0xc19F0882bf318C9f8767C7d520018888E878417b</a
              >
            </li>
            <li class="mb-4">
              RLEN:
              <a
                href="https://explorer.testnet.rsk.co/address/0xcd87f7a5b353ff167a8543908649518a0c3454c1"
                >0xcd87F7A5b353ff167a8543908649518a0c3454c1</a
              >
            </li>
            <li class="mb-4">
              Maximillion:
              <a
                href="https://explorer.testnet.rsk.co/address/0x0b33fa12e3363a8cb22dc8c53a1cccb6267bea6a"
                >0x0b33fa12e3363a8cb22DC8c53A1ccCb6267bEa6a</a
              >
            </li>
            <li class="mb-4">
              MIDefiLens:
              <a
                href="https://explorer.testnet.rsk.co/address/0xef9a1856f3cd3b5da7104524065a3d6cc9b7a4b3"
                >0xeF9a1856F3cd3b5da7104524065a3d6Cc9b7a4b3</a
              >
            </li>
          </ul>
        </section>
        <section>
          <h2 id="mainnet">Main Net:</h2>
          <p>Coming soon...</p>
        </section>
        <div class="pan-container">
          <a href="/docs/financialMath">&laquo; Financial Math</a>
          <a href="#">Back to top</a>
          <a href="/docs/oracles">Oracles &raquo;</a>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DocSideMenu from './DocSideMenu'

export default {
  name: 'Contracts',
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
