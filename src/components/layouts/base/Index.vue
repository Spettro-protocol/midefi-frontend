<template>
  <v-card class="mx-auto">
    <v-app light class="index">
      <AppBar />
      <v-main style="padding: 0px">
        <v-container fluid style="padding: 0px">
          <slot></slot>
        </v-container>
      </v-main>
      <Drawer />
      <Footing></Footing>
    </v-app>
  </v-card>
</template>

<script>
import AppBar from '@/components/layouts/base/AppBar.vue'
import Footing from '@/components/layouts/base/Footing.vue'
import Drawer from '@/components/common/Drawer.vue'

import { mapGetters } from 'vuex'
import * as constants from '@/store/constants'

export default {
  name: 'BaseLayout',
  components: {
    AppBar,
    Footing,
    Drawer,
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters({
      isLogged: constants.SESSION_IS_LOGGED,
    }),
  },
}
</script>
