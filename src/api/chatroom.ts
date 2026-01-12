import request from "@/utils/request";

// ==================== 响应 DTO ====================
interface UserListItemResponse {
  id: string;
  username: string;
  userAvatar: string;
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

interface ChatHistoryMessage {
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

interface PagedChatHistoryResponse {
  records: Array<ChatHistoryMessage>;
  pageNumber: string;
  pageSize: string;
  totalPage: string;
  totalRow: string;
}

interface LaunchVideoCallResponse {
  content: string;
  signal: boolean;
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

export interface LaunchVideoCallRequest {
  toUserId: string;
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
export const getChatHistoryApi = (
  roomId: string,
  current: number,
  pageSize: number
) => {
  return request.post<PagedChatHistoryResponse>("/chat/page-history", {
    roomId,
    current,
    pageSize,
  });
};

// 发起视频通话接口
export const launchVideoCall = (toUserId: string) => {
  return request.post<LaunchVideoCallResponse>("/video/call", {
    toUserId,
  });
};
