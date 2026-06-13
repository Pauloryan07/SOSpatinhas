import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CriarConta() {
  
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Não tem uma conta?</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/cadastro-user")}
      >
        <Text style={styles.buttonText}>Criar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 130,
    paddingHorizontal: 24,
    marginTop: 50,
    gap: 16,
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
