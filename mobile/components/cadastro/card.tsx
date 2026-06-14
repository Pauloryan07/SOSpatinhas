import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { registerUser } from "../../services/auth";

export default function Card() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telefone, setTelefone] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !email || !password || !telefone) {
      Alert.alert("Aviso", "Preencha todos os campos");
      return;
    }
    setLoading(true);
    try {
      await registerUser({ name, email, password, telefone });
      router.replace("/home");
    } catch (error: any) {
      Alert.alert("Erro", error.response?.data?.message || "Falha no cadastro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Crie sua conta</Text>
      <Text style={styles.subtitle}>Coloque suas informações abaixo</Text>
      <TextInput style={styles.input} placeholder="Nome" placeholderTextColor="#666" autoCapitalize="none" value={name} onChangeText={setName} editable={!loading} />
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#666" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} editable={!loading} />
      <TextInput style={styles.input} placeholder="Senha" placeholderTextColor="#666" secureTextEntry value={password} onChangeText={setPassword} editable={!loading} />
      <TextInput style={styles.input} placeholder="Telefone" placeholderTextColor="#666" keyboardType="phone-pad" value={telefone} onChangeText={setTelefone} editable={!loading} />
      <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Cadastrando..." : "Cadastrar"}</Text>
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
});
