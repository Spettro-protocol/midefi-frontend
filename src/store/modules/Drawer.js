import * as constants from '@/store/constants'

const state = () => ({
  drawer: false,
  dataDrawer: null,
  isFaq: false,
  isDoc: false,
})

const mutations = {
  // eslint-disable-next-line no-shadow
  [constants.DRAWER_SET]: (state) => {
    state.drawer = !state.drawer
  },

  // eslint-disable-next-line no-shadow
  [constants.DRAWER_SET_DATA]: (state, data) => {
    state.dataDrawer = data
  },
  // eslint-disable-next-line no-shadow
  [constants.DRAWER_SET_PROPERTY]: (state, data) => {
    const [[property, value]] = Object.entries(data)
    state[property] = value
  },
}

const getters = {
  getDrawer() {
    return state.drawer
  },
}

export default {
  state,
  mutations,
  getters,
}
