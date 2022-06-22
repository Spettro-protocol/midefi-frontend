<template>
  <v-navigation-drawer v-model="show" absolute temporary>
    <v-list nav dense>
      <v-list-item-group v-model="group" active-class="deep-purple--text text--accent-4">
        <DocSideItems v-if="isDoc" />
        <VuePerfectScrollbar v-if="isFaq" class="scroll-area">
          <FaqSideItems />
        </VuePerfectScrollbar>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import DocSideItems from '@/views/docs/DocSideItems.vue'
import FaqSideItems from '@/views/faqs/FAQSideItems.vue'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'

export default {
  name: 'Drawer',
  components: {
    DocSideItems,
    FaqSideItems,
    VuePerfectScrollbar,
  },
  data() {
    return {
      show: false,
      group: null,
      isFaq: false,
      isDoc: false,
    }
  },
  watch: {
    group() {
      this.show = false
    },
  },
  created() {
    this.$store.watch(
      (state) => state.Drawer.drawer,
      () => {
        this.cleanDrawer()
        this.show = true
        this.isFaq = this.$store.state.Drawer.isFaq
        this.isDoc = this.$store.state.Drawer.isDoc
      },
    )
  },
  methods: {
    cleanDrawer() {
      this.show = false
      this.group = null
      this.isDoc = false
      this.isFaq = false
    },
  },
}
</script>
