<template>
  <v-dialog v-model="isOpen" persistent width="700">
    <template>
      <Loader />
    </template>
  </v-dialog>
</template>

<script>
import Loader from '@/components/common/Loader.vue'

export default {
  name: 'WaitingDialog',
  components: {
    Loader,
  },
  props: {
    isOpen: {
      type: Boolean,
    },
  },
}
</script>
