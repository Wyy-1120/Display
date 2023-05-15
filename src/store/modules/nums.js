const state = {
    tasks: [],
    count: 0,
    info: [],
    color: [],
    mastersNum: 0,      //master结点数量
    nodesNum: 0,        //node结点数量
    carsNum: 0,         //车辆数量
    maxNum: 0,          //最大数量
    maxHeight: 0,     //最大高度
    compHeight: 150,      //组件高度
    compWidth: 120,
    leftlines: [],
    rightlines: [],
    activities: [],
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
    },
    setMax(state) {
        state.maxNum = state.nodesNum > state.carsNum ? state.nodesNum : state.carsNum;
        state.maxHeight = state.maxNum * state.compHeight;
    }
}

const actions = {
    increment(context) {
        context.commit("increment");
    },
    clear(state){
        state.info = [];
    },
    setMax(context) {
        context.commit("setMax");
    }
}
export default {
    namespaced: true,
    state,
    mutations,
    actions
  }