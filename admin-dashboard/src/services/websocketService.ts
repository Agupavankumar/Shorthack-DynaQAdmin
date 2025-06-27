interface ElementData {
  tagName: string;
  id: string | null;
  className: string | null;
  text: string | null;
  href: string | null;
  value: string | null;
  location: string;
  timestamp: string;
  path?: string;
  attributes?: Record<string, string>;
}

interface TransactionData {
  [key: string]: any;
}

class WebSocketService {
  private socket: WebSocket | null = null;
  public isConnected: boolean = false;
  private onElementClickCallbacks: ((data: any) => void)[] = [];

  connect(adminDashboardUrl: string = 'ws://localhost:5203/'): void {
    try {
      this.socket = new WebSocket(adminDashboardUrl.replace(/^http/, 'ws'));

      this.socket.onopen = () => {
        console.log('Connected to admin dashboard');
        this.isConnected = true;
      };

      this.socket.onclose = () => {
        console.log('Disconnected from admin dashboard');
        this.isConnected = false;
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket connection error:', error);
        this.isConnected = false;
      };

      this.socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'element-clicked') {
            this.onElementClickCallbacks.forEach(cb => cb(message));
          }
        } catch (err) {
          // Ignore non-JSON messages
        }
      };
    } catch (error) {
      console.error('Failed to connect to admin dashboard:', error);
    }
  }

  onElementClick(callback: (data: any) => void) {
    this.onElementClickCallbacks.push(callback);
  }

  sendInstruction(instruction: any, publish: boolean = false): void {
    if (this.socket && this.isConnected) {
      this.socket.send(JSON.stringify({
        type: 'inject-instruction',
        data: { ...instruction, publish },
        timestamp: new Date().toISOString()
      }));
    } else {
      console.warn('WebSocket not connected. Cannot send instruction.');
    }
  }

  sendRevertInstruction(instructionId: string): void {
    if (this.socket && this.isConnected) {
      this.socket.send(JSON.stringify({
        type: 'revert-instruction',
        data: { id: instructionId },
        timestamp: new Date().toISOString()
      }));
    } else {
      console.warn('WebSocket not connected. Cannot send revert instruction.');
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.isConnected = false;
    }
  }
}

export default new WebSocketService(); 