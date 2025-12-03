import React from "react";
import { Pressable, View, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";
import AvatarInitials from "@/components/AvatarInitials";
import { Group, GroupMember } from "@/types/Group";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/providers/AuthContext";

interface Props {
  readonly group: Group;
  readonly onPress?: (id: string) => void;
  readonly style?: StyleProp<ViewStyle>;
  readonly role?: "CREDITOR" | "DEBTOR";
}

export default function GroupCard({ group, onPress, style, role }: Props) {
  const members: GroupMember[] = group.members ?? [];
  const router = useRouter();
  const { profile } = useAuth();
  const currentUserId = profile?.user?.id;

  const isCreator = currentUserId === group.creatorId;
  const canAddMembers = isCreator && role === "CREDITOR";

  const handleAddMember = (e: any) => {
    e.stopPropagation?.();
    router.push({
      pathname: "/(modals)/addNewMembersGroup",
      params: { groupId: group.groupId }
    });
  };

  return (
    <Pressable onPress={() => onPress?.(group.groupId)} style={[styles.card, style]}>
      <View style={styles.rowTop}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{group.name}</Text>
          {group.description ? <Text style={styles.desc}>{group.description}</Text> : null}
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.membersRow}>
        {members.slice(0, 6).map((mapMembers) => (
          <AvatarInitials
            key={mapMembers.id}
            firstName={mapMembers.firstName}
            lastName={mapMembers.lastName}
            size={35}
            style={{ marginRight: 10 }}
          />
        ))}
        <Pressable
          onPress={handleAddMember}
          style={[
            styles.addMemberButton,
            !canAddMembers && { opacity: 0.5 }
          ]}
          disabled={!canAddMembers}
        >
          <Ionicons name="person-add" size={22} color="#fff" />
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#6C1ED6",
    borderRadius: 16,
    padding: 18,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 16,
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  },
  rowTop: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  titleBlock: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },
  desc: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.12)",
    marginVertical: 12,
  },
  membersRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  addMemberButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: "#B5B5B5",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
  },
});