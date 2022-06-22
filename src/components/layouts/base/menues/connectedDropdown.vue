<template>
  <v-list-item-group :style="{ backgroundColor: 'white' }" active-class="text--accent-4">
    <v-list-item to="/">
      <v-list-item-icon>
        <v-icon>mdi-home</v-icon>
      </v-list-item-icon>
      <v-list-item-title>Home</v-list-item-title>
    </v-list-item>

    <v-list-item to="/myActivity">
      <v-list-item-icon>
        <v-icon>mdi-chart-bar</v-icon>
      </v-list-item-icon>
      <v-list-item-title>Dashboard</v-list-item-title>
    </v-list-item>

    <v-list-item to="/supplyBorrow">
      <v-list-item-icon>
        <v-icon>mdi-bank</v-icon>
      </v-list-item-icon>
      <v-list-item-title>Supply/Borrow</v-list-item-title>
    </v-list-item>

    <v-list-item to="/status">
      <v-list-item-icon>
        <v-icon>mdi-store</v-icon>
      </v-list-item-icon>
      <v-list-item-title>Markets</v-list-item-title>
    </v-list-item>

    <v-list-item to="/docs/introduction">
      <v-list-item-icon>
        <v-icon>mdi-book-open-variant</v-icon>
      </v-list-item-icon>
      <v-list-item-title>Docs</v-list-item-title>
    </v-list-item>

    <v-list-item to="/faq">
      <v-list-item-icon>
        <v-icon>mdi-frequently-asked-questions</v-icon>
      </v-list-item-icon>
      <v-list-item-title>FAQs</v-list-item-title>
    </v-list-item>

    <v-list-item :inactive="true">
      <v-list-item-icon>
        <v-icon>mdi-wallet-outline</v-icon>
      </v-list-item-icon>
      <v-list-item-title>{{ account }}</v-list-item-title>
    </v-list-item>
  </v-list-item-group>
</template>

<script>
export default {
  name: 'ConnectedDropdown',
  props: {
    account: {
      type: String,
      required: true,
    },
  },
}
</script>
