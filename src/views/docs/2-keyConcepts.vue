<template>
  <v-container>
    <v-row>
      <v-col cols="3" class="hidden-sm-and-down">
        <DocSideMenu />
      </v-col>
      <v-col :class="colSize">    
    <section>
      <h2 id="account">Account:</h2>
      <p>
        In <strong>MIDefi</strong>, each account is represented by the
        <strong>rBTC</strong> address that holds the assets and administers the transactions.
      </p>
    </section>
    <section>
      <h2 id="markets">Markets:</h2>
      <p>
        The smart contracts that power the <strong>MIDefi Protocol</strong> are deployed to the
        MIDefi blockchain. This means that at the time of this guide’s writing, the only types of
        assets that <strong>MIDefi</strong> can support are rBTC and ERC-20 tokens deployed on
        MIDefi.
      </p>
      <p>
        <strong>Markets</strong> are the internal architecture <strong>MIDefi</strong> uses for
        representing each asset listed in the protocol. They are essentially
        <em>a large pool of liquidity</em> that is formed by users providing liquidity and at the
        same time it is available for other users to <a href="#borrowingAssets">borrow</a>.
        Borrowers pay back their interests to the pool as they share in the interest with suppliers.
        In other words: Every supply earns interests and in order to borrow an asset, users must
        first supply collateral to a market.
      </p>
      <p>
        <strong
          >Each underlying market is internally represented with a
          <a href="#ctokens">cToken</a>.</strong
        >
      </p>
    </section>
    <section>
      <h2 id="supplyingAssets">Supplying Assets:</h2>
      <p>
        Unlike an exchange or peer-to-peer platform, where a user’s assets are matched and lent to
        another user, the <strong>MIDefi Protocol</strong> aggregates the supply of each
        <a href="#account">account</a>, effectively generating a pool from each listed
        <a href="#markets">market</a>. In other words:
        <strong>when a user supplies an asset, it becomes a fungible resource</strong>. This
        approach offers <em>significantly</em> more liquidity than direct lending; unless every
        asset in a <a href="#markets">market</a> is borrowed (see below:
        <a href="#liquidity">liquidity</a>), users can <a href="#withdrawal">withdraw</a> their
        assets at any time, without waiting for a specific loan to mature.
      </p>
      <p align="center">
        <v-img
          contain
          max-height="450"
          max-width="450"
          src="@/assets/docs/supplyCycle.png"
          alt="supplyCycle"
        />
      </p>
      <p>
        Assets supplied to a <a href="#markets">market</a> are represented by an ERC-20 token
        balance (<a href="#ctokens">cToken</a>), which entitles the owner to an increasing quantity
        of the underlying asset. As the money <a href="#markets">market</a> accrues interest, which
        is a function of borrowing demand, cTokens become convertible into an increasing amount of
        the underlying asset.
        <strong>In this way, earning interest is as simple as holding a ERC-20 cToken.</strong>
      </p>
    </section>
    <section>
      <h2 id="borrowingAssets">Borrowing Assets:</h2>
      <p>
        <strong>MIDefi</strong> allows users to frictionlessly borrow from the protocol, using
        <a href="#ctokens">cTokens</a> as <a href="#collateral">collateral</a>,
        <em>for use anywhere in the MIDefi ecosystem</em>. Unlike peer-to-peer protocols, borrowing
        from <strong>MIDefi</strong> simply requires a user to specify a desired asset; there are
        no terms to negotiate, maturity dates, or funding periods;
        <strong>borrowing is instant and predictable</strong>.
      </p>
      <p align="center">
        <v-img
          contain
          max-height="450"
          max-width="450"
          src="@/assets/docs/borrowCycle.png"
          alt="borrowCycle"
        />
      </p>
      <p>
        to supplying an asset, each listed <a href="#markets">market</a> has a floating interest
        rate, set by market forces, which determines the borrowing cost for each asset.
      </p>
    </section>
    <section>
      <h2 id="ctokens">cTokens:</h2>
      <p>
        Each asset supported by the
        <a href="https://github.com/riflending/rlending-protocol"
          ><strong>MIDefi Protocol</strong></a
        >
        is integrated through a <strong>cToken Smart Contract subsystem</strong>, which is an
        <strong>EIP-20</strong> compliant representation of balances supplied to the protocol. By
        minting cTokens, users may: 1) Earn interest through the cToken&#39;s exchange rate, which
        increases in value relative to the <a href="#underlying">underlying asset</a>, and 2) Gain
        the ability to use cTokens as collateral for
        <a href="#borrowingAssets">borrowing assets</a>.
      </p>
    </section>
    <section>
      <h2 id="underlying">Underlying:</h2>
      <p>
        We say an asset is <strong> Underlying</strong> if it is integrated through a
        <a href="#ctokens">cToken</a>. For instance, <strong>RIF</strong> is the underlying token
        for the <strong>cRIF</strong> cToken.
      </p>
    </section>
    <section>
      <h2 id="interestModel">Utilization Rate:</h2>
      <p>
        The <strong>MIDefi Protocol</strong> utilizes an interest rate model that achieves an
        interest rate equilibrium, in each listed market, based on supply and demand. Following
        economic theory, interest rates should increase as a function of demand. When demand is low,
        interest rates should be low, and vice versa when demand is high.
      </p>
      <p>
        The utilization ratio <strong><em>U</em></strong> for each market
        <strong><em>a</em></strong>
        unifies supply and demand into a single variable that functions as a measure of current
        interest rates for the asset.
      </p>
      <p>
        <center>
          <em> U<sub>a</sub> = Borrows<sub>a</sub> / (Cash<sub>a</sub> + Borrows<sub>a</sub>) </em>
        </center>
      </p>
      <p>
        Each market has independent Interest Rate Models. As an example, borrowing interest rates
        may resemble the following equation:
      </p>
      <p>
        <center>
          <em> BorrowInterestRate<sub>a</sub> = 2.5% + U<sub>a</sub> * 20% </em>
        </center>
      </p>
      <p>
        In this scenario, the SupplyInterestRate is equal to the borrow interest rate, multiplied by
        the utilization rate (<strong
          ><em>U<sub>a</sub></em></strong
        >).
      </p>
      <p>
        <strong>The protocol does not guarantee liquidity.</strong> Instead, it relies on the
        interest rate model to incentivize it. In periods of extreme demand for an asset, the
        liquidity of the protocol (the tokens available to with draw or borrow) will decline; when
        this occur, interest rates rise, incentivizing supply and disincentivizing borrowing.
      </p>
    </section>
    <section>
      <h2 id="earningInterests">Earning Interests:</h2>
      <p>
        When users and applications supply an asset to the <strong>MIDefi Protocol</strong>, they
        begin <strong>earning a variable interest rate instantly</strong>. Interest accrues every
        block (currently ~30 seconds) and users can <a href="#withdrawal">withdraw</a> their
        principal plus interest anytime. Under the hood, users are contributing their assets to a
        large pool of liquidity (a “<a href="#markets">market”</a>) that is available for other
        users to <a href="#borrowingAssets">borrow</a>, and they share in the interest that
        borrowers pay back to the pool.
      </p>
      <p>
        When users supply assets, they receive <a href="#ctokens">cTokens</a> from
        <strong>MIDefi</strong> in exchange. cTokens are ERC20 tokens that can be redeemed for
        their underlying assets at any time. As interest accrues to the assets supplied, cTokens are
        redeemable at an exchange rate (relative to the underlying asset) that constantly increases
        over time, based on the rate of interest earned by the underlying asset.
      </p>
    </section>
    <section>
      <h2 id="collateral">Collateral:</h2>
      <p>
        Assets held by the protocol (represented by ownership of a
        <a href="#ctokens">cToken</a>) are used as collateral to
        <a href="#borrowingAssets">borrow</a> from the protocol. Each
        <a href="#markets">market</a> has a collateral factor, ranging from 0 to 1, that represents
        the portion of the underlying asset value that can be borrowed.
        <strong
          >The sum of the value of an <a href="#account">accounts</a> underlying token balances,
          multiplied by the collateral factors, equals a user’s borrowing capacity.</strong
        >
      </p>
      <p>
        Users are able to borrow up to, <em>but not exceeding</em>, their borrowing capacity, and an
        <a href="#account">account</a> can take no action (e.g. borrow, transfer cToken collateral,
        or redeem cToken collateral) that would raise the total value of borrowed assets above their
        borrowing capacity (<a href="#borrowlimit">borrow limit</a>); this protects the protocol
        from default risk.
      </p>
      <p>
        <strong>Collateral</strong> is the guarantee that users provide that allows them to borrow
        on any given <a href="#markets">market</a>. In order to supply collateral, users must first
        activate the <em>Enter Market</em> toggle.
      </p>
      <p>
        <strong>Note that a user cannot borrow without having supplied collateral first.</strong>
      </p>
    </section>
    <section>
      <h2 id="borrowLimit">Borrow Limit:</h2>
      <p>
        The max <a href="#borrowingAssets">borrowable</a> amount an
        <a href="#account">account</a> has on a given <a href="#markets">market</a>. This is
        calculated to be the account&#39;s <a href="#liquidity">liquidity</a> divided by the
        <a href="#marketPrice">market price</a> of the asset.
      </p>
    </section>
    <section>
      <h2 id="contractLiquidity">Contract Liquidity:</h2>
      <p>
        The amount of underlying asset currently stored in the
        <a href="#cTokens">cToken</a> contract representing the <a href="#markets">market</a>.
      </p>
    </section>
    <section>
      <h2 id="supplyBalance">Supply Balance:</h2>
      <p>
        The <a href="#account">account&#39;s</a> supply balance is given by
        <strong>the amount of <a href="#ctoken">cTokens</a> the account has</strong>, converted to
        underlying by the current <a href="#exchangeRate">exchange rate</a>.
      </p>
      <p>
        Remember that when users supply assets, they receive cTokens from
        <strong>MIDefi</strong> in exchange. cTokens are ERC20 tokens that can be redeemed (<a
          href="#withdrawal"
          >withdrawed</a
        >) for their underlying assets at any time.
      </p>
    </section>
    <section>
      <h2 id="exchangeRate">Exchange Rate:</h2>
      <p>
        The rate at which the protocol is currently converting between
        <strong><a href="#ctokens">cToken</a></strong> and <strong>Underlying assets</strong>. This
        rate is ever increasing with each new block passing and this is how suppliers earn they
        interests.
      </p>
    </section>
    <section>
      <h2 id="borrowBalance">Borrow Balance:</h2>
      <p>
        <strong
          >The amount of <a href="#ctoken">cTokens</a> the <a href="#account">account</a> has
          <a href="#borrowingAssets">borrowed</a></strong
        >
        on a given <a href="#markets">market</a>, converted to underlying by the current
        <a href="#exchangeRate">exchange rate</a>.
      </p>
    </section>
    <section>
      <h2 id="debt">Debt:</h2>
      <p>
        Debt is calculated to be
        <strong>the sum of all <a href="#borrowingAssets">borrowed</a> balances</strong>,
        represented in <strong>USD</strong> by converting it through the current
        <a href="#ctokens">cToken</a>-<a href="#underlying">Underlying</a>
        <a href="#exchangeRate">exchange rate</a> and multiplying by the
        <a href="#marketPrice">market price</a>.
      </p>
    </section>
    <section>
      <h2 id="liquidation">Liquidation:</h2>
      <p>
        A <a href="#borrowingAssets">borrowing</a> <a href="#account">account</a> becomes insolvent
        when the Borrow Balance exceeds the amount allowed by the collateral factor. When an
        <a href="#account">account</a> becomes insolvent, other users can repay a portion of its
        outstanding borrow in exchange for a portion of its collateral, with a liquidation incentive
        — currently set at 8\% but subject to change through <strong>MIDefi</strong>’s governance
        system. The liquidation incentive means that liquidators receive the borrower’s collateral
        at a 8\% discount to <a href="#marketPrice">market price</a>. Having your
        <a href="#account">account</a> liquidated is bad because you lose some of your collateral.
      </p>
      <p>
        A user who has negative <a href="#liquidity">account liquidity</a> is subject to liquidation
        by other users of the protocol to return his/her
        <a href="#liquidity">account liquidity</a> back to positive (i.e. above the collateral
        requirement). When a liquidation occurs, a liquidator may repay some or all of an
        outstanding borrow on behalf of a borrower and in return receive a discounted amount of
        collateral held by the borrower; this discount is defined as the liquidation incentive.
      </p>
      <p>
        A liquidator may close up to a certain fixed percentage (i.e. close factor) of any
        individual outstanding borrow of the <a href="#liquidation">underwater account</a>.
        Liquidators must interact with each cToken contract in which they wish to repay a borrow and
        seize another asset as collateral. When collateral is seized, the liquidator is transferred
        cTokens, which they may redeem the same as if they had supplied the asset themselves. Users
        must approve each cToken contract before calling liquidate (i.e. on the borrowed asset which
        they are repaying), as they are transferring funds into the contract.
      </p>
    </section>
    <section>
      <h2 id="closeFactor">Close Factor:</h2>
      <p>
        The percent, ranging from 0% to 100%, of <a href="#debt">debt</a> eligible to be closed in a
        single liquidate transaction, after an <a href="#account">account</a> has gone underwater.
        Accounts go underwater when they run out of <a href="#liquidity">liquidity</a> or their
        <a href="#healthFactor">Health Factor</a> becomes negative. If a user has multiple borrowed
        assets, the Close Factor applies to any single borrowed asset, not the aggregated value of a
        user’s outstanding borrowing.
      </p>
    </section>
    <section>
      <h2 id="liquidationIncentive">Liquidation Incentive:</h2>
      <p>
        The additional collateral given to liquidators as an incentive to perform liquidation of
        <a href="#liquidation">underwater accounts</a>. For example, if the liquidation incentive is
        1.1, liquidators receive an extra 10% of the borrowers collateral for every unit they close.
      </p>
    </section>
    <section>
      <h2 id="marketPrice">Market Price:</h2>
      <p>
        The current price in <strong>USD</strong> for a given asset, as provided by the
        <a href="oracles#oracle">oracles</a>
        subsystem.
      </p>
    </section>
    <section>
      <h2 id="withdrawal">Withdrawals:</h2>
      <p>
        Users that have non-negative health factor are able to withdraw their liquidity at any time.
        This action performs a transaction that redeems available
        <a href="#ctokens">cTokens</a> for an the equivalent amount of underlying asset according to
        the current <strong>Exchange Rate</strong>.
      </p>
    </section>
    <section>
      <h2 id="repay">Repay:</h2>
      <p>
        Users that have <strong>Borrow Balance</strong> are able to <strong>Repay</strong> their
        debt in order to partially reduce it or cancel it.
      </p>
    </section>
    <section>
      <h2 id="liquidity">Liquidity:</h2>
      <p>
        <a href="#account">Account</a> Liquidity
        <strong>represents the USD value borrowable</strong> by a user, before it reaches
        liquidation. Users with a shortfall (<em>negative liquidity</em>) are subject to liquidation
        and can’t withdraw or borrow assets until their Account Liquidity is positive again.
      </p>
      <p>
        For each market the user has entered into, their supplied balance is multiplied by the
        market’s <strong>collateral factor</strong>, and summed; borrow balances are then
        subtracted, to equal Account Liquidity. In other words:
        <em>Borrowing an asset reduces Account Liquidity for each USD borrowed</em>. At the same
        time, withdrawing an asset reduces Account Liquidity by the asset’s
        <strong>collateral factor</strong> times each USD withdrawn.
      </p>
    </section>
    <section>
      <h2 id="collateralFactor">Collateral Factor:</h2>
      <p>
        The percentage of supplied assets that is required to be collateralized when a user enters a
        market for borrowing purposes.
      </p>
      <p></p>
    </section>
    <section>
      <h2 id="healthFactor">Health Factor:</h2>
      <p>
        <strong>Health Factor</strong> is the result of a formula that calculates how close an
        account is to being liquidated. If an <a href="#account">account</a> becomes
        under-collateralized (<em>negative Health Factor</em>) it runs the risk of having it&#39;s
        shortfall <a href="#liquidation">liquidated</a>. This would be bad.
      </p>
    </section>
    <section>
      <h2 id="governance">Governance and Administrators:</h2>
      <p>
        The <strong>MIDefi protocol</strong> does not support specific tokens by default; instead,
        markets must be whitelisted. This is accomplished with an admin function,
        supportMarket(address market, address interest rate model) that allows users to begin
        interacting with the asset. In order to <a href="#borrowingAssets">borrow</a> an asset,
        there must be a valid price from the <a href="oracles#oracle">price oracle</a>. In order to
        use an asset as collateral, there must be a valid price and a collateralFactor. Each
        function call is validated through a policy layer, referred to as <em>the Comptroller</em>.
        This contract validates collateral and liquidity, before allowing a user action to proceed.
      </p>
      <p>
        <strong>MIDefi</strong> started with partially decentralized control of the protocol (such
        as choosing the <a href="/docs/keyConcepts#interestModel">interest rate</a> model per
        asset). The protocol is protected by a multi-signature smart contract, requiring the
        agreement of several <a href="#account">accounts</a> in order to perform changes to the
        protocol.
      </p>
      <p>The following rights in the protocol are controlled by the Multi-sig:</p>
      <ul>
        <li class="mb-4">
          The ability to list a new <a href="#ctokens">cToken</a> <a href="#markets">market</a>
        </li>
        <li class="mb-4">The ability to update the interest rate model per market</li>
        <li class="mb-4">
          The ability to update the <a href="oracles#oracle">oracle</a> or any adapter address
        </li>
        <li class="mb-4">The ability to withdraw the reserve of a <a href="#ctokens">cToken</a></li>
        <li class="mb-4">The ability to update the Comptroller contract</li>
        <li class="mb-4">The ability to choose a new admin</li>
      </ul>
    </section>

        <div class="pan-container">
          <a href="/docs/introduction">&laquo; Introduction</a>
          <a href="#">Back to top</a>
          <a href="/docs/howTo">How To &raquo;</a>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DocSideMenu from './DocSideMenu'

export default {
  name: 'KeyConcepts',
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
