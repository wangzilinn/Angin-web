let state = {
  category: 'All',
  tag:undefined,
  query: undefined,
  style: 'default'
}
let mutations = {
  SET_CATEGORY : (state, category) => {
    console.log("mutations" + category)
    state.category = category
    //当更新category时,原有的tag变为无效
    state.tag = undefined
  },
  SET_QUERY: (state, query) => {
    state.query = query
  },
  SET_TAG: (state, tag) => {
    state.tag = tag
  }
}

let actions = {
  setCategory({commit}, data) {
    console.log("action" + data)
    commit('SET_CATEGORY', data)
  },
  setQuery({commit}, {data}) {
    console.log("action" + data)
    commit('SET_QUERY', data)
  },
  setTag({commit}, data) {
    commit('SET_TAG', data)
  }
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}
