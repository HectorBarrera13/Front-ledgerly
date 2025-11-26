import { Text, View, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import CloseButton from "@/components/CloseButton";
import CheckmarkIcon from "@asset/icon/icon_checkmark.svg";

export default function SuccessScreen() {
  const router = useRouter();
  const { title, message } = useLocalSearchParams();

    return (
        <View style={styles.container}>
            <CloseButton style={styles.closeButton}  onPress={() => router.replace("/debts")} />
            <CheckmarkIcon width={64} height={64} />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        alignItems: "center", 
        justifyContent: "center", 
        padding: 32 
    },
    title: { 
        justifyContent: "center",
        textAlign: "center",
        alignSelf: 'center',
        width: '100%',
        marginTop: 24,
        fontSize: 28, 
        fontWeight: "bold", 
        marginBottom: 12 ,
        color: "#7519EB",
        paddingBottom: 8,
        paddingLeft: 8,
        paddingRight: 8,
        },
    message: { 
        fontSize: 16, 
        textAlign: "center", 
        marginBottom: 20 
    },
    closeButton: {
        position: 'absolute',
        right: 20,
        top: 50,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#D9D9D9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnText: { 
        color: "#FFF", 
        fontSize: 18, 
        fontWeight: "bold" 
    },
});
