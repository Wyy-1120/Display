const state = {
  tasks: [],
  count: 0,
  info: [],
  color: [],
  mastersNum: 0,
  nodesNum: 0,
  carsNum: 0,
  maxNum: 0,
  maxHeight: 0,
  compHeight: 150,
  compWidth: 120,
  leftlines: [],
  rightlines: [],
  activities: [],
  cpuInfo: {
    'master1':[],
    'master2':[],
    'master3':[],
    // 'node4':[],
  },
  memoryInfo: {
    'master1':[],
    'master2':[],
    'master3':[],
    // 'node4':[],
  }
};

const mutations = {
  increment(state) {
    state.count++;
    state.tasks.push({ id: state.count });
  },
  init(state) {
    console.log("nums init");
    state.tasks = [];
    state.count = 0;
    state.info = [];
    state.color = [];
    state.mastersNum = 0;
    state.carsNum = 0;
    state.compHeight = 150;
    state.compWidth = 120;
    state.leftlines = [];
    state.rightlines = [];
  },
  setMax(state) {
    state.maxNum = Math.max(state.nodesNum, state.carsNum);
    state.maxHeight = state.maxNum * state.compHeight;
  },
};

const actions = {
  increment({ commit }) {
    commit("increment");
  },
  init({ commit }) {
    commit("init");
  },
  setMax({ commit }) {
    commit("setMax");
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
