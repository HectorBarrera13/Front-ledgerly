import { Tabs } from "expo-router";

export default function DebtsInnerTabs() {
  return (
    <Tabs>
      <Tabs.Screen name="pay" options={{ title: "Por pagar" }} />
      <Tabs.Screen name="receive" options={{ title: "Por recibir" }} />
    </Tabs>
  );
}
