<template>
  <div class="approve">
    <div class="successBox">
      <v-row class="my-5 d-flex justify-center">
        <h1 class="blueish">Success!</h1>
      </v-row>
      <v-row class="my-5 d-flex justify-center">
        <div class="text-center">You have successfully approve the market <br /></div>
      </v-row>
    </div>
    <v-row class="my-5 d-flex justify-center">
      <v-btn class="button" rounded color="#3e954a" @click="closeDialog">
        Back to {{ dialogFatherName }}
      </v-btn>
    </v-row>
  </div>
</template>
<script>
export default {
  name: 'Approve',
  props: {
    dialogFatherName: String,
  },
  methods: {
    closeDialog() {
      this.$emit('backToMainDialog')
    },
  },
}
</script>
