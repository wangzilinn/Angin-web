let state = {
  category: 'All',
  query: undefined,
  style: 'default'
}
let mutations = {
  SET_CATEGORY : (state, category) => {
    console.log("mutations" + category)
    state.category = category
    //当更新category时,原有的tag变为无效
  },
  SET_QUERY: (state, query) => {
    console.log("mutations" + query)
    state.query = query
  },
}

let actions = {
  setCategory({commit}, data) {
    console.log("action" + data)
    commit('SET_CATEGORY', data)
    commit('SET_QUERY', undefined)
  },
  setQuery({commit}, data) {
    console.log("action" + data)
    commit('SET_QUERY', data)
    commit('SET_CATEGORY', undefined)
  },
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}
