// WebSocketService.js
import store from '@/store';
class WebSocketService {
    constructor() {
      this.socket = null;
    }
  
    connect() {
      const websocketUrl = 'ws://localhost:8089/monitor/pod'; // 替换成你的后端WebSocket URL
      this.socket = new WebSocket(websocketUrl);
  
      this.socket.onopen = () => {
        store.commit('resourceInfo/initPod');
        console.log('pod WebSocket connected');
      };
  
      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // console.log(data);
        store.commit('resourceInfo/setPodData', data);
        // this.listeners.forEach((listener) => {
        //   listener(data);
        // });
      };
  
      this.socket.onclose = () => {
        console.log('服务端提出pod WebSocket disconnected');
        // 在此处理断开连接的逻辑，比如重连等
      };
    }
  
    disconnect() {
      if (this.socket) {
        console.log('客户端提出pod WebSocket disconnect');
        this.socket.close();
      }
    }
  }
  
  export default new WebSocketService();
  
  