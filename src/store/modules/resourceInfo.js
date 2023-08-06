// const MAX_DATA_LENGTH = 50; // 定义最大数据长度为50
// const state = {
//   nodeInfo: [],
//   podInfo: [],
// };

// const mutations = {
//   init(state) {
//     console.log("init");
//     state.nodeInfo = [];
//     state.podInfo = [];
//   },
//   setNodeData(state, data) {
//     // 添加新数据到数组末尾
//     state.nodeInfo.push(...data);

//     // 如果数组长度超过50，删除超出的部分
//     if (state.nodeInfo.length > MAX_DATA_LENGTH) {
//       state.nodeInfo.splice(0, state.nodeInfo.length - MAX_DATA_LENGTH);
//     }
//   },
//   setPodData(state, data) {
//     // 添加新数据到数组末尾
//     state.podInfo.push(...data);

//     // 如果数组长度超过50，删除超出的部分
//     if (state.podInfo.length > MAX_DATA_LENGTH) {
//       state.podInfo.splice(0, state.podInfo.length - MAX_DATA_LENGTH);
//     }
//   },
// };

// const actions = {
//   init({ commit }) {
//     commit("init");
//   },
// };

// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions,
// };
const MAX_DATA_LENGTH = 50; // 定义最大数据长度为50
const state = {
  nodeInfo: {},
  nodeList:[],
  podInfo: {},
  podNodeList:[],
};

const mutations = {
  initNode(state) {
    console.log("resourceInfo node init");
    state.nodeInfo = {};
    state.nodeList = [];
  },
  initPod(state) {
    console.log("resourceInfo pod init");
    state.podInfo = {};
    state.podNodeList = [];
  },
  setNodeData(state, data) {
    data.forEach(item => {
      const { nodeName, ...metrics } = item;
      if (!state.nodeInfo[nodeName]) {
        state.nodeInfo[nodeName] = [];
      }
      if (!state.nodeList.includes(nodeName)){
        state.nodeList.push(nodeName);
      }
      state.nodeInfo[nodeName].push(metrics);
      // console.log("setNodeData:nodeName:"+nodeName);
    });

    // 删除超出50的数据
    Object.keys(state.nodeInfo).forEach(nodeName => {
      if (state.nodeInfo[nodeName].length > MAX_DATA_LENGTH) {
        state.nodeInfo[nodeName].splice(0, state.nodeInfo[nodeName].length - MAX_DATA_LENGTH);
      }
    });
  },
  setPodData(state, data) {
    // 将数据按照nodeName分组，以键值对形式存储在podInfo中
      data.forEach(item => {
        // console.log("setPodData:item:"+item)
        const { podName, ...metrics } = item;
        if (!state.podInfo[podName]) {
          state.podInfo[podName] = [];
        }
        if (!state.podNodeList.includes(item.nodeName)){
          console.log("setPodData:item.nodeName:"+item.nodeName)
          state.podNodeList.push(item.nodeName);
        }
        state.podInfo[podName].push(metrics);
        // console.log("setNodeData:nodeName:"+nodeName);
      });
  
      // 删除超出50的数据
      Object.keys(state.podInfo).forEach(podName => {
        if (state.podInfo[podName].length > MAX_DATA_LENGTH) {
          state.podInfo[podName].splice(0, state.podInfo[podName].length - MAX_DATA_LENGTH);
        }
    });
  },
};

const actions = {
  init({ commit }) {
    commit("init");
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
