import apiClient from "@/services/apiClient";
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