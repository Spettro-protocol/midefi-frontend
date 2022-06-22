<template>
  <component :is="currentComponent">
    <router-view />
  </component>
</template>

<script>
import BaseLayout from '@/components/layouts/base/Index.vue'

export default {
  name: 'App',
  components: {
    BaseLayout,
  },
  data() {
    return {
      layout: 'Base',
      layouts: ['Base'],
    }
  },
  computed: {
    currentComponent() {
      return `${this.layout.toLowerCase()}-layout`
    },
  },
  created() {},
  methods: {},
}
</script>
