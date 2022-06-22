<template>
  <v-list-item-group :style="{ backgroundColor: 'white' }" active-class="text--accent-4">
    <v-list-item to="/">
      <v-list-item-icon>
        <v-icon>mdi-home</v-icon>
      </v-list-item-icon>
      <v-list-item-title>Home</v-list-item-title>
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
    <v-list-item @click="connect">
      <v-list-item-icon>
        <v-icon>mdi-wallet</v-icon>
      </v-list-item-icon>
      <v-list-item-title>Connect</v-list-item-title>
    </v-list-item>
  </v-list-item-group>
</template>

<script>
export default {
  name: 'DisconnectedDropdown',
  props: {
    connect: {
      type: Function,
      required: true,
    },
  },
}
</script>
