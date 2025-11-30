import apiClient from "@/services/apiClient";
import { DebtBetweenUsers } from "@/types/Debt";
import { CreateGroupResponse, Group, GroupMember } from "@/types/Group";

type ApiGroupItem = {
    group: Group;
    members: GroupMember[];
};

export async function createGroup(
    name: string,
    description: string,
    memberIds: string[]
): Promise<CreateGroupResponse> {
    console.log("Creating group with:", name, memberIds);
    const response = await apiClient.post<CreateGroupResponse>("/groups", {
        name,
        description,
        members: memberIds,
    });
    return response;
}

export async function getMyGroups(): Promise<Group[]> {
    const response = await apiClient.get<ApiGroupItem[]>("/groups");
    return response.map((item: ApiGroupItem) => ({
        ...item.group,
        members: item.members,
    }));
}

export async function getGroupDetails(groupId: string): Promise<Group> {
    const response = await apiClient.get<{ group: Group; members: GroupMember[] }>(`/groups/${groupId}`);
    return { ...response.group, members: response.members };
}

export async function getGroupMembers(groupId: string): Promise<GroupMember[]> {
    const response = await apiClient.get<{ items: GroupMember[] }>(`/groups/${groupId}/members`);
    return response.items;
}

export async function getGroupDebts(groupId: string): Promise<DebtBetweenUsers[]> {
    const response = await apiClient.get<{ items: DebtBetweenUsers[] }>(`/groups/${groupId}/debts`);
    return response.items;
}