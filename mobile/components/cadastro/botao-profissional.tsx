import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CriarConta() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.arrow} onPress={() => router.push("/")}>
        <ArrowLeft size={24} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.text}>Você é um profissional?</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/cadastro-profissional")}
      >
        <Text style={styles.buttonText}>Sim</Text>
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
    marginTop: 50,
    gap: 16,
  },
  arrow: {
    marginRight: 50,
  },
  text: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "500",
  },

  button: {
    width: 90,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
});
