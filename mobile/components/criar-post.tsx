import * as ImagePicker from "expo-image-picker";
import { ArrowLeft } from "lucide-react-native";
import { useRef, useState } from "react";
import {
  Alert, Animated, Image, Modal, PanResponder, Platform,
  ScrollView, StyleSheet, Text, TextInput,
  TouchableOpacity, View, ActivityIndicator, KeyboardAvoidingView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const API_URL = "https://sua-api.com";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function CriarPostModal({ visible, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const [texto, setTexto] = useState("");
  const [imagem, setImagem] = useState<string | null>(null);
  const [imagemFile, setImagemFile] = useState<any>(null);
  const [carregando, setCarregando] = useState(false);

  const translateY = useRef(new Animated.Value(600)).current;

  // Abre/fecha com animação
  const openAnim = () =>
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      damping: 20,
      stiffness: 180,
    }).start();

  const closeAnim = (cb?: () => void) =>
    Animated.timing(translateY, {
      toValue: 600,
      duration: 280,
      useNativeDriver: true,
    }).start(cb);

  // Swipe down para fechar
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 8,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120 || g.vy > 1.2) {
          closeAnim(onClose);
        } else {
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  const handleClose = () => closeAnim(onClose);

  async function escolherImagem() {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!resultado.canceled) {
      const asset = resultado.assets[0];
      setImagem(asset.uri);
      setImagemFile(asset);
    }
  }

  async function tirarFoto() {
    const permissao = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert("Permissão necessária", "Permita o acesso à câmera.");
      return;
    }
    const resultado = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!resultado.canceled) {
      const asset = resultado.assets[0];
      setImagem(asset.uri);
      setImagemFile(asset);
    }
  }

  async function publicar() {
    if (!texto.trim()) {
      Alert.alert("Campo obrigatório", "Escreva algo antes de publicar.");
      return;
    }
    setCarregando(true);
    try {
      const formData = new FormData();
      formData.append("text", texto);
      if (imagemFile) {
        const nomeArquivo = imagemFile.uri.split("/").pop();
        const tipoArquivo = nomeArquivo?.endsWith(".png") ? "image/png" : "image/jpeg";
        formData.append("image", { uri: imagemFile.uri, name: nomeArquivo, type: tipoArquivo } as any);
      }
      const resposta = await fetch(`${API_URL}/api/posts`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });
      if (!resposta.ok) throw new Error();
      Alert.alert("Sucesso!", "Post publicado!", [{ text: "OK", onPress: handleClose }]);
    } catch {
      Alert.alert("Erro", "Não foi possível publicar. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onShow={openAnim}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Fundo escurecido */}
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={handleClose} />

        <Animated.View
          style={[styles.sheet, { paddingBottom: insets.bottom + 16, transform: [{ translateY }] }]}
        >
          {/* Handle de arrasto */}
          <View {...panResponder.panHandlers} style={styles.handleArea}>
            <View style={styles.handle} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose}>
              <ArrowLeft size={22} color="#333" strokeWidth={2} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Criar post</Text>
            <View style={{ width: 22 }} />
          </View>

          {/* Corpo */}
          <ScrollView
            style={styles.body}
            contentContainerStyle={styles.bodyContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.linhaTexto}>
              <View style={styles.avatarWrapper}>
                <Image
                  source={require("@/assets/icons/Perfil-2.png")}
                  style={styles.avatar}
                  resizeMode="cover"
                />
              </View>
              <TextInput
                style={styles.input}
                placeholder="O que você quer compartilhar?"
                placeholderTextColor="#aaa"
                multiline
                maxLength={1000}
                value={texto}
                onChangeText={setTexto}
              />
            </View>

            <Text style={styles.contador}>{texto.length}/1000</Text>

            {imagem && (
              <View style={styles.previewContainer}>
                <Image source={{ uri: imagem }} style={styles.preview} />
                <TouchableOpacity
                  style={styles.botaoRemover}
                  onPress={() => { setImagem(null); setImagemFile(null); }}
                >
                  <Text style={styles.botaoRemoverTexto}>✕</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.midiaContainer}>
              <Text style={styles.midiaLabel}>Adicionar mídia</Text>
              <View style={styles.midiaOpcoes}>
                <TouchableOpacity style={styles.midiaOpcao} onPress={escolherImagem}>
                  <Text style={styles.midiaOpcaoIcone}>🖼</Text>
                  <Text style={styles.midiaOpcaoTexto}>Galeria</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.midiaOpcao} onPress={tirarFoto}>
                  <Text style={styles.midiaOpcaoIcone}>📷</Text>
                  <Text style={styles.midiaOpcaoTexto}>Câmera</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* Botão publicar */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.botaoPublicar, carregando && styles.botaoDesabilitado]}
              onPress={publicar}
              disabled={carregando}
              activeOpacity={0.85}
            >
              {carregando ? <ActivityIndicator color="#fff" /> : <Text style={styles.botaoPublicarTexto}>Publicar</Text>}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.45)" },
  sheet: { backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: "90%" },
  handleArea: { paddingVertical: 10, alignItems: "center" },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: "#ddd" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: "#f0f0f0" },
  headerTitle: { fontSize: 16, fontWeight: "600", color: "#222" },
  body: { flexGrow: 0 },
  bodyContent: { padding: 20, paddingBottom: 8 },
  linhaTexto: { flexDirection: "row", gap: 12, alignItems: "flex-start", marginBottom: 8 },
  avatarWrapper: { width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(245,78,80,0.15)", overflow: "hidden", justifyContent: "center", alignItems: "center" },
  avatar: { width: 44, height: 44 },
  input: { flex: 1, fontSize: 15, color: "#333", lineHeight: 22, minHeight: 100, textAlignVertical: "top" },
  contador: { textAlign: "right", fontSize: 12, color: "#aaa", marginBottom: 20 },
  previewContainer: { position: "relative", marginBottom: 16, borderRadius: 12, overflow: "hidden" },
  preview: { width: "100%", height: 180, borderRadius: 12 },
  botaoRemover: { position: "absolute", top: 8, right: 8, backgroundColor: "#F54E50", borderRadius: 14, width: 28, height: 28, alignItems: "center", justifyContent: "center" },
  botaoRemoverTexto: { color: "#fff", fontSize: 13, fontWeight: "600" },
  midiaContainer: { borderTopWidth: 1, borderTopColor: "#f0f0f0", paddingTop: 16 },
  midiaLabel: { fontSize: 12, color: "#aaa", marginBottom: 10 },
  midiaOpcoes: { flexDirection: "row", gap: 10 },
  midiaOpcao: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#fafafa", borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14, borderWidth: 1, borderColor: "#f0f0f0" },
  midiaOpcaoIcone: { fontSize: 16 },
  midiaOpcaoTexto: { fontSize: 13, color: "#555" },
  footer: { paddingHorizontal: 20, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#f0f0f0" },
  botaoPublicar: { backgroundColor: "#F54E50", borderRadius: 12, paddingVertical: 15, alignItems: "center" },
  botaoDesabilitado: { opacity: 0.6 },
  botaoPublicarTexto: { color: "#fff", fontSize: 16, fontWeight: "600" },
});