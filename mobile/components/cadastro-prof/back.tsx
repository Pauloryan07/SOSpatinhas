import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function Voltar() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.arrow}
        onPress={() => router.push("/cadastro-user")}
      >
        <ArrowLeft size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 20,
    paddingHorizontal: 24,
    marginTop: 30,
    gap: 16,
  },
  arrow: {
    marginTop: 20,
    marginRight: 320,
  },
});
