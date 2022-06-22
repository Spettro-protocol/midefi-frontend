<template>
  <v-row class="transaction-hash d-flex justify-center align-center">
    <v-col cols="2" />
    <v-col class="itemInfo"> transaction hash: {{ hash | formatHash }} </v-col>
    <v-col class="ml-1">
      <v-icon small @click="copyHash"> content_copy </v-icon>
      <a class="ml-2 listTitle" target="_blank" :href="rskExplorerUrl">View on RSKExplorer</a>
    </v-col>
    <v-col cols="1" />
  </v-row>
</template>

<script>
export default {
  name: 'TransactionHash',
  props: {
    hash: {
      type: String,
      required: true,
    },
  },
  computed: {
    rskExplorerUrl() {
      return !process.env.VUE_APP_HTTP_EXPLORER
        ? '#'
        : `${process.env.VUE_APP_HTTP_EXPLORER}tx/${this.hash}`
    },
  },
  methods: {
    copyHash() {
      navigator.clipboard.writeText(this.hash)
    },
  },
}
</script>
