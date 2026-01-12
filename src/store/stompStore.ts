import { defineStore } from "pinia";
import { Client, type Client as ClientType, type StompSubscription } from "@stomp/stompjs";

export type SubscriptionCallback = (message: any) => void;

interface SubscriptionInfo {
  subscription: StompSubscription;
  destination: string;
  callbacks: Set<SubscriptionCallback>;
}

export const useStompStore = defineStore("stompStore", {
  state: () => ({
    client: null as ClientType | null,
    isConnected: false,
    subscriptions: new Map<string, SubscriptionInfo>(),
    connectionPromise: null as Promise<void> | null,
  }),

  getters: {
    getClient: (state) => state.client,
    getIsConnected: (state) => state.isConnected,
  },

  actions: {
    /**
     * 初始化并连接 Stomp 客户端
     */
    async connect(): Promise<void> {
      // 如果已经在连接中，等待现有连接
      if (this.connectionPromise) {
        return this.connectionPromise;
      }

      // 如果已经连接，直接返回
      if (this.isConnected && this.client?.active) {
        return Promise.resolve();
      }

      // 创建新的连接 Promise
      this.connectionPromise = new Promise((resolve, reject) => {
        const token = localStorage.getItem("token");
        if (!token) {
          reject(new Error("未找到 token，无法建立连接"));
          return;
        }

        // 如果客户端已存在但未连接，先停用
        if (this.client && !this.client.active) {
          this.client.deactivate();
        }

        // 创建新的客户端
        this.client = new Client({
          brokerURL: `/ws/chat-ws?Authorization=${token}`,
          connectHeaders: {
            Authorization: token,
          },
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
          onConnect: (frame) => {
            console.log("Stomp连接成功", frame);
            this.isConnected = true;
            this.connectionPromise = null;
            resolve();
          },
          onStompError: (frame) => {
            console.error("Stomp错误", frame);
            this.isConnected = false;
            this.connectionPromise = null;
            reject(new Error(frame.headers["message"] || "Stomp连接错误"));
          },
          onWebSocketError: (event) => {
            console.error("WebSocket错误", event);
            this.isConnected = false;
            this.connectionPromise = null;
            reject(new Error("WebSocket连接错误"));
          },
          onDisconnect: () => {
            console.log("Stomp连接断开");
            this.isConnected = false;
            this.subscriptions.clear();
          },
        });

        // 激活连接
        this.client.activate();
      });

      return this.connectionPromise;
    },

    /**
     * 断开连接
     */
    disconnect(): void {
      if (this.client) {
        // 取消所有订阅
        this.subscriptions.forEach((info) => {
          try {
            info.subscription.unsubscribe();
          } catch (error) {
            console.error("取消订阅失败", error);
          }
        });
        this.subscriptions.clear();

        // 停用客户端
        if (this.client.active) {
          this.client.deactivate();
        }
        this.client = null;
        this.isConnected = false;
        this.connectionPromise = null;
      }
    },

    /**
     * 订阅消息
     * @param destination 订阅的目标路径
     * @param callback 消息回调函数
     * @returns 订阅 ID，可用于取消订阅（格式: destination）
     */
    async subscribe(
      destination: string,
      callback: SubscriptionCallback
    ): Promise<string> {
      // 确保已连接
      await this.connect();

      if (!this.client || !this.isConnected) {
        throw new Error("Stomp客户端未连接");
      }

      // 如果已经存在该 destination 的订阅，直接添加回调
      const existingSubscription = this.subscriptions.get(destination);
      if (existingSubscription) {
        existingSubscription.callbacks.add(callback);
        return destination;
      }

      // 创建新的订阅
      const subscription = this.client.subscribe(destination, (frame) => {
        const subscriptionInfo = this.subscriptions.get(destination);
        if (!subscriptionInfo) {
          return;
        }

        let message: any;
        try {
          message = JSON.parse(frame.body);
        } catch (error) {
          console.error("解析消息失败", error);
          message = frame.body;
        }

        // 调用所有注册的回调
        subscriptionInfo.callbacks.forEach((cb) => {
          try {
            cb(message);
          } catch (error) {
            console.error("回调函数执行失败", error);
          }
        });
      });

      // 保存订阅信息
      this.subscriptions.set(destination, {
        subscription,
        destination,
        callbacks: new Set([callback]),
      });

      return destination;
    },

    /**
     * 取消订阅（移除指定的回调）
     * @param destination 订阅的目标路径
     * @param callback 要移除的回调函数，如果不提供则取消整个订阅
     */
    unsubscribe(
      destination: string,
      callback?: SubscriptionCallback
    ): void {
      const subscriptionInfo = this.subscriptions.get(destination);
      if (!subscriptionInfo) {
        return;
      }

      // 如果提供了回调函数，只移除该回调
      if (callback) {
        subscriptionInfo.callbacks.delete(callback);
        // 如果所有回调都已移除，取消订阅
        if (subscriptionInfo.callbacks.size === 0) {
          try {
            subscriptionInfo.subscription.unsubscribe();
          } catch (error) {
            console.error("取消订阅失败", error);
          }
          this.subscriptions.delete(destination);
        }
      } else {
        // 如果没有提供回调函数，取消整个订阅
        try {
          subscriptionInfo.subscription.unsubscribe();
        } catch (error) {
          console.error("取消订阅失败", error);
        }
        this.subscriptions.delete(destination);
      }
    },

    /**
     * 发送消息
     * @param destination 目标路径
     * @param body 消息体
     * @param headers 额外的头部信息
     */
    async send(
      destination: string,
      body: any,
      headers?: Record<string, string>
    ): Promise<void> {
      await this.connect();

      if (!this.client || !this.isConnected) {
        throw new Error("Stomp客户端未连接");
      }

      const messageBody = typeof body === "string" ? body : JSON.stringify(body);

      this.client.publish({
        destination,
        body: messageBody,
        headers: headers || {},
      });
    },
  },
});
