import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import DebtInfo from "@component/debts/DebtInfo";
import { Button } from "@component/Button";
import CloseButton from "@/components/CloseButton";

export default function DebtDetailScreen() {
  const { id, mode } = useLocalSearchParams();
  const router = useRouter();

  // provisional para testeo
  const debt = {
    id,
    concept: "Cena del viernes",
    description: "Dividimos la cuenta entre todos los de la mesa.",
    amount: 450,
    creditor: "Daniela",
    debtor: "Edwin",
  };

  console.log("MODE IS:", mode);

  const finalMode = mode || "";

  const decodedMessage = finalMode === "receivable"
    ? "¡La deuda será marcada como saldada cuando el deudor confirme el pago!"
    : "¡La deuda será marcada como pagada cuando el acreedor confirme el pago!";

  const decodedTitle = finalMode === "receivable"
    ? "Hemos notificado al deudor"
    : "Hemos notificado al acreedor";

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Deuda por {finalMode === "receivable" ? "cobrar" : "pagar"}</Text>
        <CloseButton style={styles.closeButton} />
      </View>

      <DebtInfo
        concept={debt.concept}
        description={debt.description}
        amount={debt.amount}
      />

      {/* Show 'Acreedor' when viewing debts 'por pagar' and 'Deudor' when 'por cobrar' */}
      <Text style={styles.sectionTitle}>{finalMode === "receivable" ? "Deudor" : "Acreedor"}</Text>
      <View style={styles.inputBox}>
        <Text style={styles.inputText}>{finalMode === 'receivable' ? debt.debtor : debt.creditor}</Text>
      </View>

      <Text style={styles.sectionTitle}>Estatus</Text>
      <View style={styles.inputBox}>
        <Text style={styles.inputText}>Estatus de la deuda</Text>
      </View>

      <View style={{ height: 12 }} />

      <Button
        title={finalMode === "receivable" ? "Marcar como saldada" : "Marcar como pagada"}
        onPress={() => {
          const title = encodeURIComponent(decodedTitle);
          const message = encodeURIComponent(decodedMessage);
          router.push(`(modals)/successNotification?title=${title}&message=${message}`);
        }}
        style={styles.payButton}
      />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f7f7f7'
  },
  header: {
    height: 64,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6C1ED6',
    justifyContent: 'center',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 12,
    top: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e6e6e6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: '#444',
    fontSize: 18,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#6C1ED6',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 8,
  },
  inputBox: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d6d6d6',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  inputText: {
    fontSize: 16,
    color: '#333'
  },
  label: {
    color: '#555',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  value: {
    fontSize: 20,
  },
  payButton: {
    backgroundColor: '#6C1ED6',
    borderRadius: 30,
    width: '100%',
    paddingVertical: 14,
    marginTop: 6,
  },
});
