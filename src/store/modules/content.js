//let content = {
//  state:{
//    category:'all',
//    query:undefined,
//    style:'default'
//  },
//  mutations:{
//    SET_CATEGORY (state, category){
//      this.state.category = category
//    },
//
//    SET_QUERY(state, query) {
//      this.state.query = query
//    }
//  },
//
//  actions:{
//    setCategory({commit}, data) {
//      console.log(data)
//      commit('SET_CATEGORY', data)
//    },
//    setQuery({commit}, data) {
//      console.log(data)
//      commit('SET_QUERY', data)
//    }
//  }
let state = {
  category: 'All',
  query: undefined,
  style: 'default'
}
let mutations = {
  SET_CATEGORY : (state, category) => {
    console.log("mutations" + category)
    state.category = category
  },

  SET_QUERY: (state, query) => {
    state.query = query
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
  }
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}
