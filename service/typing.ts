export enum UpdateChatDirection {
  before = 'before',
  after = 'after'
}

export enum GroupType {
  GROUP = 'group',
  PRIVY = 'privy'
}

export enum MessageType {
  FONT = 'font',
  TRANSFER = 'transfer'
}

export class UpdateUsersDto {
  iconUrl?: string;

  name?: string;

  summary?: string;
}

export class JoinGroupDto {
  groupId?: string;
  members?: string[]; // 群成员
}

export class CreateGroupDto {
  name?: string; // 群名称

  iconUrl?: string; // 群图像

  summary?: string; // 群简介

  ads?: string; // 群公告

  members?: string[]; // 群成员
}

export class UpdateGroupDto {
  groupId?: string;

  name?: string; // 群名称

  iconUrl?: string; // 群图像

  summary?: string; // 群简介

  ads?: string; // 群公告
}

export class UpdateOwnerDto {
  groupId?: string;

  owners?: string[]; // 管理员
}

export class AgreeGroupDto {
  groupId?: string;

  userId?: string;
}

export class RejectedGroupDto {
  groupId?: string;

  userId?: string;
}

export class FireGroupDto {
  groupId?: string;

  userIds?: string[];
}

export class CreateFriendsDto {
  follower?: string;

  remark?: string;

  notes?: string;
}

export class UpdateFriendDto {
  friendId?: string;

  notes?: string;
}

export enum InviteStatus {
  Pending = 'pending',
  Rejected = 'rejected',
  Agreed = 'agreed'
}

export class QueryUsersDto {
  user?: string;

  status?: InviteStatus;
}

export class QueryMomentDto {
  user?: string;

  limit?: number;

  offset?: number | string;
}

export class CreateCommentDto {
  momentId?: string;

  content?: string;
}

export class QueryMessageDto {
  groupId?: string;

  fromTs?: string; // date

  limit?: string | number;

  offset?: string | number;
}

export class CreateMessageDto {
  groupId?: string;

  type?: MessageType; // 信息类型

  content?: string;
}

export class ReadMessageDto {
  groupId?: string;

  messageId?: string;
}
