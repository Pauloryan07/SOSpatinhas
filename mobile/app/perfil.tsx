import Card from "@/components/perfil/card";
import api from "@/services/api";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { ArrowLeft, Pencil } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  telefone?: string;
  avatar?: string;
}

export default function PerfilScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [carregando, setCarregando] = useState(true);

  // Estados para modais
  const [modalPerfil, setModalPerfil] = useState(false);
  const [modalSenha, setModalSenha] = useState(false);

  // Estados para edição de perfil
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [salvandoPerfil, setSalvandoPerfil] = useState(false);

  // Estados para alteração de senha
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [salvandoSenha, setSalvandoSenha] = useState(false);

  // Estados para avatar
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [salvandoAvatar, setSalvandoAvatar] = useState(false);

  useEffect(() => {
    api
      .get("/user/profile")
      .then((res) => {
        setUser(res.data);
        if (res.data.avatar) {
          setAvatarUri(`http://192.168.0.103:8000/storage/${res.data.avatar}`);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setCarregando(false));
  }, []);

  const iniciais = user?.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  function abrirModalPerfil() {
    setNome(user?.name ?? "");
    setTelefone(user?.telefone ?? "");
    setModalPerfil(true);
  }

  async function salvarPerfil() {
    if (!nome.trim()) {
      Alert.alert("Atenção", "Nome é obrigatório.");
      return;
    }
    setSalvandoPerfil(true);
    try {
      const res = await api.put("/user/profile", { name: nome, telefone });
      setUser(res.data);
      setModalPerfil(false);
      Alert.alert("Sucesso", "Perfil atualizado!");
    } catch (e: any) {
      Alert.alert("Erro", e?.response?.data?.message ?? "Não foi possível atualizar.");
    } finally {
      setSalvandoPerfil(false);
    }
  }

  async function salvarSenha() {
    if (!senhaAtual || !novaSenha || !confirmaSenha) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }
    if (novaSenha !== confirmaSenha) {
      Alert.alert("Atenção", "As senhas não coincidem.");
      return;
    }
    if (novaSenha.length < 8) {
      Alert.alert("Atenção", "A nova senha deve ter pelo menos 8 caracteres.");
      return;
    }
    setSalvandoSenha(true);
    try {
      await api.put("/user/password", {
        current_password: senhaAtual,
        password: novaSenha,
        password_confirmation: confirmaSenha,
      });
      setModalSenha(false);
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmaSenha("");
      Alert.alert("Sucesso", "Senha alterada com sucesso!");
    } catch (e: any) {
      Alert.alert("Erro", e?.response?.data?.message ?? "Não foi possível alterar a senha.");
    } finally {
      setSalvandoSenha(false);
    }
  }

  async function selecionarAvatar() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setAvatarUri(uri);
      enviarAvatar(uri);
    }
  }

  async function enviarAvatar(uri: string) {
    setSalvandoAvatar(true);
    try {
      const formData = new FormData();
      const fileName = uri.split("/").pop() || "avatar.jpg";
      const fileType = fileName.endsWith(".png") ? "image/png" : "image/jpeg";
      
      formData.append("avatar", {
        uri,
        name: fileName,
        type: fileType,
      } as any);

      const res = await api.put("/user/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      if (res.data.avatar) {
        setAvatarUri(`http://192.168.0.103:8000/storage/${res.data.avatar}`);
        setUser(res.data);
      }

      Alert.alert("Sucesso", "Avatar atualizado!");
    } catch (e: any) {
      Alert.alert("Erro", e?.response?.data?.message ?? "Não foi possível atualizar o avatar.");
      setAvatarUri(null);
    } finally {
      setSalvandoAvatar(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={22} color="#FFF" strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Meu Perfil</Text>
          <TouchableOpacity>
            <Image source={require("@/assets/icons/Noti.png")} style={styles.icon} resizeMode="contain" />
          </TouchableOpacity>
        </View>

        <View style={styles.avatarContainer}>
          <View style={styles.avatarWrapper}>
            {carregando || salvandoAvatar ? (
              <ActivityIndicator color="#fff" />
            ) : avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>{iniciais}</Text>
            )}
          </View>
          <TouchableOpacity style={styles.avatarEdit} onPress={selecionarAvatar} disabled={salvandoAvatar}>
            <Pencil size={12} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {carregando ? (
          <ActivityIndicator color="#fff" style={{ marginBottom: 24 }} />
        ) : (
          <>
            <Text style={styles.name}>{user?.name ?? "Usuário"}</Text>
            <Text style={styles.userId}>#{String(user?.id ?? "").padStart(4, "0")}</Text>
          </>
        )}

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={abrirModalPerfil}>
            <Image source={require("@/assets/icons/Editar.png")} style={styles.actionIcon} resizeMode="contain" />
            <Text style={styles.actionText}>Editar perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => setModalSenha(true)}>
            <Image source={require("@/assets/icons/Senha.png")} style={styles.actionIcon} resizeMode="contain" />
            <Text style={styles.actionText}>Alterar senha</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Card user={user} />

      {/* Modal Editar Perfil */}
      <Modal visible={modalPerfil} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Editar Perfil</Text>

            <Text style={styles.inputLabel}>Nome</Text>
            <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Seu nome" />

            <Text style={styles.inputLabel}>Telefone</Text>
            <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} placeholder="Seu telefone" keyboardType="phone-pad" />

            <View style={styles.modalBtns}>
              <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={() => setModalPerfil(false)}>
                <Text style={styles.btnOutlineText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btnPrimary, salvandoPerfil && styles.btnDisabled]} onPress={salvarPerfil} disabled={salvandoPerfil}>
                {salvandoPerfil ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnPrimaryText}>Salvar</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Alterar Senha */}
      <Modal visible={modalSenha} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Alterar Senha</Text>

            <Text style={styles.inputLabel}>Senha atual</Text>
            <TextInput style={styles.input} value={senhaAtual} onChangeText={setSenhaAtual} secureTextEntry placeholder="••••••••" />

            <Text style={styles.inputLabel}>Nova senha</Text>
            <TextInput style={styles.input} value={novaSenha} onChangeText={setNovaSenha} secureTextEntry placeholder="••••••••" />

            <Text style={styles.inputLabel}>Confirmar nova senha</Text>
            <TextInput style={styles.input} value={confirmaSenha} onChangeText={setConfirmaSenha} secureTextEntry placeholder="••••••••" />

            <View style={styles.modalBtns}>
              <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={() => setModalSenha(false)}>
                <Text style={styles.btnOutlineText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btnPrimary, salvandoSenha && styles.btnDisabled]} onPress={salvarSenha} disabled={salvandoSenha}>
                {salvandoSenha ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnPrimaryText}>Salvar</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F54E50" },
  header: { backgroundColor: "#F54E50", alignItems: "center", paddingHorizontal: 20, paddingBottom: 28 },
  headerTop: { width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  headerTitle: { color: "#FFF", fontSize: 17, fontWeight: "600" },
  icon: { width: 24, height: 24 },
  avatarContainer: { position: "relative", marginBottom: 12 },
  avatarWrapper: { width: 110, height: 110, borderRadius: 55, backgroundColor: "rgba(255,255,255,0.3)", justifyContent: "center", alignItems: "center", overflow: "hidden" },
  avatarImage: { width: 110, height: 110, borderRadius: 55 },
  avatarText: { color: "#fff", fontSize: 36, fontWeight: "700" },
  avatarEdit: { position: "absolute", bottom: 4, right: 4, backgroundColor: "#F54E50", borderWidth: 2, borderColor: "#fff", borderRadius: 12, width: 26, height: 26, alignItems: "center", justifyContent: "center" },
  name: { color: "#FFF", fontSize: 17, fontWeight: "700", marginBottom: 4 },
  userId: { color: "rgba(255,255,255,0.75)", fontSize: 13, marginBottom: 20 },
  actionRow: { flexDirection: "row", gap: 12 },
  actionBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 10, paddingHorizontal: 16, paddingVertical: 10 },
  actionIcon: { width: 16, height: 16, opacity: 0.7 },
  actionText: { color: "#FFF", fontSize: 13, fontWeight: "500" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end" },
  modalBox: { backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalTitle: { fontSize: 18, fontWeight: "700", color: "#1F2937", marginBottom: 20 },
  inputLabel: { fontSize: 13, fontWeight: "600", color: "#374151", marginBottom: 6 },
  input: { backgroundColor: "#F7F7F7", borderWidth: 1, borderColor: "#EBEBEB", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: "#1A1A1A", marginBottom: 14 },
  modalBtns: { flexDirection: "row", gap: 12, marginTop: 8 },
  btn: { flex: 1, borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  btnPrimary: { backgroundColor: "#F54E50" },
  btnPrimaryText: { color: "#fff", fontSize: 15, fontWeight: "600" },
  btnOutline: { borderWidth: 1.5, borderColor: "#F54E50" },
  btnOutlineText: { color: "#F54E50", fontSize: 15, fontWeight: "600" },
  btnDisabled: { opacity: 0.55 },
});
