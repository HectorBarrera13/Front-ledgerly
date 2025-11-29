import React from "react";
import { Pressable, View, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";

type Member = {
  id: string;
  firstName?: string;
  lastName?: string;
};

interface Group {
  id: string;
  name: string;
  description?: string;
  amount?: number;
  members?: Member[];
}

interface Props {
  readonly group: Group;
  readonly onPress?: (id: string) => void;
  readonly style?: StyleProp<ViewStyle>;
}

export default function GroupCard({ group, onPress, style }: Props) {
  // Miembros simulados (provisional si no se pasan en group)
  const members: Member[] = group.members ?? [
    { id: "1", firstName: "Daniela", lastName: "Villarino" },
    { id: "2", firstName: "Adrián", lastName: "Cruz" },
    { id: "3", firstName: "Luis", lastName: "Martínez" },
    { id: "4", firstName: "Fernanda", lastName: "López" },
  ];

  const getInitials = (member?: Member): string => {
    const f = member?.firstName?.[0]?.toUpperCase() ?? "";
    const l = member?.lastName?.[0]?.toUpperCase() ?? "";
    return `${f}${l}`;
  };

  return (
    <Pressable onPress={() => onPress?.(group.id)} style={[styles.card, style]}>
      <View style={styles.rowTop}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{group.name}</Text>
          {group.description ? <Text style={styles.desc}>{group.description}</Text> : null}
        </View>

      </View>

      <View style={styles.divider} />

      <View style={styles.membersRow}>
        {members.slice(0, 6).map((m) => (
          <View key={m.id} style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{getInitials(m)}</Text>
          </View>
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

  avatarContainer: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: "#9e60ed",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
});
