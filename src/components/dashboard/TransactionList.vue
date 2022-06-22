<template>
  <div class="transaction-list">
    <h2 class="ma-0 d-flex align-center">Transaction History:</h2>
    <div class="pt-1">
      <v-divider class="divider-search" />
    </div>
    <v-data-table
      dense
      :headers="headers"
      :items="getLocalStorageData"
      item-key="name"
      class="elevation-1"
      :custom-filter="filterOnlyCapsText"
      :item-class="itemRowBackground"
      :search="toSearch"
      :footer-props="{
        'items-per-page-options': [3, 5, 10, 20],
      }"
      :items-per-page="3"
    >
      <template slot="no-data">No history around here </template>

      <template v-slot:top>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          class="mx-4"
        ></v-text-field>
      </template>

      <template v-slot:[`item.hash`]="{ item }">
        <a target="_blank" :href="rskExplorerUrl(item.hash)">{{
          (!item.hash ? '0x0' : item.hash) | formatHash
        }}</a>
      </template>
      <template v-slot:[`item.date`]="{ item }">
        {{ new Date(item.date).toISOString().split('T')[0] }}
      </template>
      <template v-slot:[`item.price`]="{ item }">
        {{ !item.price ? 0 : item.price | formatNumber }}
      </template>
      <template v-slot:[`item.status`]="{ item }">
        {{ !item.status ? 'FAIL' : 'SUCCESS' }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'TransactionList',
  data() {
    return {
      search: '',
      accountTxStorage: '',
    }
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
    toSearch() {
      return this.search.toUpperCase()
    },
    getLocalStorageData() {
      return this.$user.getDataLocalStorage(this.account)
    },
    headers() {
      return [
        {
          text: 'Date',
          value: 'date',
          align: 'start',
        },
        {
          text: 'Hash',
          value: 'hash',
        },
        { text: 'Tokens', value: 'price' },
        { text: 'Tx Event', value: 'type' },
        { text: 'Status', value: 'status' },
      ]
    },
  },
  mounted() {
    if (localStorage.accountTx) {
      this.accountTxStorage = localStorage.accountTx
    }
  },
  methods: {
    rskExplorerUrl(hash) {
      return !process.env.VUE_APP_HTTP_EXPLORER
        ? '#'
        : `${process.env.VUE_APP_HTTP_EXPLORER}tx/${hash}`
    },
    itemRowBackground: function (item) {
      return !item.status ? 'tx-fail-row item-row-center' : 'item-row-center'
    },
    filterOnlyCapsText(value, search, item) {
      item
      return (
        value != null &&
        search != null &&
        typeof value === 'string' &&
        value.toString().toLocaleUpperCase().indexOf(search) !== -1
      )
    },
  },
}
</script>
