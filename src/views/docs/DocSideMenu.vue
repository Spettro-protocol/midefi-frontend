<template>
  <v-navigation-drawer permanent>
    <DocSideItems />
  </v-navigation-drawer>
</template>
<script>
import DocSideItems from '@/views/docs/DocSideItems.vue'

export default {
  name: 'DocSideMenu',
  components: {
    DocSideItems,
  },
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
