<template>
  <v-container>
    <v-row>
      <v-col cols="3" class="hidden-sm-and-down">
        <DocSideMenu />
      </v-col>
      <v-col :class="colSize">
        <section>
          <h2 id="marketDynamics">Market Dynamics:</h2>
          <p>
            <strong>MIDefi</strong> markets are defined by an
            <a href="/docs/keyConcepts#interestModel">interest rate equation</a>, applied to all
            borrowers uniformly, which adjust over time as the relationship between supply and
            demand evolves.
          </p>
          <p>
            The history of each interest rate, for each individual market, is captured by the
            Interest Rate Index, which is calculated every time an interest rate changes resulting
            from a user minting (supplying), redeeming (withdrawing), borrowing, repaying or
            liquidating an asset.
          </p>
          <p>
            Each time a transaction occurs, the Interest Rate Index for the asset is updated and
            accrued, effectively generating the compounded interest since the prior index. At the
            same time, a portion of the accrued interest is retained (set aside) as reserves,
            determined by the market&#39;s Reserve Factor.
          </p>
        </section>
        <section>
          <h2 id="borrowerDynamics">Borrower Dynamics</h2>
          <p>
            A borrower&#39;s balance, including accrued interest, is simply the ratio of the current
            index divided by the index when the user&#39;s balance was last accrued.
          </p>
          <p>
            The balance for each borrower address is stored in the cToken as an account checkpoint.
            A checkpoint is an internal structure that describes the balance at the time the
            interest was last accrued.
          </p>
        </section>
        <section>
          <h2 id="exchangeRates">Exchange Rates:</h2>
          <p>
            Each cToken is convertible into an ever increasing quantity of the underlying asset, as
            interest accrues in the market. The exchange rate between a cToken and the underlying
            asset is equal to:
          </p>
          <p>exchangeRate = (marketLiquidity + totalBorrows - totalReserves) / totalSupply</p>
          <p>Where:</p>
          <ul>
            <li class="mb-4">
              <strong>marketLiquidity</strong> is the amount of underlying balance owned by this
              cToken contract.
            </li>
            <li class="mb-4">
              <strong>totalBorrows</strong> is the amount of underlying currently loaned out by the
              market, and the amount upon which interest is accumulated to suppliers of the market.
            </li>
            <li class="mb-4">
              <strong>totalReserves</strong> in each cToken represent a portion of interests set
              aside as liquidity which can be withdrawn or transferred. Reserves are a small portion
              of borrower interest accrues into the protocol, determined by the reserve factor.
            </li>
          </ul>
        </section>
        <section>
          <h2 id="reserveFactor">Reserve Factor:</h2>
          <p>
            The reserve factor defines the portion of borrower interest that is converted into
            reserves. It is a value between 0 and 1, representing a percentage of borrower interest
            that is to be reserved as liquidity. This value was set for each market at deploy and is
            subject to change through the Multi-Signature system.
          </p>
        </section>
        <section>
          <h2 id="apy">APY / APR:</h2>
          <p>
            The <em>annual percentage yield</em> (<strong>APY</strong>) or
            <em>annual percentage rate</em> (<strong>APR</strong>) is the real rate of return earned
            on a savings deposit or investment taking into account the effect of compounding
            interest.
          </p>
          <p>
            Unlike simple interest, compounding interest is calculated periodically and the amount
            is immediately added to the balance. With each period going forward, the account balance
            gets a little bigger, so the interest paid on the balance gets bigger as well. This
            makes the
            <strong>MIDefi Protocol</strong> a better alternative than other platforms that rely
            on simple interest rates.
          </p>
        </section>
        <section>
          <h2 id="riskManagement">Risk management and Liquidations:</h2>
          <p>
            If the value of an account’s borrowing balance exceeds their borrowing capacity, a
            portion of the outstanding borrowing may be repaid in exchange for the user’s cToken
            collateral, at the current market price minus a liquidation discount ; this incentivises
            users to quickly step in to reduce the borrower’s exposure, effectively reducing the
            protocol’s risk.
          </p>
          <p>
            The proportion eligible to be closed, a close factor , is the portion of the borrowed
            asset that can be repaid, and ranges from 0 to 1, and it represents a percentage, such
            as 25%
          </p>
          <p>
            Any rBTC address that possesses the borrowed asset may invoke the liquidation function,
            exchanging their asset for the borrower’s cToken collateral. As both users, both assets,
            and prices are all contained within the <strong>MIDefi protocol</strong>, liquidation
            is frictionless and does not rely on any outside systems or order-books. We encourage
            tech-savvy users to develop bots that perform this task.
          </p>
        </section>
        <section>
          <h2 id="collateral">Collateral and Collateral Factor:</h2>
          <p>
            Collateral — In order to borrow assets from the
            <strong>MIDefi</strong> protocol, users need to first supply them as collateral. This
            is provided using the same mint function used for supplying assets. Supplied collateral
            assets earn interest while in the protocol, but users cannot redeem or transfer assets
            while they are being used as collateral.
          </p>
          <p>
            <strong>Collateral Factor</strong> — The maximum amount users can borrow is limited by
            the <em>collateral factor</em> of the assets they have supplied. For example, if a user
            supplies 100 USDT as collateral and the posted <em>collateral factor</em> for USDT is
            75%, then the user can borrow at most 75 USDT worth of other assets at any given time.
            Each asset on <strong>MIDefi</strong> has a different <em>collateral factor</em>. They
            can be fetched using the Comptroller contract.
          </p>
          <p>
            A cToken&#39;s collateral factor can range from 0-90% and represents the proportionate
            increase in liquidity (borrow limit) that an account receives by minting the cToken.
          </p>
          <p>
            Generally, large or liquid assets have high collateral factors, while small or illiquid
            assets have low collateral factors. If theoretical asset would have a 0% collateral
            factor then it can&#39;t be used as collateral (or seized in liquidation), though it can
            still be borrowed.
          </p>
          <p>
            <em>Collateral Factor</em> is often called the
            <strong>LTV</strong> (<em>Loan-To-Value</em>) ratio.
          </p>
        </section>
        <section>
          <h2 id="accruingInterests">Accruing Interests:</h2>
          <p>
            <a href="/docs/keyConcepts#interestModel">Interest rates</a> for each market update on
            any block in which the ratio of borrowed assets to supplied assets in the market has
            changed. The amount interest rates are changed depends on the specific interest rate
            model smart contract implemented for the market, and the amount of change in the ratio
            of borrowed assets to supplied assets in the market.
          </p>
          <p>
            Interest accrues to all suppliers and borrowers in a market when any rBTC address
            interacts with the market’s cToken contract, calling one of these functions:
          </p>
          <ul>
            <li class="mb-4">mint (supply)</li>
            <li class="mb-4">redeem (withdraw)</li>
            <li class="mb-4">borrow</li>
            <li class="mb-4">repay</li>
            <li class="mb-4">liquidate</li>
          </ul>
          <p>
            Successful execution of one of these functions triggers the contract&#39;s method that
            accrues interests, which causes interest to be added to the underlying balance of every
            supplier and borrower in the market. Interest accrues for the current block, as well as
            each prior block in which the accrueInterest method was not triggered (no user
            interacted with the cToken contract). This only happens during blocks in which the
            cToken contract has one of the aforementioned methods invoked.
          </p>
          <p>Here is an example of supply interest accrual:</p>
          <p>
            Alice supplies 1 rBTC to the <strong>MIDefi Protocol</strong>. At the time of supply,
            the supplyRatePerBlock is <strong>37893605 Wei</strong>, or
            <strong>0.000000000037893605 rBTC</strong> per block. No one interacts with the cRBTC
            contract for 3 rBTC blocks. On the subsequent 4th block, Bob borrows some rBTC. Alice’s
            underlying balance is now <strong>1.000000000151574420 RBTC</strong> (which is 37893605
            Wei times 4 blocks, plus the original 1 rBTC).
          </p>
          <p align="center">
            <v-img
              contain
              max-height="650"
              max-width="850"
              src="@/assets/docs/accrue.png"
              alt="Market Data"
            />
          </p>
          <p>
            Alice’s underlying rBTC balance in subsequent blocks - as long as the contract isn't
            called - will have interest accrued based on the new value
            <strong>1.000000000151574420 rBTC</strong> instead of the initial
            <strong>1 rBTC</strong>.
          </p>
          <p>
            <strong>
              Keep in mind that this is a simplified example and in reality the supplyRatePerBlock
              may change at any time.
            </strong>
          </p>
        </section>
        <div class="pan-container">
          <a href="/docs/howTo">&laquo; How To</a>
          <a href="#">Back to top</a>
          <a href="/docs/contracts">Contracts &raquo;</a>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DocSideMenu from './DocSideMenu'

export default {
  name: 'Financial',
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
