const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  nums: state => state.nums,
  resourceInfo: state => state.resourceInfo,
  nodeInfo: state => state.resourceInfo.nodeInfo,
  podNodeList: state => state.resourceInfo.podNodeList,
}
export default getters
