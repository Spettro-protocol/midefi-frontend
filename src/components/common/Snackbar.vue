<template>
  <v-snackbar v-model="show" app right shaped multi-line :timeout="timeout" :color="snackbarColor">
    <div class="loaderProgress">
      <v-progress-circular
        v-if="loader"
        :size="50"
        color="white"
        indeterminate
      ></v-progress-circular>
    </div>

    <div class="messageSnack">
      {{ message }}
    </div>
    <div v-if="!!subMessage" class="subMessageSnack">
      {{ subMessage }}
    </div>
    <div v-if="tx != 0" class="explorerSnack">
      Transaction:
      <a target="_blank" :href="rskExplorerUrl(tx)">{{ (!tx ? '0x0' : tx) | formatHash }}</a>
    </div>
    <template v-if="canClose" v-slot:action="{ attrs }">
      <v-btn color="white" text v-bind="attrs" @click="show = false"> Close </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import * as constants from '@/store/constants'
export default {
  name: 'Snackbar',
  data() {
    return {
      show: false,
      message: '',
      subMessage: '',
      snackbarColor: 'info',
      timeout: -1,
      canClose: true,
      tx: 0,
      loader: false,
    }
  },
  created() {
    this.$store.watch(
      (state) => state.Snackbar.snack,
      () => {
        const msg = this.$store.state.Snackbar.snack
        if (msg !== null) {
          this.cleanSnack()
          this.loader = this.$store.state.Snackbar.loader
          this.snackbarColor = this.$store.state.Snackbar.color
          this.show = true
          this.message = this.$store.state.Snackbar.snack
          if (this.$store.state.Snackbar.tx != 0) this.tx = this.$store.state.Snackbar.tx
          if (this.$store.state.Snackbar.subSnack)
            this.subMessage = this.$store.state.Snackbar.subSnack
          this.$store.commit(constants.SNACK_SET, null)
        }
      },
    )
  },
  methods: {
    rskExplorerUrl(hash) {
      return `${process.env.VUE_APP_HTTP_EXPLORER}tx/${hash}`
    },
    cleanSnack() {
      this.show = false
      this.message = ''
      this.subMessage = ''
      this.canClose = true
      this.tx = 0
      this.loader = false
    },
  },
}
</script>
