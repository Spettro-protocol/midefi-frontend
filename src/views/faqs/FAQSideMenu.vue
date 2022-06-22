<template>
  <v-navigation-drawer permanent>
    <FaqSideItems />
  </v-navigation-drawer>
</template>
<script>
import FaqSideItems from '@/views/faqs/FAQSideItems.vue'

export default {
  name: 'FaqSideMenu',
  components: {
    FaqSideItems,
  },
  data() {
    return {
      items: [
        {
          title: 'What exactly is MIDefi?',
          hash: '#whatIs',
        },
        {
          title: 'Is MIDefi a DEX?',
          hash: '#canTrade',
        },
        {
          title: 'How does MIDefi work?',
          hash: '#howWorks',
        },
        {
          title: 'Can I try it for free?',
          hash: '#howCost',
        },
        {
          title: 'How much does using MIDefi cost?',
          hash: '#howProfit',
        },
        {
          title: 'How do I get a wallet?',
          hash: '#getWallet',
        },
        {
          title: 'Connecting to Testnet',
          hash: '#testnet',
        },
        {
          title: 'Connecting to Mainnet',
          hash: '#mainnet',
        },
        {
          title: 'Why is gas price so high?',
          hash: '#gasPrice',
        },
        {
          title: 'How do accounts earn interests?',
          hash: '#earnings',
        },
        {
          title: 'How much earnings can I expect?',
          hash: '#howMuchEarnings',
        },
        {
          title: 'Can I borrow without a deposit?',
          hash: '#canBorrow',
        },
        {
          title: 'How does Borrowing work?',
          hash: '#howBorrow',
        },
        {
          title: 'What fees are involved in Borrowing?',
          hash: '#borrowFee',
        },
        {
          title: 'How does Collateral Factor work?',
          hash: '#howColFact',
        },
        {
          title: 'Can I borrow from a market I have not supplied to?',
          hash: '#crossBorrow',
        },
        {
          title: `What happens if someone doesn't pay their debt?`,
          hash: '#whatDebt',
        },
        {
          title: 'What is preventing someone from withdrawing all of the balance in the contracts?',
          hash: '#reserves',
        },
        {
          title: 'How can I have more debt than before?',
          hash: '#priceVariation',
        },
        {
          title: 'What is a health factor?',
          hash: '#healthFactor',
        },
        {
          title: 'What happens if my health factor becomes negative?',
          hash: '#liquidation',
        },
        {
          title: 'How secure Is MIDefi?',
          hash: '#security',
        },
        {
          title: 'I am a developer',
          hash: '#dev',
        },
        {
          title: 'General troubleshooting',
          hash: '#help',
        },
        {
          title: 'How do I contact support?',
          hash: '#support',
        },
      ],
    }
  },
}
</script>
