<template>
  <v-container>
    <v-row>
      <v-col cols="3" class="hidden-sm-and-down">
        <DocSideMenu />
      </v-col>
      <v-col :class="colSize">    
    <section>
      <h2 id="howPlatform-">How to connect to the platform:</h2>
      <p>
        In order to use <strong>MIDefi</strong> you will need your <em>Metamask</em> wallet
        connected to the <strong>RSK network</strong> Direct your browser towards the
        <a href="www.rlending.app"><strong>MIDefi</strong> website</a> and click
        <strong>Connect wallet</strong>. The screen will let you connect your
        <em>Metamask/Nifty</em> wallet.
      </p>
      <p align="center">
        <v-img
          contain
          max-height="450"
          max-width="450"
          src="@/assets/docs/connecting.jpg"
          alt="Connecting"
        />
      </p>
      <p>
        This will prompt you to choose your account within <em>Metamask/Nifty</em>. After you have
        accepted the connection, you will be redirected to the <em>Home Dashboard</em>.
      </p>
      <p align="center">
        <v-img
          contain
          max-height="450"
          max-width="450"
          src="@/assets/docs/dashboard.png"
          alt="Dashboard"
        />
      </p>
      <p>
        In this screen you will have an overview of the status of your account (Totals supplied,
        borrowed, available liquidity and health factor).
      </p>
    </section>
    <section>
      <h2 id="howDeposit">How to make a deposit:</h2>
      <p>
        <strong>MIDefi</strong> deposits are easy! After you have connected your Metamask or Nifty
        wallet you will be logged in and ready to supply funds.
      </p>
      <p>
        When you are ready to make a deposit, you will have to click on the
        <strong>Supply / Borrow</strong> tab, where you will be able to see the current status of
        your supplied assets.
      </p>
      <p align="center">
        <v-img
          contain
          max-height="550"
          max-width="550"
          src="@/assets/docs/supplyList.png"
          alt="Supply List"
        />
      </p>
      <p>
        If this is the first time supplying, you might see a notice that lets you know how the
        toggle button works. We will go over it on the next section, in order to
        <strong>Borrow assets</strong>.
      </p>
      <p>
        For now, click on the asset you wish to supply (in this example, we are supplying rBTC).
      </p>
      <p align="center">
        <v-img
          contain
          max-height="550"
          max-width="550"
          src="@/assets/docs/supplyInput-2.jpg"
          alt="Supply Input"
        />
      </p>
      <p>
        At the top of this screen you will find the asset&#39;s data, current price and the amount
        of this token you have supplied <strong>converted to USD</strong>.
      </p>
      <p>
        Select the amount you wish to provide, and then click on
        <strong>Supply Tokens</strong> This will promtp your <em>Metamask/Nifty</em> for validation
        on the transaction.
      </p>
      <p>
        After the transaction has been broadcasted you will receive confirmation and your funds will
        be credited to your account.
      </p>
      <p align="center">
        <v-img
          contain
          max-height="550"
          max-width="550"
          src="@/assets/docs/supplySuccess.jpg"
          alt="Supply Success"
        />
      </p>
      <p>
        In this last screen we double check the amount we have supplied in
        <strong>Supply Balance</strong>. We can also see the current liquidity the contract is
        holding in <strong>Supplied to contract</strong>. The <strong>Borrow Limit</strong> will not
        show unless the account has provided collateral. We will do this in the next section.
      </p>
      <p>
        When a user supplies balance they immediately start earning interests, so
        <strong>Congratulations! You are already earning interests!!</strong>
      </p>
    </section>
    <section>
      <h2 id="howBorrow">How to make a borrow:</h2>
      <p>
        All right, when a user supplies balance they immediately start earning interests... but
        where do those interests come from? Short answer: <em>Borrowers</em>! Those accounts that
        borrow crypto assets from the <strong>MIDefi</strong> protocol pay a varying
        <a href="/docs/keyConcepts#interestModel">interest rate</a>
        every rBTC block. The interest that borrowers pay produces the interest that suppliers earn.
      </p>
      <p>
        Before you can borrow you need to collateralize your account! An asset that is supplied to
        the protocol is not usable as collateral initially. In order to inform the protocol that you
        wish to use an asset as collateral, you must “enter the market” for that asset.
      </p>
      <p>
        <strong>Toggle the Collateral column to enter your supplied funds as collateral.</strong>
      </p>
      <p align="center">
        <v-img
          contain
          max-height="450"
          max-width="450"
          src="@/assets/docs/toggle.jpg"
          alt="Toggling Market"
        />
      </p>
      <p>
        This will promtp you for confirmation. If you confirm, this will then prompt your
        <em>Metamask/Nifty</em> for confirmation, since this is a transaction that requires GAS.
      </p>
      <p>
        If successful, you will receive confirmation and the borrowing warning will dissapear from
        the background.
      </p>
      <p align="center">
        <v-img
          contain
          max-height="350"
          max-width="350"
          src="@/assets/docs/enteredMarket.jpg"
          alt="Entered Market"
        />
      </p>
      <p>
        An account can enter multiple markets at one time. You can do this by toggling each one you
        would like to operate with.
        <strong
          >It is important to notice that in order to borrow from a market, you also need to enter
          that market, even if your account hasn&#39;t supplied balance to that market.</strong
        >
      </p>
      <p>In this example we will be borrowing <strong>RIF</strong></p>
      <p>
        Head over to the <strong>Borrow tab</strong>. Notice that the APR column has changed values.
        This is because you are now viewing the current borrow interest rates. Borrowing rates will
        always be higher than Supplying Interest Rates. See
        <a href="/docs/keyConcepts#interestModel">Utilization rate</a>.
      </p>
      <p align="center">
        <v-img
          contain
          max-height="450"
          max-width="450"
          src="@/assets/docs/borrowList.png"
          alt="Entered Market"
        />
      </p>
      <p>
        Select the market you wish to borrow from (in this example, <strong>RIF</strong>) by
        clicking on the right side arrow. This will pop-up the borrowing input window.
      </p>
      <p align="center">
        <v-img
          contain
          max-height="450"
          max-width="450"
          src="@/assets/docs/borrowInput.png"
          alt="Entered Market"
        />
      </p>
      <p>
        Input the amount you wish to borrow (in this example, 13.37 RIF). It is important to notice
        that
        <strong
          >you should never borrow close to your max borrow allowed, otherwise you run the risk of
          getting liquidated when the interests accrue and your account incurs in shortfall</strong
        >. After you have confirmed the transaction, the borrow list will show the updated values.
        Notice that your borrow starts increasing in interests as soon as the next block accrues
        them. We borrowed 13.37 RIF and a few blocks after, or debt is now 13.3701 RIF. Also, notice
        that your borrowed asset (in this example RIF) is now also marked as a collateralized
        market. Lastly, notice that your <strong>Health Factor</strong> has decreased.
      </p>
      <p align="center">
        <v-img
          contain
          max-height="450"
          max-width="450"
          src="@/assets/docs/borrowed.png"
          alt="Entered Market"
        />
      </p>
    </section>
    <section>
      <h2 id="howWithdraw">How to make a withdrawal:</h2>
      <p>
        If at some point you decide you want to withdraw your funds, you should know you will be
        reedming your cToken balance in exchange for their respective underlying assets. Withdrawals
        are accessed through the Supply menu, in the Supply/Borrow page.
      </p>
      <p>First, log in. Then go to the Supply/Borrow market list.</p>
      <p align="center">
        <v-img
          contain
          max-height="550"
          max-width="550"
          src="@/assets/docs/withdrawList.png"
          alt="Supply/Borrow list"
        />
      </p>
      <p>There you will need to select the market that you wish to withdraw from.</p>
      <p align="center">
        <v-img
          contain
          max-height="450"
          max-width="450"
          src="@/assets/docs/withdrawInput.png"
          alt="Withdraw Input"
        />
      </p>
      <p>
        When you&#39;ve chosen the amount you wish to withdraw, click
        <em>Withdraw my tokens</em> and <em>Metamask/Nifty</em> will prompt you with the
        transaction. After the withdrawal has been broadcasted you will receive confirmation and
        your funds will be credited to your account.
      </p>
      <p align="center">
        <v-img
          contain
          max-height="450"
          max-width="450"
          src="@/assets/docs/withdrawed.png"
          alt="Withdraw Input"
        />
      </p>
      <p>
        <strong
          >Note that your Health Factor has been updated as withdrawing balance reduces your
          collateral.</strong
        >
      </p>
      <p>Bigger withdrawals may considerably reduce your health factor!!</p>
    </section>
    <section>
      <h2 id="howRepay">How to repay debt:</h2>
      <p>
        Borrows can be repaid using a function on the respective cToken contract. Once a borrow has
        been repaid, the account’s collateral can be entirely redeemed or transferred. There are
        also functions in the cToken contracts to repay a borrow on behalf of another account.
      </p>
    </section>

        <!-- <h1 id="howLiquidate">How to liquidate underwater accounts:</h1>
          <p>
            In order to check the accounts that are prone to liquidation, go to the
            <a href="#howDeposit">Supply dialog</a> and then open up the Liquidation tab.
          </p>
          <p>
            <v-img
              contain
              max-height="450"
              max-width="450"
              src="@/assets/docs/liquidateInput.jpg"
              alt="Liquidation list"
            />
          </p>
          <p>
            It might take a while for the accounts to appear. When they do, you should be able to
            select one and select the asset in which you wish to cover the debt.
          </p>
          <p>
            <v-img
              contain
              max-height="450"
              max-width="450"
              src="@/assets/docs/liquidateInput2.jpg"
              alt="Liquidation list"
            />
          </p>
          <p>&nbsp;</p>
           -->
    <section>
      <h2 id="howData">How to view market data:</h2>
      <p>
        Like mentioned earlier, markets represent each asset listed in the
        <strong>MIDefi Protocol</strong>. Every market evolves as supply and demand for an asset
        changes. This impacts several aspects of the protocol (liquidity, price, indexes, etc). If
        you want to check the current status of a market, you should go to the
        <a href="www.rlending.app/status">Status tab</a>.
      </p>
      <p align="center">
        <v-img
          contain
          max-height="650"
          max-width="650"
          src="@/assets/docs/marketList.png"
          alt="Market List"
        />
      </p>
      <p>
        Here you will find the market list overview. More detailed information is found by clicking
        on the right arrow:
      </p>
      <p align="center">
        <v-img
          contain
          max-height="450"
          max-width="450"
          src="@/assets/docs/rbtcStatus.png"
          alt="Market Data"
        />
      </p>
    </section>
    <section>
      <h2 id="howInterest">How do tokens earn interests?:</h2>
      <p>
        Each market has its own
        <a href="/docs/keyConcepts#interestModel">Supply interest rate</a> (APR). Interest isn&#39;t
        distributed; instead,
        <strong>simply by holding cTokens, you&#39;ll earn interest!</strong>
        <strong>cTokens</strong> accumulates interest through their exchange rate — over time, each
        cToken
        <strong>becomes convertible into an increasing amount of it&#39;s underlying asset</strong>,
        even while the number of cTokens in your wallet stays the same.
      </p>
      <p>
        Let’s say you supply <strong>1,000 RIF</strong> to the <strong>MIDefi</strong> protocol,
        when the exchange rate is <strong>0.020070</strong>; you would receive
        <strong>49,825.61 cRIF</strong> (1,000/0.020070).
      </p>
      <p align="center">
        <v-img
          contain
          max-height="450"
          max-width="450"
          src="@/assets/docs/aliceSupply.png"
          alt="Supply"
        />
      </p>
      <p>
        A few months later, you decide it’s time to withdraw your RIF from the protocol; suppose the
        exchange rate is now <strong>0.021591</strong>: Your <strong>49,825.61 cRIF</strong> is now
        equal to <strong>1,075.78 RIF</strong> (49,825.610.021591) You could withdraw
        <strong>1,075.78 RIF</strong>, which would redeem all <strong>49,825.61 cRIF</strong>. You
        could also withdraw a portion, such as your original <strong>1,000 RIF</strong>, which would
        redeem <strong>46,315.59 cRIF</strong> (keeping *3,510.01 cRIF in your wallet) or you could
        transfer your cTokens, effectively transferring your balance of underlying asset.
      </p>
      <p align="center">
        <v-img
          contain
          max-height="450"
          max-width="450"
          src="@/assets/docs/aliceWithdraw.png"
          alt="Withdraw"
        />
      </p>
      <p>
        If you send your cTokens to a friend, your <strong>MIDefi</strong> balance will decline
        and your friend&#39;s will increase.
        <strong
          >A cToken transfer will fail if the account has entered that cToken market and the
          transfer would have put the account into a state of negative liquidity.</strong
        >
      </p>
      <p>
        Meaning, the protocol will not let you perform a transfer of cTokens if your account has has
        entered a market and the resulting transaction would drive the account into shortfall.
      </p>
    </section>
    <section>
      <h2 id="integration">MIDefi and the RSK ecosystem:</h2>
      <p>
        <strong>MIDefi</strong> runs on the <a href="https://www.rsk.co/">RSK Network</a> but it
        is not an isolated application. The network has a
        <a href="https://tokenbridge.rsk.co/">Token Bridge</a> that allows bidirectional transfers
        betweenth RSK and the Ethereum Network. With this resource, users of the
        <strong>MIDefi Protocol</strong> are able to interact with assets from the Ethereum
        network.
      </p>
      <p align="center">
        <v-img
          contain
          max-height="650"
          max-width="850"
          src="@/assets/docs/integration.png"
          alt="Market
          Data"
            />
          </p>
          <p>
            For example, let's say a user holding rBTC wants to buy USDT. This is possible, by
            supplying rBTC as collateral and borrowing rKovUSDT(the pegged token in the RSK network)
            from the
            <strong>MIDefi Protocol</strong> Then it would be possible to use the
            <a href="https://tokenbridge.rsk.co/">Token Bridge</a>
            to exchange rKovUSDT for USDT.
          </p>
          <p>
            It would also be possible to interact with tokens though the
            <a href="https://rskswap.com/">RSK Swap</a> Dapp which allows for instant exchange
            between assets in the network.
          </p>
        </section>
        <div class="pan-container">
          <a href="/docs/keyConcepts">&laquo; Key concepts</a>
          <a href="#">Back to top</a>
          <a href="/docs/financialMath">Financial Math &raquo;</a>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DocSideMenu from './DocSideMenu'

export default {
  name: 'HowTo',
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
