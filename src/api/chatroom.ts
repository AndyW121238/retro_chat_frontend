import request from "@/utils/request";

// ==================== 响应 DTO ====================
interface UserListItemResponse {
  id: string;
  username: string;
  userAvatar: string | null;
  userProfile: string | null;
  topOver: number;
  email: string;
  phone: string;
  roomId: string;
  lastLogin: string;
  lastActivityTime: string;
  lastMessageContent: string;
}

interface SendMessageResponse {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  messageType: number;
  chatRoomId: string;
  receiverId: string;
  timestamp: string;
  messageFormat: number;
  fileUrl: string | null;
  fileSize: number | null;
  replyToId: string | null;
  isRead: number;
}

interface ChatHistoryResponse {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  messageType: number;
  chatRoomId: string;
  receiverId: string;
  timestamp: string;
  messageFormat: number;
  fileUrl: string | null;
  fileSize: number | null;
  replyToId: string | null;
  isRead: number;
}

// ==================== 请求 DTO ====================
// 发送消息请求体
export interface SendMessageRequest {
  content: string;
  chatRoomId: string | null;
  receiverId: string;
  timestamp: string;
  messageFormat: 1 | 2 | 3 | 4;
}

// 获取私聊用户列表接口
export const getDMsListApi = () => {
  return request.get<Array<UserListItemResponse>>("/friend/list");
};

// 发送私聊消息接口
export const sendDirectMessageApi = (sendMessageBody: SendMessageRequest) => {
  return request.post<SendMessageResponse, SendMessageRequest>(
    "/chat/private",
    sendMessageBody
  );
};

// 获取聊天记录
export const getChatHistoryApi = (roomId: string) => {
  return request.get<Array<ChatHistoryResponse>>("/chat/history", {
    params: {
      roomId,
    },
  });
};
