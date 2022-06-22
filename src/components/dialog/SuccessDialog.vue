<template>
  <v-dialog v-model="isInternallyOpen" persistent width="700">
    <v-card class="dialog container">
      <div class="successBox">
        <v-row class="my-5 d-flex justify-center">
          <h1 class="blueish">Success!</h1>
        </v-row>
        <v-row class="my-5 d-flex justify-center">
          <div class="text-center">
            {{ message }}
          </div>
        </v-row>
        <v-row class="my-5 d-flex justify-center">
          <v-btn class="button" rounded color="#3e954a" @click="isInternallyOpen = false">
            Close
          </v-btn>
        </v-row>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'SuccessDialog',
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isInternallyOpen: this.isOpen,
    }
  },
}
</script>
