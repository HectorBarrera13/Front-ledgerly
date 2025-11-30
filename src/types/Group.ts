export interface GroupMember {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
}

export interface Group {
    groupId: string;
    name: string;
    description: string;
    createdAt: string;
    members?: GroupMember[];
}

export interface CreateGroupResponse {
    group: Group;
    members: GroupMember[];
}