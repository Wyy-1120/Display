// WebSocketService.js
import store from '@/store';
class WebSocketService {
    constructor() {
      this.socket = null;
      // this.listeners = [];
    }
  
    connect() {
      const websocketUrl = 'ws://localhost:8089/monitor/node'; // 替换成你的后端WebSocket URL
      this.socket = new WebSocket(websocketUrl);
  
      this.socket.onopen = () => {
        store.commit('resourceInfo/initNode');
        console.log('node WebSocket connected');
      };
  
      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // console.log(data);
        store.commit('resourceInfo/setNodeData', data);
        // this.listeners.forEach((listener) => {
        //   listener(data);
        // });
      };
  
      this.socket.onclose = () => {
        console.log('服务端提出node WebSocket disconnected');
        // 在此处理断开连接的逻辑，比如重连等
      };
    }
  
    // addListener(callback) {
    //   this.listeners.push(callback);
    // }
  
    disconnect() {
      if (this.socket) {
        console.log('客户端提出node WebSocket disconnect');
        this.socket.close();
      }
    }
  }
  
  export default new WebSocketService();
  

// // WebSocketService.js
// class WebSocketService {
//     constructor() {
//       this.socket = null;
//       this.listeners = [];
//     }
  
//     connect() {
//       const websocketUrl = 'ws://localhost:8089/monitor/node'; // 替换成你的后端WebSocket URL
//       this.socket = new WebSocket(websocketUrl);
  
//       this.socket.onopen = () => {
//         console.log('WebSocket connected');
//       };
  
//       this.socket.onmessage = (event) => {
//         const data = JSON.parse(event.data);
//         console.log(data);
//         this.listeners.forEach((listener) => {
//           listener(data);
//         });
//       };
  
//       this.socket.onclose = () => {
//         console.log('服务端提出WebSocket disconnected');
//         // 在此处理断开连接的逻辑，比如重连等
//       };
//     }
  
//     addListener(callback) {
//       this.listeners.push(callback);
//     }
  
//     disconnect() {
//       if (this.socket) {
//         console.log('客户端提出WebSocket disconnect');
//         this.socket.close();
//       }
//     }
//   }
  
//   export default new WebSocketService();
  