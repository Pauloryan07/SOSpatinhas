import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { ArrowLeft } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const API_URL = "https://sua-api.com"; // troca pela URL da sua API Laravel

export default function CriarPostScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [texto, setTexto] = useState("");
  const [imagem, setImagem] = useState<string | null>(null);
  const [imagemFile, setImagemFile] = useState<any>(null);
  const [carregando, setCarregando] = useState(false);

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
      Alert.alert("Permissão necessária", "Permita o acesso à câmera nas configurações.");
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
        formData.append("image", {
          uri: imagemFile.uri,
          name: nomeArquivo,
          type: tipoArquivo,
        } as any);
      }
      const resposta = await fetch(`${API_URL}/api/posts`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          // Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!resposta.ok) throw new Error("Erro ao publicar");
      Alert.alert("Sucesso!", "Post publicado com sucesso.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert("Erro", "Não foi possível publicar. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header vermelho */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={22} color="#FFF" strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Criar post</Text>
          <View style={{ width: 22 }} />
        </View>
      </View>

      {/* Conteúdo branco */}
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar + input */}
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

        {/* Preview imagem */}
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

        {/* Opções de mídia */}
        <View style={styles.midiaContainer}>
          <Text style={styles.midiaLabel}>Adicionar mídia</Text>
          <View style={styles.midiaOpcoes}>
            <TouchableOpacity style={styles.midiaOpcao} onPress={escolherImagem}>
              <Text style={styles.midiaOpcaoIcone}></Text>
              <Text style={styles.midiaOpcaoTexto}>Galeria</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.midiaOpcao} onPress={tirarFoto}>
              <Text style={styles.midiaOpcaoIcone}></Text>
              <Text style={styles.midiaOpcaoTexto}>Câmera</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Botão publicar fixo embaixo */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={[styles.botaoPublicar, carregando && styles.botaoDesabilitado]}
          onPress={publicar}
          disabled={carregando}
          activeOpacity={0.85}
        >
          {carregando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.botaoPublicarTexto}>Publicar</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  // Header
  header: {
    backgroundColor: "#F54E50",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "600",
  },

  // Body
  body: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  bodyContent: {
    padding: 20,
    paddingBottom: 40,
  },

  // Avatar + texto
  linhaTexto: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
    marginBottom: 8,
  },
  avatarWrapper: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(245,78,80,0.15)",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 46,
    height: 46,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
    minHeight: 120,
    textAlignVertical: "top",
  },
  contador: {
    textAlign: "right",
    fontSize: 12,
    color: "#aaa",
    marginBottom: 24,
  },

  // Preview imagem
  previewContainer: {
    position: "relative",
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
  },
  preview: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  botaoRemover: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#F54E50",
    borderRadius: 14,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  botaoRemoverTexto: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },

  // Mídia
  midiaContainer: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 20,
  },
  midiaLabel: {
    fontSize: 13,
    color: "#aaa",
    marginBottom: 14,
  },
  midiaOpcoes: {
    flexDirection: "row",
    gap: 12,
  },
  midiaOpcao: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fafafa",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  midiaOpcaoIcone: {
    fontSize: 18,
  },
  midiaOpcaoTexto: {
    fontSize: 14,
    color: "#555",
  },

  // Footer com botão
  footer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  botaoPublicar: {
    backgroundColor: "#F54E50",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  botaoPublicarTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});