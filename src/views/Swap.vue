<template>
  <div class="status">
    <v-row class="d-flex justify-center">
      <h1>Swap</h1>
    </v-row>
    <div class="d-flex justify-center">
      <v-card flat width="1250" class="list">
        <Swap />
      </v-card>
    </div>
  </div>
</template>

<script>
import Swap from '@/components/swap/index.vue'

export default {
  name: 'SwapPage',
  components: {
    Swap,
  },
  data() {
    return {
      dialog: false,
    }
  },
  computed: {
    dataObject() {
      return {
        flag: this.dialog,
      }
    },
  },
}
</script>
