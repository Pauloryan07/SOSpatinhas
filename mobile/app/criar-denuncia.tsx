import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import {
  AlertTriangle,
  ArrowLeft,
  Bird,
  Camera,
  ChevronRight,
  Heart,
  HelpCircle,
  Image as ImageIcon,
  MapPin,
  Shield,
  Zap,
  X,
} from "lucide-react-native";
import { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
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
import api from "@/services/api";

const { width } = Dimensions.get("window");
const PRIMARY = "#F54E50";
const CARD_W = (width - 48 - 12) / 2;

const TIPOS_DENUNCIA = [
  { value: "abandonment", label: "Abandono", icon: Heart },
  { value: "mistreatment", label: "Agressão", icon: AlertTriangle },
  { value: "negligence", label: "Negligência", icon: Shield },
  { value: "injured", label: "Animal ferido", icon: Bird },
  { value: "exploitation", label: "Exploração animal", icon: Zap },
  { value: "other", label: "Outro", icon: HelpCircle },
];

const ESPECIES = [
  { value: "dog", label: "Cachorro" },
  { value: "cat", label: "Gato" },
  { value: "bird", label: "Ave" },
  { value: "other", label: "Outro" },
  { value: "unknown", label: "Não sei" },
];

const CONDICOES = [
  { value: "alive", label: "Vivo" },
  { value: "injured", label: "Ferido" },
  { value: "dead", label: "Morto" },
  { value: "unknown", label: "Não sei" },
];

export default function CriarDenunciaScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [etapa, setEtapa] = useState<1 | 2>(2); // Start directly at form
  const [tipo, setTipo] = useState("other"); // Default to "Outro"
  const [endereco, setEndereco] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [localizandoGps, setLocalizandoGps] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [especie, setEspecie] = useState<string>("unknown");
  const [condicao, setCondicao] = useState<string>("unknown");
  const [fotos, setFotos] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (etapa === 2) obterLocalizacao();
  }, [etapa]);

  async function obterLocalizacao() {
    setLocalizandoGps(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setLatitude(loc.coords.latitude);
      setLongitude(loc.coords.longitude);
      const [geocode] = await Location.reverseGeocodeAsync(loc.coords);
      if (geocode) {
        const partes = [geocode.street, geocode.streetNumber, geocode.district, geocode.city];
        setEndereco(partes.filter(Boolean).join(", "));
      }
    } catch {}
    finally { setLocalizandoGps(false); }
  }

  async function escolherImagens() {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 6 - fotos.length,
      quality: 0.8,
    });
    if (!resultado.canceled) setFotos((prev) => [...prev, ...resultado.assets]);
  }

  async function tirarFoto() {
    const permissao = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert("Permissão necessária", "Permita o acesso à câmera.");
      return;
    }
    const resultado = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!resultado.canceled && fotos.length < 6) setFotos((prev) => [...prev, resultado.assets[0]]);
  }

  function removerFoto(index: number) {
    setFotos((prev) => prev.filter((_, i) => i !== index));
  }

  async function enviar() {
    if (!descricao.trim()) {
      Alert.alert("Campo obrigatório", "Descreva o incidente.");
      return;
    }
    setCarregando(true);
    try {
      const formData = new FormData();
      formData.append("type", tipo);
      formData.append("description", descricao);
      formData.append("animal_species", especie);
      formData.append("animal_condition", condicao);
      if (latitude) formData.append("latitude", String(latitude));
      if (longitude) formData.append("longitude", String(longitude));
      if (endereco) formData.append("address", endereco);
      fotos.forEach((foto, index) => {
        const nome = foto.uri.split("/").pop() || `foto_${index}.jpg`;
        formData.append("evidence_photos[]", {
          uri: foto.uri,
          name: nome,
          type: nome.endsWith(".png") ? "image/png" : "image/jpeg",
        } as any);
      });
      
      console.log("Enviando denúncia:", formData);
      
      const resposta = await api.post("/denunciations", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      console.log("Resposta da denúncia:", resposta.data);
      
      Alert.alert("Denúncia enviada!", "Obrigado por ajudar um animal.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      console.error("Erro ao enviar denúncia:", error.response?.data || error.message || error);
      Alert.alert(
        "Erro", 
        error.response?.data?.message || 
        (error.response?.data ? JSON.stringify(error.response.data) : "Não foi possível enviar. Tente novamente.")
      );
    } finally {
      setCarregando(false);
    }
  }

  const tipoSelecionado = TIPOS_DENUNCIA.find((t) => t.value === tipo);

  // ── ETAPA 1 ──
  if (etapa === 1) {
    return (
      <View style={[s.flex, { backgroundColor: PRIMARY }]}>
        <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 24, alignItems: "center", paddingBottom: 24 }}>
          <TouchableOpacity 
            onPress={() => {
              console.log("Voltando para home...");
              router.replace('/home');
            }} 
            style={{ alignSelf: "flex-start", marginBottom: 24, zIndex: 10 }}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <ArrowLeft size={22} color="#fff" strokeWidth={2} />
          </TouchableOpacity>
          <Text style={{ color: "#fff", fontSize: 36, fontWeight: "900", letterSpacing: 2, marginBottom: 6 }}>DENÚNCIA</Text>
          <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, textAlign: "center" }}>
            Escolha o tipo de denúncia que deseja fazer
          </Text>
        </View>

        <View style={s.gridWrapper}>
          {TIPOS_DENUNCIA.map((opcao, index) => {
            const Icon = opcao.icon;
            const ativo = tipo === opcao.value;
            const isUltimo = index === TIPOS_DENUNCIA.length - 1;
            const isAntepenultimo = index === TIPOS_DENUNCIA.length - 2;
            const totalPar = TIPOS_DENUNCIA.length % 2 === 0;
            return (
              <TouchableOpacity
                key={opcao.value}
                style={[
                  s.card,
                  ativo && s.cardAtivo,
                  (!totalPar && isUltimo) && { alignSelf: "center" },
                ]}
                onPress={() => setTipo(opcao.value)}
                activeOpacity={0.75}
              >
                <View style={[s.cardIconCircle, ativo && s.cardIconCircleAtivo]}>
                  <Icon size={32} color={ativo ? "#fff" : PRIMARY} strokeWidth={1.5} />
                </View>
                <Text style={[s.cardLabel, ativo && s.cardLabelAtivo]}>{opcao.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={[s.etapa1Footer, { paddingBottom: insets.bottom + 20 }]}>
          <TouchableOpacity 
            onPress={() => {
              console.log("Cancelar, voltando para home...");
              router.replace('/home');
            }} 
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <Text style={s.cancelarTexto}>Cancelar</Text>
          </TouchableOpacity>
          {tipo ? (
            <TouchableOpacity style={s.btnContinuar} onPress={() => setEtapa(2)}>
              <Text style={s.btnContinuarTexto}>Continuar</Text>
              <ChevronRight size={18} color="#fff" strokeWidth={2.5} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  }

  // ── ETAPA 2 ──────────────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={[s.header2, { paddingTop: insets.top + 12 }]}>
<<<<<<< HEAD
        <TouchableOpacity onPress={() => router.back()}>
=======
        <TouchableOpacity 
          onPress={() => setEtapa(1)} 
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
>>>>>>> 4ee70aaf3d9647a8de6182d31a1ce5b102c33a17
          <ArrowLeft size={22} color="#fff" strokeWidth={2} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={s.header2Titulo}>Denúncia</Text>
        </View>
      </View>

      <ScrollView style={s.flex} contentContainerStyle={s.formContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* Localização */}
        <View style={s.secao}>
          <Text style={s.secaoTitulo}>Localização</Text>
          <View style={s.locBox}>
            <MapPin size={16} color={PRIMARY} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              {localizandoGps ? (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <ActivityIndicator size="small" color={PRIMARY} />
                  <Text style={s.locMuted}>Obtendo localização...</Text>
                </View>
              ) : latitude ? (
                <Text style={s.locTexto} numberOfLines={2}>{endereco || `${latitude.toFixed(5)}, ${longitude?.toFixed(5)}`}</Text>
              ) : (
                <Text style={s.locMuted}>Localização não obtida</Text>
              )}
            </View>
            <TouchableOpacity onPress={obterLocalizacao} disabled={localizandoGps}>
              <Text style={s.locAtualizar}>Atualizar</Text>
            </TouchableOpacity>
          </View>
          <TextInput style={s.input} placeholder="Ponto de referência" placeholderTextColor="#aaa" value={endereco} onChangeText={setEndereco} />
        </View>

        {/* Animal */}
        <View style={s.secao}>
          <Text style={s.secaoTitulo}>Sobre o animal</Text>
          <Text style={s.fieldLabel}>Espécie</Text>
          <View style={s.chips}>
            {ESPECIES.map((op) => (
              <TouchableOpacity key={op.value} style={[s.chip, especie === op.value && s.chipAtivo]} onPress={() => setEspecie(op.value)}>
                <Text style={[s.chipTxt, especie === op.value && s.chipTxtAtivo]}>{op.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={[s.fieldLabel, { marginTop: 16 }]}>Condição</Text>
          <View style={s.chips}>
            {CONDICOES.map((op) => (
              <TouchableOpacity key={op.value} style={[s.chip, condicao === op.value && s.chipAtivo]} onPress={() => setCondicao(op.value)}>
                <Text style={[s.chipTxt, condicao === op.value && s.chipTxtAtivo]}>{op.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Descrição */}
        <View style={s.secao}>
          <Text style={s.secaoTitulo}>Descrição *</Text>
          <TextInput style={[s.input, s.textArea]} placeholder="Descreva o que está acontecendo..." placeholderTextColor="#aaa" multiline textAlignVertical="top" value={descricao} onChangeText={setDescricao} />
        </View>

        {/* Evidências */}
        <View style={s.secao}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Text style={s.secaoTitulo}>Evidências</Text>
            <Text style={{ fontSize: 13, color: "#aaa" }}>{fotos.length}/6</Text>
          </View>
          {fotos.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
              {fotos.map((foto, i) => (
                <View key={i} style={{ marginRight: 10, position: "relative" }}>
                  <Image source={{ uri: foto.uri }} style={{ width: 88, height: 88, borderRadius: 12 }} />
                  <TouchableOpacity style={s.fotoRemove} onPress={() => removerFoto(i)}>
                    <X size={10} color="#fff" strokeWidth={3} />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
          {fotos.length < 6 && (
            <View style={s.fotoBtns}>
              <TouchableOpacity style={s.fotoBtn} onPress={escolherImagens}>
                <ImageIcon size={20} color={PRIMARY} />
                <Text style={s.fotoBtnTxt}>Galeria</Text>
              </TouchableOpacity>
              <View style={{ width: 1, backgroundColor: "#EBEBEB" }} />
              <TouchableOpacity style={s.fotoBtn} onPress={tirarFoto}>
                <Camera size={20} color={PRIMARY} />
                <Text style={s.fotoBtnTxt}>Câmera</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={[s.footer2, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity style={[s.btnEnviar, carregando && { opacity: 0.55 }]} onPress={enviar} disabled={carregando}>
          {carregando ? <ActivityIndicator color="#fff" /> : <Text style={s.btnEnviarTxt}>Enviar denúncia</Text>}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#fff" },

  tipoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  tipoCard: {
    width: "48%",
    backgroundColor: "#FFF0F0",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: "#FFF0F0",
  },
  tipoCardAtivo: {
    backgroundColor: "#F54E50",
    borderColor: "#F54E50",
  },
  tipoIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  tipoIconCircleAtivo: {
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  tipoLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#F54E50",
    textAlign: "center",
  },
  tipoLabelAtivo: {
    color: "#fff",
  },

  gridWrapper: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 14,
    justifyContent: "center",
    alignContent: "center",
  },
  card: {
    width: CARD_W,
    aspectRatio: 1,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  cardAtivo: {
    backgroundColor: "#c0392b",
  },
  cardIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFF0F0",
    alignItems: "center",
    justifyContent: "center",
  },
  cardIconCircleAtivo: {
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: PRIMARY,
    textAlign: "center",
    paddingHorizontal: 8,
  },
  cardLabelAtivo: { color: "#fff" },
  etapa1Footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cancelarTexto: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 15,
    textDecorationLine: "underline",
  },
  btnContinuar: {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  btnContinuarTexto: { color: "#fff", fontSize: 15, fontWeight: "600" },

  // Etapa 2
  header2: { backgroundColor: PRIMARY, paddingHorizontal: 20, paddingBottom: 16, flexDirection: "row", alignItems: "center" },
  header2Titulo: { color: "#fff", fontSize: 17, fontWeight: "700" },
  header2Sub: { color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 2 },

  formContent: { padding: 20, paddingBottom: 32 },
  secao: { marginBottom: 28 },
  secaoTitulo: { fontSize: 15, fontWeight: "700", color: "#1A1A1A", marginBottom: 12 },
  fieldLabel: { fontSize: 13, fontWeight: "500", color: "#9A9A9A", marginBottom: 8 },

  locBox: { flexDirection: "row", alignItems: "flex-start", backgroundColor: "#FFF0F0", borderRadius: 12, padding: 14, marginBottom: 10 },
  locTexto: { fontSize: 13, color: "#1A1A1A", lineHeight: 18 },
  locMuted: { fontSize: 13, color: "#9A9A9A" },
  locAtualizar: { fontSize: 12, color: PRIMARY, fontWeight: "600" },

  input: { backgroundColor: "#F7F7F7", borderWidth: 1, borderColor: "#EBEBEB", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, color: "#1A1A1A" },
  textArea: { minHeight: 120, textAlignVertical: "top" },

  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: "#F7F7F7", borderWidth: 1.5, borderColor: "#EBEBEB" },
  chipAtivo: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  chipTxt: { fontSize: 13, color: "#9A9A9A", fontWeight: "500" },
  chipTxtAtivo: { color: "#fff" },

  fotoRemove: { position: "absolute", top: 5, right: 5, backgroundColor: PRIMARY, borderRadius: 10, width: 20, height: 20, alignItems: "center", justifyContent: "center" },
  fotoBtns: { flexDirection: "row", borderRadius: 12, borderWidth: 1, borderColor: "#EBEBEB", overflow: "hidden", backgroundColor: "#F7F7F7" },
  fotoBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 14, gap: 8 },
  fotoBtnTxt: { fontSize: 14, color: PRIMARY, fontWeight: "500" },

  footer2: { paddingHorizontal: 20, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#EBEBEB", backgroundColor: "#fff" },
  btnEnviar: { backgroundColor: PRIMARY, borderRadius: 14, paddingVertical: 16, alignItems: "center" },
  btnEnviarTxt: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
