const state = {
    tasks: [],
    count:0,
    info:[],
    isNode1Visible: false,
    isNode2Visible: false,
    node1Color: 'black',
    node2Color: 'black',
    infoColoe: 'black',
}

const mutations = {
    increment(state) {
        state.count++;
        state.tasks.push({ id:count });
    },
    clear(state){
        state.info = [];
    }
}

const actions = {
    increment(context) {
        context.commit("increment");
    },
    clear(state){
        state.info = [];
    }
}
export default {
    namespaced: true,
    state,
    mutations,
    actions
  }