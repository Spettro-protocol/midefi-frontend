<template>
  <v-list-item-group>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title"> Documentation </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>
    <v-list dense nav>
      <v-list-item
        v-for="item in items"
        :key="item.path"
        link
        :class="item.path === $route.path ? 'highlight' : ''"
        @click="item.method"
      >
        <v-list-item-content>
          <v-list-item-title>
            {{ item.title }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-list-item-group>
</template>
<script>
export default {
  name: 'DocSideItems',
  data() {
    return {
      items: [
        {
          title: 'Introduction',
          path: '/docs/introduction',
          method: () => this.$router.push({ name: 'Introduction' }),
        },
        {
          title: 'Glossary',
          path: '/docs/keyConcepts',
          method: () => this.$router.push({ name: 'KeyConcepts' }),
        },
        {
          title: 'How to',
          path: '/docs/howTo',
          method: () => this.$router.push({ name: 'HowTo' }),
        },
        {
          title: 'Financial',
          path: '/docs/financialMath',
          method: () => this.$router.push({ name: 'FinancialMath' }),
        },
        {
          title: 'Contracts',
          path: '/docs/contracts',
          method: () => this.$router.push({ name: 'Contracts' }),
        },
        {
          title: 'Oracles',
          path: '/docs/oracles',
          method: () => this.$router.push({ name: 'Oracles' }),
        },
        {
          title: 'Security',
          path: '/docs/securityAudits',
          method: () => this.$router.push({ name: 'SecurityAudits' }),
        },
        {
          title: 'Whitepaper',
          method: () =>
            window.open(
              'https://github.com/riflending/rlending-protocol/blob/master/whitepaper/rLending-Whitepaper-v1.0.pdf',
              '_blank',
            ),
        },
      ],
    }
  },
}
</script>
