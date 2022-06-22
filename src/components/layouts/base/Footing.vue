<template>
  <div>
    <v-footer class="footer" color="lighten-1" padless>
      <v-container fluid>
        <v-row justify="center" class="black-footer">
          <v-col lg="3" sm="4" cols="12" class="pl-16">
            <h1>Company</h1>
            <a class="mt-3" href="docs/introduction"> About Us </a>
            <a href="privacy"> Privacy Policy </a>
            <a href="terms"> Terms &#38; Conditions </a>
          </v-col>
          <v-col lg="3" sm="4" cols="12" class="pl-16">
            <h1>Guides</h1>
            <a class="mt-3" href="doc"> Documentation </a>
            <a href="faq"> FAQs </a>
          </v-col>
          <v-col lg="3" sm="4" cols="12" class="pl-16">
            <h1>Contact Us</h1>
            <a href="mailto:contact@rlending.app"> Contact MIDeFi</a>
          </v-col>
        </v-row>

        <v-row class="social-footer">
          <v-col lg="5" sm="6" cols="12" offset-lg="1" align-self="center" class="text-left pl-16">
            <div class="copyright text-left">
              &#169; 2022 Market Indicator. All rights reserved.
            </div>
          </v-col>
          <v-col sm="6" cols="12" align-self="center" class="text-right pr-16">
            Follow us on social
            <a href="https://t.me/marketindicatorapp" target="_blank">
              <v-icon class="social-icon" large>mdi-telegram</v-icon>
            </a>
            <a href="https://twitter.com/marketindicato2" target="_blank">
              <v-icon class="social-icon" large>mdi-twitter</v-icon>
            </a>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </div>
</template>

<script>
import { COMMIT_HASH } from '@/config/constants'

export default {
  name: 'Footing',
  data() {
    return {
      commitHash: COMMIT_HASH,
    }
  },
}
</script>
