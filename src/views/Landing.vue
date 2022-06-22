<template>
  <div class="landing">
    <v-row class="d-flex align-center justify-center landing-hero">
      <div class="landing-hero-title">
        <h1>Find the right place to invest your crypto</h1>
        <br />
        MIDEFI is an algorithmic distributed protocol which allows users to borrow and lend crypto
        currencies
        <br />
        <button class="landing-hero-button">Invest Today</button>
      </div>
    </v-row>
    <div class="row d-flex align-center justify-center landing-step">
      <v-row class="ma-0 text-center landing-step-title">
        <v-col>
          <v-row class="d-flex justify-center">
            <h2>As easy as 1, 2, 3</h2>
          </v-row>
          <v-row class="my-6 simple-text-2 d-flex justify-center">
            Connect your wallet and start earning money in a few steps
          </v-row>
        </v-col>
      </v-row>
      <v-row class="my-6 text-center pl-10 pr-10 landing-step-content">
        <v-col>
          <v-row class="d-flex justify-center mx-6">
            <img src="../assets/landing/landing-step-connect.png" class="landing-step-img" />
          </v-row>
          <v-row class="d-flex justify-center mx-6"> Connect Wallet </v-row>
        </v-col>
        <v-col>
          <v-row class="d-flex justify-center m-6">
            <img src="../assets/landing/landing-step-supply.png" class="landing-step-img" />
          </v-row>
          <v-row class="d-flex justify-center mx-6">
            Use our simple interface to supply or borrow from markets in a few clicks
          </v-row>
        </v-col>
        <v-col>
          <v-row class="d-flex justify-center mx-6">
            <img src="../assets/landing/landing-step-earn.png" class="landing-step-img" />
          </v-row>
          <v-row class="d-flex justify-center mx-6">
            Supply tokens to earn interest with no risk, you can withdraw them whenever you want
          </v-row>
        </v-col>
      </v-row>
    </div>
    <div class="row d-flex align-center justify-center">
      <v-row class="my-6 text-center pl-10 pr-10">
        <v-col class="landing-description-title">
          <v-row class="text-left">
            <h2>Join the DeFi revolution on the MIDeFi Network</h2>
          </v-row>
          <v-row class="my-6 simple-text-2">
            Enjoy the possibilities that Open Finance offers in a safe, clear and understandable way
          </v-row>
        </v-col>
        <v-col class="landing-description-img">
          <img class="landing-description-image" src="../assets/landing/landing-join.png" alt="" />
        </v-col>
      </v-row>
    </div>
    <div class="row d-flex align-center justify-center">
      <v-row class="my-6 text-center pl-10 pr-10">
        <v-col class="landing-description-img">
          <img class="landing-description-image" src="../assets/landing/landing-graph.png" alt="" />
        </v-col>
        <v-col class="landing-description-title">
          <v-row class="text-right">
            <h2>Experience the basics of lending and borrowing assets</h2>
          </v-row>
          <v-row class="my-6 text-right simple-text-2">
            Explore what you can do with your crypto assets and be part of the change to a more
            financially inclusive world
          </v-row>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Landing',
  methods: {
    toMyActivity() {
      this.$router.push({ name: 'MyActivity' })
    },
    toGithub() {
      window.location.href = 'https://github.com/riflending/'
      this.$router.push('https://github.com/riflending/')
    },
    scrollToTop() {
      window.scrollTo(0, 0)
      const button = document.getElementById('connectButton')
      if (button.click) {
        button.click()
      }
    },
  },
}
</script>
