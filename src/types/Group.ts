export interface GroupMember {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    picture?: string;
}

export interface Group {
    groupId: string;
    name: string;
    description: string;
    createdAt: string;
    creatorId?: string;
    members?: GroupMember[];
}

export interface CreateGroupResponse {
    group: Group;
    members: GroupMember[];
}

export interface GroupDebtRequest {
    group_id: string;
    purpose: string;
    description: string;
    currency: string;
    debtors: { debtorId: string; amount: number }[];
}