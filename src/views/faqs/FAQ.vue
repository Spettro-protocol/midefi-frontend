<template>
  <v-container id="top">
    <v-row>
      <v-col cols="3" class="hidden-sm-and-down">
        <FaqSideMenu />
      </v-col>
      <v-col :class="colSize">
        <section>
          <h1 id="faq" align="center">FAQs</h1>
          <section>
            <h2 id="whatIs">What exactly is MIDefi?</h2>
            <p>
              <strong>MIDefi</strong> is a decentralized investment and finance (better known as
              <em>DEFI</em>) platform. MIDefi is predicated on the tenants of non-custodial,
              trustless and secure systems with 100% uptime.
            </p>
            <p>This means:</p>
            <ul>
              <li class="mb-4">No single entity stores funds on behalf of the users.</li>
              <li class="mb-4">
                Users are not required to wait long times for someone to process their transactions.
              </li>
              <li class="mb-4">
                Transactions are highly secure (thanks to
                <a href="https://github.com/riflending/rlending-protocol" target="_blank"
                  >open protocols</a
                >
                and <a href="docs/securityAudits" target="_blank">independent auditors</a>).
              </li>
              <li class="mb-4">24/7 accessibility from anywhere in the world.</li>
            </ul>
            <p>
              In other words, there is no central bank or government authority imposing rules on how
              to operate. Instead, the platform was designed to be completely self-regulating. This
              was achieved by programming
              <a href="https://github.com/riflending/rlending-protocol" target="_blank"
                >the protocol</a
              >
              using distributed
              <a href="https://en.wikipedia.org/wiki/Smart_contract" target="_blank"
                >Smart Contracts</a
              >
              deployed on the <a href="https://www.rsk.co" target="_blank">RSK Network</a>. Smart
              contracts handle the majority of the logic that has historically been handled by human
              inputs, vastly optimizing transaction time and cost.
            </p>
            <p>
              <strong
                >With all this in mind, our main motivation is to allow users to lend crypto assets
                as collateral, and to borrow them based on interest rates set by real-time supply
                and demand.</strong
              >
            </p>
          </section>
          <section>
            <h2 id="canTrade">Is MIDefi a Distributed Exchange (DEX)?</h2>
            <p>
              <strong>No.</strong> <em>Distributed Exchanges</em> allow users to exchange one
              cryptocurrency for another. Instead, at a high level, <strong>MIDefi</strong> is a
              financial permissionless lending system built on the
              <a href="https://www.rsk.co" target="_blank">RSK Network</a>.
              <strong>MIDefi</strong> enables users to lend and borrow popular cryptocurrencies
              like <strong>RSK Smart Bitcoin</strong> and
              <a href="https://coinmarketcap.com/currencies/tether/" target="_blank">USDT</a> in
              exchange for interest or debt.
            </p>
          </section>
          <section>
            <h2 id="howWorks">How does it work?</h2>
            <p>
              <strong>MIDefi</strong> leverages
              <a
                href="https://github.com/riflending/rlending-protocol/blob/master/audit/rLending_Security_Audit_Final_Report_v210303.pdf"
                target="_blank"
              >
                audited</a
              >
              <a href="https://en.wikipedia.org/wiki/Smart_contract" target="_blank">
                Smart Contracts</a
              >
              which are responsible for the storage, management, and facilitation of all funds. This
              means that users do not have a MIDefi login, but rather connect to the
              <a href="https://www.rsk.co" target="_blank">RSK Network</a>, and its benefits through
              web3 wallets. <strong>MIDefi</strong>
              <a href="docs/keyConcepts#markets" target="_blank"> Markets</a> are always on, meaning
              that anyone can lend or borrow their assets in minutes, and without any intervention
              or permission request since the
              <a href="https://en.wikipedia.org/wiki/Smart_contract" target="_blank">
                Smart Contracts</a
              >
              are self-regulating.
            </p>
            <p>
              <strong
                >Users supply their crypto assets, which can either earn interest or act as
                collateral for loans. This creates a shared pool of liquidity. Traders can take
                short positions in tokens (<a href="docs/keyConcepts#markets" target="_blank"
                  >Markets</a
                >) supported by MIDefi.
              </strong>
            </p>
            <p>
              If you wish to know more about how the
              <a href="https://www.rsk.co" target="_blank">RSK Network</a> works, we recommend you
              take a closer look at
              <a
                href="https://blog.rsk.co/noticia/the-cutting-edge-of-sidechains-liquid-and-rsk/"
                target="_blank"
                >this article</a
              >.
            </p>
          </section>
          <section>
            <h2 id="howCost">How much does it cost? Can I try it for free?</h2>
            <p>
              All of the
              <a href="https://github.com/riflending/" target="_blank">MIDefi platform</a> is open
              sourced. The only costs involved in using it are related to the <em> GAS price</em>,
              and they vary for each transaction. You can check the historical GAS values using
              <a href="https://rskgasstation.info/" target="_blank"> RSK Gas Station. </a>
            </p>
            <p>
              You can always try <strong>MIDefi</strong> for free, since there is a
              <a href="http://test.rlending.app" target="_blank"> test-net deploy </a> of
              <a href="https://github.com/riflending/rlending-protocol" target="_blank"
                >the protocol</a
              >. To access it, follow the steps in the <a href="#testnet">section below</a>
            </p>
            <p>
              If you wish to know more about what a Test Network is, and how it works, you might
              find
              <a href="https://cryptodefinitions.com/dictionary/testnet/" target="_blank">
                this article</a
              >
              helpful.
            </p>
          </section>
          <section>
            <h2 id="howProfit">How much does using MIDefi cost?</h2>
            <p>
              <strong>MIDefi doesn't charge users.</strong> The project was built on the basis for
              a more inclusive, stronger, smarter, non-custodial, and trustless distributed
              ecosystem in the <a href="https://www.rsk.co" target="_blank">RSK Network</a>.
            </p>
            <p>
              As more projects like <strong>MIDefi</strong> emerge, it becomes easier and more
              secure to transition from a classic Centralized Financial System (<em>CEFI</em>) to a
              decentralized one (<em>DEFI</em>). See the
              <a href="docs/howTo#integration" target="_blank">Integration Section</a> in the
              <a href="docs" target="_blank">Documentation</a> to learn more about this.
            </p>
          </section>
          <section>
            <h2 id="getWallet">How do I get a wallet?</h2>
            <p>
              <strong>MIDefi</strong> supports both
              <a href="https://www.poa.network/for-users/nifty-wallet" target="_blank">Nifty</a> and
              <a href="https://metamask.io/" target="_blank">Metamask</a> wallets.
              <a href="https://www.rsk.co" target="_blank">RSK</a> has created a nice tutorial on
              how to configure both of them!
            </p>
            <p>
              For Nifty, click
              <a href="https://developers.rsk.co/wallet/use/nifty/" target="_blank">here</a>. For
              Metamask, click
              <a href="https://developers.rsk.co/wallet/use/metamask/" target="_blank">here</a>
            </p>
            <p>
              Remember: wallets are just a tool that allows the user to interact with the network.
              To read more about wallets and how they work, visit
              <a href="https://developers.rsk.co/wallet/" target="_blank">this article</a>
            </p>
          </section>
          <section>
            <h2 id="testnet">How do I connect to MIDefi in Test Network?</h2>
            <p>
              If you wish to try the platform, and get comfortable with the features it provides,
              but at the same time you are hesitant about moving valued cryptocurrencies, you can
              always connect through <a href="http://test.rlending.app" target="_blank">Testnet</a>.
              Assuming you have your wallet extension installed, you will have to make certain you
              have it switched to <strong>RSK Testnet</strong>
            </p>
            <p align="center">
              <v-img
                contain
                max-height="550"
                max-width="450"
                src="@/assets/faq/niftyrsk.png"
                alt="nifty wallet connect"
              />
            </p>
            <p>
              Users of the RSK Network are able to request Testnet funds through the
              <a href="https://faucet.rsk.co/" target="_blank">RSK Testnet Faucet</a>. This faucet
              will provide your <a href="docs/keyConcepts#account" target="_blank">account</a> with
              <strong>0.05 T-rBTC</strong> to get you started on testing applications. There is also
              a <a href="https://faucet.rifos.org/" target="_blank"> Testnet tRIF faucet</a> if you
              wish to try it as well.
            </p>
            <p>
              Once you have your testnet funds (T-rBTC or t-RIF), head over to
              <a href="https://test.rlending.app" target="_blank">https://test.MIDefi.app</a>.
              Click on the blue boton at the top right corner. From there, users are prompted to
              connect their <a href="#getWallet">web3 wallet</a> (in this example we are using Nifty
              but Metamask is also supported)
            </p>
            <p>
              Once connected, you will see the
              <a href="http://test.rlending.app/myActivity" target="_blank">Main Screen</a> showing
              <a href="docs/keyConcepts#account" target="_blank">your account</a>'s
              <strong>Investment Dashboard</strong>. You are now connected to MIDefi in Testnet.
            </p>
            <p align="center">
              <v-img
                contain
                max-height="550"
                max-width="450"
                src="@/assets/faq/dashboard1.png"
                alt="new account dashboard"
              />
            </p>
            <p>
              <em>
                In case you need help configuring your wallet. For Nifty, click
                <a href="https://developers.rsk.co/wallet/use/nifty/" target="_blank">here</a>. For
                Metamask, click
                <a href="https://developers.rsk.co/wallet/use/metamask/" target="_blank">here</a>
              </em>
            </p>
          </section>
          <section>
            <h2 id="mainnet">How do I connect to MIDefi in main net?</h2>
            <p>
              Assuming you have your wallet extension installed (in this example we are using
              <em>Metamask</em>, but Nifty is also supported), you will have to make certain you
              have it switched to <strong>RSK Network</strong>
            </p>
            <p align="center">
              <v-img
                contain
                max-height="550"
                max-width="450"
                src="@/assets/faq/metamaskrsk.png"
                alt="metamask wallet connect"
              />
            </p>
            <p>
              Head over to
              <a href="https://rlending.app" target="_blank">https://rlending.app</a>. Click on the
              blue boton at the top right corner. From here, users are prompted to connect with
              their
              <a href="#getWallet">web3 wallet.</a>
            </p>
            <p>
              Once connected, you will see the
              <a href="http://rlending.app/myActivity" target="_blank">Main Screen</a> showing
              <a href="docs/keyConcepts#account" target="_blank">your account</a>'s
              <strong>Investment Dashboard</strong>. You are now connected to MIDefi in Mainnet.
            </p>
            <p align="center">
              <v-img
                contain
                max-height="550"
                max-width="450"
                src="@/assets/faq/dashboard1.png"
                alt="new account dashboard"
              />
            </p>
            <p>
              <em>
                In case you need help configuring your wallet. For Nifty, click
                <a href="https://developers.rsk.co/wallet/use/nifty/" target="_blank">here</a>. For
                Metamask, click
                <a href="https://developers.rsk.co/wallet/use/metamask/" target="_blank">here</a>
              </em>
            </p>
          </section>
          <section>
            <h2 id="gasPrice">Why is gas price so high?</h2>
            <p>
              The gas usage of
              <a href="https://github.com/riflending/rlending-protocol" target="_blank"
                >the protocol</a
              >
              functions may fluctuate by
              <a href="docs/keyConcepts#markets" target="_blank">market</a> and
              <a href="docs/keyConcepts#account" target="_blank">user</a>. External calls, such as
              the ones made to underlying ERC-20 tokens, may use an arbitrary amount of gas. Any
              calculations that involve checking
              <a href="docs/keyConcepts#account" target="_blank">account</a>
              <a href="docs/keyConcepts#liquidity" target="_blank"> liquidity</a>, incur in gas
              costs that increase with the number of entered markets. While it can be difficult to
              provide any guarantees about costs, we provide the table below for guidance:
            </p>

            <ul>
              <li class="mb-4">Function Typical Gas Cost Mint &lt; 150K</li>
              <li class="mb-4">cUSDT &lt; 300k</li>
              <li class="mb-4">Redeem, Transfer &lt; 250K if borrowing, otherwise &lt; 90K</li>
              <li class="mb-4">Borrow &lt; 300K</li>
              <li class="mb-4">Repay Borrow &lt; 90K</li>
              <li class="mb-4">Liquidate Borrow &lt; 400K</li>
            </ul>
            <p>
              <em
                >If you wish to know more about what GAS is and how it works, you might find
                <a href="https://www.investopedia.com/terms/g/gas-ethereum.asp" target="_blank">
                  this link educational</a
                >
              </em>
            </p>
          </section>
          <section>
            <h2 id="earnings">How do users earn money with MIDefi?</h2>
            <p>
              Each <a href="docs/keyConcepts#markets" target="_blank">market</a> has its own Supply
              interest rate (APR). Interest isn&#39;t distributed by a centralized authority;
              instead,
              <strong
                >simply by holding <a href="docs/keyConcepts#ctokens" target="_blank">cTokens</a>,
                you&#39;ll earn interest!</strong
              >
            </p>
            <p>
              <a href="docs/keyConcepts#ctokens" target="_blank">cTokens</a> accumulate interest
              through their exchange rate — over time, each cToken
              <strong
                >becomes convertible into an increasing amount of it&#39;s underlying asset</strong
              >, even while the number of cTokens in your wallet stays the same.
            </p>
            <p>
              We encourage you to read through
              <a href="docs/keyConcepts" target="_blank">the documentation</a> where you will find
              <a href="docs/keyConcepts#howInterests" target="_blank">a good example</a> on how this
              works.
            </p>
          </section>
          <section>
            <h2 id="howMuchEarnings">How much earnings can I expect?</h2>
            <p>
              Earnings depend upon many factors, and it is always impossible to predict the future.
              A good starting point is to run your own predictions based upon the
              <a href="docs/keyConcepts#howInterest" target="_blank">APR</a> and
              <a href="docs/keyConcepts" target="_blank">Market Data</a>, before performing any
              transaction.
            </p>
          </section>
          <section>
            <h2 id="canBorrow">Can I borrow without a deposit?</h2>
            <p>
              <strong> No.</strong> In order to manage the risk factor, the platform does not allow
              for users to borrow funds without providing collateral first. This is a common
              practice among <em>DEFI</em> implementations. We encourage you to read more about this
              topic in <a href="docs" target="_blank">the documentation</a>.
            </p>
          </section>
          <section>
            <h2 id="howBorrow">How does borrowing work?</h2>
            <p>
              In order to borrow you will be required to
              <a href="#whyDeposit">provide liquidity</a>. The percentage of
              <a href="docs/keyConcepts#liquidity" target="_blank">liquidity</a> of an asset
              required to borrow another is given by the
              <a href="docs/keyConcepts#markets" target="_blank">market</a>’s<a
                href="docs/keyConcepts#collateralFactor"
              >
                Collateral Factor</a
              >. If you borrow, your
              <a href="docs/keyConcepts#ctokens" target="_blank">CTokens</a> will act as collateral
              for <a href="docs/keyConcepts#account" target="_blank">your account</a>, and your
              wallet will receive the
              <a href="docs/keyConcepts#underlying" target="_blank"> underlying asset</a>.
            </p>
          </section>
          <section>
            <h2 id="borrowFee">What are the fees for borrowing?</h2>
            <p>
              You can check the current borrowing fees in the
              <a href="https://rlending.app/status" target="_blank">Market Data</a>. If you wish to
              know more about these values, we encourage you to check
              <a href="docs/keyConcepts" target="_blank">the documentation</a>.
            </p>
          </section>
          <section>
            <h2 id="howColFact">How does Collateral Factor work?</h2>
            <p>
              <strong>Collateral Factor</strong> is the percentage of supplied assets in a
              <a href="docs/keyConcepts#markets" target="_blank">market,</a> that is locked as
              collateral for borrowing. If you wish to know more about these values, we encourage
              you to check <a href="docs/keyConcepts" target="_blank">the documentation</a>.
            </p>
          </section>
          <section>
            <h2 id="crossBorrow">Can I borrow from a market I have not supplied to?</h2>
            <p><strong>Yes!</strong> This is one of the most used transactions.</p>
          </section>
          <section>
            <h2 id="whatDebt">What happens if someone doesn't pay their debt?</h2>
            <p>
              Users incur in <a href="docs/keyConcepts#debt" target="_blank">debt</a> by borrowing
              assets. In order to borrow they have to
              <a href="#howBorrow">provide collateral</a> first. In the event that
              <a href="docs/keyConcepts#liquidity" target="_blank">user's liquidity</a> runs out,
              the <a href="docs/keyConcepts#account" target="_blank">account</a> incurs in
              shortfall, and becomes prone to
              <a href="docs/keyConcepts#liquidation" target="_blank">liquidation</a>.
            </p>
            <p>
              When an account is liquidated by another account, the liquidator buys a portion of the
              liquidated's underlying at a discount, given by the
              <a href="docs/keyConcepts#liquidation" target="_blank">Close Factor</a> (currently set
              to 8%).
            </p>
            <p>
              <strong>Getting liquidated is very bad</strong>How Can I Have More Debt T because the
              liquidated user looses a part of their underlying collateral provided.
            </p>
          </section>
          <section>
            <h2 id="reserves">
              What is preventing someone from withdrawing all of the balance in the contracts?
            </h2>
            <p>
              <strong>MIDefi</strong> is self-regulating and it has mechanisms in place to prevent
              abuses. <em>Self-regulating</em> means there is an automated balance that runs the
              interest ratios for each
              <a href="docs/keyConcepts#markets" target="_blank">market</a>. If there is too much
              supply, and not enough borrows to pay for them, the borrowing fees will automatically
              drop. This makes for a more attractive investment opportunity for borrowers. If on the
              other hand, demand is heavy on the borrows but supply is short, then the Supply Rate
              will rise to attract suppliers.
            </p>
            <p>
              In short: <em>supply and demand</em> automatically dictate the balance of each
              <a href="docs/keyConcepts#markets" target="_blank">market</a>.
            </p>
            <p>
              As for security measures, we encourage you to read up on them in
              <a href="docs/securityAudits" target="_blank">the documentation</a>, and the
              independent
              <a
                href="https://github.com/riflending/MIDefi-protocol/blob/master/audit/rLending_Security_Audit_Final_Report_v210303.pdf"
                target="_blank"
                >auditor's report</a
              >. For example: the
              <a href="docs/keyConcepts#reserveFactor" target="_blank">Reserve Factor</a> and the
              <a href="docs/securityAudits" target="_blank">Multi-Sig system</a>.
            </p>
          </section>
          <section>
            <h2 id="priceVariation">How can I have more debt than before?</h2>
            <p>
              <a href="docs/keyConcepts#debt" target="_blank">Debt</a> and
              <a href="docs/keyConcepts#liquidity" target="_blank">liquidity</a> are calculated in
              USD. This means that if a user supplies collateral on an asset with a volatile
              <a href="docs/keyConcepts#marketPrice" target="_blank">market price </a>, the user's
              collateral provided becomes volatile as well.
            </p>
            <p>
              To mitigate this,
              <a href="https://github.com/riflending/rlending-protocol" target="_blank"
                >the protocol</a
              >
              tends to have higher <a href="#howColFact">collateral factor</a> for
              <a href="docs/keyConcepts#markets" target="_blank">markets</a> that are more volatile,
              and lower for those with more stability.
            </p>
          </section>
          <section>
            <h2 id="healthFactor">What is a Health Factor?</h2>
            <p>
              <a href="docs/keyConcepts#healthFactor" target="_blank">Health Factor</a> is the
              result of a formula that is used to predict how close to
              <a href="docs/keyConcepts#liquidation" target="_blank">liquidation</a> an
              <a href="docs/keyConcepts#account" target="_blank">account</a> is.
            </p>
            <ul>
              Generally speaking:
              <li class="mb-4">HealthFactor &gt; 50% means your account is safe</li>
              <li class="mb-4">
                HealthFactor &gt; 15% and &lt; 50% means you should keep an eye on your collaterals
              </li>
              <li class="mb-4">
                HealthFactor &lt; 15% means you should probably provide more collateral
              </li>
              <li class="mb-4">
                HealthFactor &lt; 0% means you are prone to liquidation, because you have incured in
                more debt than collateral provided.
              </li>
            </ul>
          </section>
          <section>
            <h2 id="liquidation">What happens if my Health Factor becomes negative?</h2>
            <p>
              <strong
                >This is serious, but nothing happens immediately. You are still able to correct the
                situation.
              </strong>
              If this happens, your
              <a href="docs/keyConcepts#account" target="_blank">account</a> is prone to
              <a href="docs/keyConcepts#liquidation" target="_blank">liquidation</a>. You should
              deposit more collateral and repay your borrows before another account liquidates your
              underlying. See
              <a href="docs/keyConcepts#healthFactor" target="_blank"> Health Factor</a> for more
              information.
            </p>
          </section>
          <section>
            <h2 id="security">How secure is MIDefi?</h2>
            <p>
              <strong>The MIDefi Protocol is compliant with modern security practices. </strong>
              This means the <a href="docs/contracts" target="_blank">smart contracts</a> have been
              <a href="docs/securityAudits" target="_blank">audited</a> both by internal, and
              external third party professionals.
            </p>
            <p>
              <strong>
                The MIDefi app (<em> front end </em>) does not store any user information.</strong
              >
              It just provides the web services and functionalities to easily interact with the
              <a href="docs/contracts" target="_blank">smart contracts</a> running in the back-end.
            </p>
            <p>
              <strong>MIDefi</strong> also has a
              <a href="docs/securityAudits" target="_blank">Bug Bounty program</a> with several open
              challenges for ethical hackers who wish to audit the source-code, and find any
              vulnerability.
            </p>
          </section>
          <h1 id="dev" align="center">I am a developer</h1>
          <section>
            <h2 id="contracts">How do I interact with the smart contracts?</h2>
            <p>
              All of the smart contracts are listed and verified. You may find a list in
              <a href="docs/contracts" target="_blank">the documentation</a>, both for testnet and
              mainnet.
            </p>
          </section>
          <section>
            <h2 id="docs">Where can I find more info on...</h2>
            <p>
              We are currently working on building the social media communities, to create a hub
              connecting users. For now, you will find most technical information by reading
              <a href="docs">the documentation</a>.
            </p>
          </section>
          <section>
            <h2 id="howToDev">How can I contribute?</h2>
            <p>
              The
              <a href="https://github.com/riflending/rlending-protocol" target="_blank"
                >MIDefi Protocol</a
              >
              is open source and publicly available, hosted on GitHub. We encourage developers and
              independent auditors to contribute by cloning the repository and creating Pull
              Requests.
            </p>
            <p>
              MIDefi also has a
              <a href="docs/securityAudits" target="_blank">Bug Bounty program</a> with several open
              challenges to ethical hackers who wish to audit the source-code and find any
              vulnerability.
            </p>
          </section>
          <h1 id="help" align="center">Troubleshooting</h1>
          <section>
            <h2>The website looks weird on my mobile phone:</h2>
            <p>
              Yes, while in Beta, the MIDefi platform is not designed to be used on mobile phones
              or tablets. Using a PC with a web browser is recommended.
            </p>
          </section>
          <section>
            <h2>I can't connect:</h2>
            <p>
              This is most likely due to a missconfiguration of the web3 wallet. We recommend you
              follow <a href="#mainnet">these steps</a>. If you are still unable to connect, feel
              free to <a href="mailto:support@MIDefi.app" target="_blank">email us</a> or reach
              out to us over
              <a href="https://t.me/MIDefiCommunity" target="_blank"> Telegram.</a>
            </p>
          </section>
          <section>
            <h2>Transaction Reverted:</h2>
            <p>
              This means the blockchain has not been able to process your transaction. Whether you
              were trying to supply, withdraw, borrow or enter market, this is a common error that
              is most likely not going to repeat if you retry the action you were attempting to
              make. If the error persists, feel free to <a href="">contact us</a> or
              <a href="">join the Discord community</a>.
            </p>
          </section>
          <section>
            <h2>Why my health factor low?:</h2>
            <p>
              See <a href="docs/keyConcepts#healthFactor" target="_blank"> Health Factor</a> and
              <a href="#priceVariation"> How can I have more debt than before?</a>
            </p>
            <!-- <h1>Can't see accounts when trying to liquidate:</h1>
              <p>
                The liquidation tab is not yet optimized and it will take a couple of minutes to load
                the proper data. Keep in mind that we are still in Beta, and there is a chance no
                <a href="docs/keyConcepts#account" target="_blank">account</a> is prone to
                <a href="docs/keyConcepts#liquidation" target="_blank">liquidation</a>
                yet. Liquidations are very rare.
              </p>
              <hr /> -->
          </section>
          <section>
            <h2>How can I liquidate underwater accounts?</h2>
            <p>
              The liquidation tab is not yet implemented. Keep in mind that we are still in Beta,
              and there is a chance no
              <a href="docs/keyConcepts#account" target="_blank">account</a> is prone to
              <a href="docs/keyConcepts#liquidation" target="_blank">liquidation</a>
              yet. Liquidations are very rare! Liquidations are still possible by developing a bot
              that interacts directly with the
              <a href="https://github.com/riflending/rlending-protocol" target="_blank"
                >MIDefi Protocol</a
              >
            </p>
          </section>
          <section>
            <h2 id="support">How do I contact Support?</h2>
            <p>
              You can reach out to us on any of our social media. You can
              <a href="mailto:support@MIDefi.app" target="_blank">email us</a> or reach out to us
              on <a href="https://twitter.com/r_lending" target="_blank">Twitter</a>. You might also
              want to join us on
              <a href="https://t.me/rLendingCommunity" target="_blank"> Telegram.</a>
            </p>
          </section>
          <div class="pan-container" align="right">
            <a href="#">Back to top</a>
          </div>
        </section>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import FaqSideMenu from './FAQSideMenu'
import * as constants from '@/store/constants'
import { mapMutations } from 'vuex'

export default {
  name: 'FAQ',
  components: {
    FaqSideMenu,
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
      this.setDrawerProperty({ isDoc: false })
      this.setDrawerProperty({ isFaq: true })
    },
    ...mapMutations({
      setDrawerProperty: constants.DRAWER_SET_PROPERTY,
    }),
  },
}
</script>
