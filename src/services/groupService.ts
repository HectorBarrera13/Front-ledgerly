import apiClient from "@/services/apiClient";
import { DebtBetweenUsers } from "@/types/Debt";
import { CreateGroupResponse, Group, GroupDebtRequest, GroupMember } from "@/types/Group";

type ApiGroupItem = {
    group: Group;
    members: GroupMember[];
};

export async function createGroup(
    name: string,
    description: string,
    memberIds: string[]
): Promise<CreateGroupResponse> {
    const response = await apiClient.post<CreateGroupResponse>("/groups", {
        name,
        description,
        members: memberIds,
    });
    return response;
}

export async function getMyGroups(): Promise<Group[]> {
    const response = await apiClient.get<ApiGroupItem[]>("/groups");
    console.log("getMyGroups response:", response);
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

export async function getGroupDebts(
    groupId: string,
    role?: string,
    status?: string
): Promise<DebtBetweenUsers[]> {
    const params = new URLSearchParams();
    if (role) params.append("role", role);
    if (status) params.append("status", status);

    const url = params.toString()
        ? `/groups/${groupId}/debts?${params.toString()}`
        : `/groups/${groupId}/debts`;

    const response = await apiClient.get<{ items: DebtBetweenUsers[] }>(url);
    return response.items;
}

export async function createGroupDebt(data:GroupDebtRequest): Promise<DebtBetweenUsers> {
    const response = await apiClient.post<DebtBetweenUsers>(`/groups/group-debt`, data);
    return response;
}

export async function getGroupDebtById(groupId: string, debtId: string) {
    const debts = await getGroupDebts(groupId);
    return debts.find((item) => item.id === debtId) || null;
}

export async function addGroupMember(groupId: string, memberIds: string[]): Promise<GroupMember[]> {
    const response = await apiClient.post<GroupMember[]>(`/groups/${groupId}/members`, {
        new_member_ids: memberIds,
    });
    return response;
}
