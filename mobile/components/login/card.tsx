import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { login } from "../../services/auth";

export default function Card() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Aviso", "Preencha todos os campos");
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      router.replace("/home");
    } catch (error: any) {
      Alert.alert("Erro", error.response?.data?.message || "Falha no login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Bem-vindo de volta</Text>
      <Text style={styles.subtitle}>Coloque suas informações abaixo</Text>
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#666" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} editable={!loading} />
      <TextInput style={styles.input} placeholder="Senha" placeholderTextColor="#666" secureTextEntry value={password} onChangeText={setPassword} editable={!loading} />
      <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Entrando..." : "Entrar"}</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Esqueceu sua senha?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, width: "100%", backgroundColor: "#FFF", borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: 40, padding: 24 },
  title: { fontSize: 34, fontWeight: "700", textAlign: "center", color: "#000" },
  subtitle: { fontSize: 16, textAlign: "center", color: "#555", marginTop: 8, marginBottom: 30 },
  input: { height: 55, borderWidth: 1, borderColor: "#D9D9D9", borderRadius: 15, paddingHorizontal: 16, marginBottom: 15, backgroundColor: "#FFF" },
  button: { height: 55, backgroundColor: "#F54E50", borderRadius: 15, justifyContent: "center", alignItems: "center", marginTop: 10 },
  buttonDisabled: { backgroundColor: "#f8a5a6" },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
  forgotPassword: { textAlign: "center", marginTop: 20, color: "#444", fontSize: 14 },
});
