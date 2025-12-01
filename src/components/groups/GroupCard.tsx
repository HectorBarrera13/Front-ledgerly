import React from "react";
import { Pressable, View, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";
import AvatarInitials from "@/components/AvatarInitials";
import { Group, GroupMember } from "@/types/Group";

interface Props {
  readonly group: Group;
  readonly onPress?: (id: string) => void;
  readonly style?: StyleProp<ViewStyle>;
}

export default function GroupCard({ group, onPress, style }: Props) {
  const members: GroupMember[] = group.members ?? [];

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
});