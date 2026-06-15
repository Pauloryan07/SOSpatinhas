import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import {
  ArrowLeft,
  Camera,
  Image as ImageIcon,
  X,
  MapPin,
  AlertTriangle,
  Heart,
  Zap,
  Bird,
  HelpCircle,
  ChevronRight,
} from "lucide-react-native";
import { useState, useEffect } from "react";
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
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import api from "@/services/api";

const { width } = Dimensions.get("window");
const PRIMARY = "#F54E50";
const PRIMARY_LIGHT = "#FFF0F0";
const GRAY_BG = "#F7F7F7";
const GRAY_BORDER = "#EBEBEB";
const TEXT_DARK = "#1A1A1A";
const TEXT_MUTED = "#9A9A9A";

const TIPOS_DENUNCIA = [
  { value: "abandonment", label: "Abandono", icon: Heart, desc: "Animal deixado sozinho" },
  { value: "mistreatment", label: "Maus tratos", icon: AlertTriangle, desc: "Agressão ou violência" },
  { value: "negligence", label: "Negligência", icon: Zap, desc: "Falta de cuidados básicos" },
  { value: "injured", label: "Animal ferido", icon: Bird, desc: "Animal necessita socorro" },
  { value: "exploitation", label: "Exploração", icon: AlertTriangle, desc: "Uso indevido do animal" },
  { value: "other", label: "Outro", icon: HelpCircle, desc: "Outro tipo de situação" },
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

  const [etapa, setEtapa] = useState<1 | 2>(1);
  const [tipo, setTipo] = useState("");
  const [endereco, setEndereco] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [localizandoGps, setLocalizandoGps] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [especie, setEspecie] = useState("unknown");
  const [condicao, setCondicao] = useState("unknown");
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
    } catch {
      // silencioso, usuário pode digitar o endereço
    } finally {
      setLocalizandoGps(false);
    }
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
      Alert.alert("Permissão necessária", "Permita o acesso à câmera nas configurações.");
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
      await api.post("/denunciations", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Alert.alert("Denúncia enviada!", "Obrigado por ajudar um animal.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert("Erro", "Não foi possível enviar a denúncia. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  const tipoSelecionado = TIPOS_DENUNCIA.find((t) => t.value === tipo);

  // ─── ETAPA 1: Seleção de tipo ───────────────────────────────────────────────
  if (etapa === 1) {
    return (
      <View style={[s.flex, { backgroundColor: PRIMARY }]}>
        <View style={[s.headerEtapa1, { paddingTop: insets.top + 16 }]}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
            <ArrowLeft size={22} color="#fff" strokeWidth={2} />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Denúncia</Text>
          <Text style={s.headerSub}>Qual situação você quer reportar?</Text>
        </View>

        <View style={s.cardContainer}>
          <ScrollView contentContainerStyle={s.tiposGrid} showsVerticalScrollIndicator={false}>
            {TIPOS_DENUNCIA.map((opcao) => {
              const Icon = opcao.icon;
              const ativo = tipo === opcao.value;
              return (
                <TouchableOpacity
                  key={opcao.value}
                  style={[s.tipoCard, ativo && s.tipoCardAtivo]}
                  onPress={() => setTipo(opcao.value)}
                  activeOpacity={0.75}
                >
                  <View style={[s.tipoIconCircle, ativo && s.tipoIconCircleAtivo]}>
                    <Icon size={22} color={ativo ? "#fff" : PRIMARY} strokeWidth={1.8} />
                  </View>
                  <Text style={[s.tipoLabel, ativo && s.tipoLabelAtivo]}>{opcao.label}</Text>
                  <Text style={[s.tipoDesc, ativo && s.tipoDescAtivo]} numberOfLines={2}>
                    {opcao.desc}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={[s.footerEtapa1, { paddingBottom: insets.bottom + 16 }]}>
            <TouchableOpacity
              style={[s.btnAvancar, !tipo && s.btnDesabilitado]}
              disabled={!tipo}
              onPress={() => setEtapa(2)}
              activeOpacity={0.85}
            >
              <Text style={s.btnAvancarTexto}>Continuar</Text>
              <ChevronRight size={18} color="#fff" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // ─── ETAPA 2: Formulário ─────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      {/* Header */}
      <View style={[s.header2, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => setEtapa(1)} style={s.backBtn}>
          <ArrowLeft size={22} color="#fff" strokeWidth={2} />
        </TouchableOpacity>
        <View style={s.headerTexto}>
          <Text style={s.headerTitle}>Denúncia</Text>
          <Text style={s.headerSub2}>{tipoSelecionado?.label}</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={s.flex}
        contentContainerStyle={s.formContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Localização */}
        <View style={s.secao}>
          <Text style={s.secaoTitulo}>Localização</Text>
          <View style={s.localizacaoBox}>
            <MapPin size={16} color={PRIMARY} style={{ marginTop: 2 }} />
            <View style={s.localizacaoTextos}>
              {localizandoGps ? (
                <View style={s.gpsRow}>
                  <ActivityIndicator size="small" color={PRIMARY} />
                  <Text style={s.gpsTexto}>Obtendo localização...</Text>
                </View>
              ) : latitude ? (
                <Text style={s.enderecoTexto} numberOfLines={2}>
                  {endereco || `${latitude.toFixed(5)}, ${longitude?.toFixed(5)}`}
                </Text>
              ) : (
                <Text style={s.enderecoPlaceholder}>Localização não obtida</Text>
              )}
            </View>
            <TouchableOpacity onPress={obterLocalizacao} disabled={localizandoGps}>
              <Text style={s.reobterTexto}>Atualizar</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={s.input}
            placeholder="Complemento ou ponto de referência"
            placeholderTextColor={TEXT_MUTED}
            value={endereco}
            onChangeText={setEndereco}
          />
        </View>

        {/* Sobre o animal */}
        <View style={s.secao}>
          <Text style={s.secaoTitulo}>Sobre o animal</Text>
          <Text style={s.fieldLabel}>Espécie</Text>
          <View style={s.chipsRow}>
            {ESPECIES.map((op) => (
              <TouchableOpacity
                key={op.value}
                style={[s.chip, especie === op.value && s.chipAtivo]}
                onPress={() => setEspecie(op.value)}
              >
                <Text style={[s.chipTexto, especie === op.value && s.chipTextoAtivo]}>
                  {op.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={[s.fieldLabel, { marginTop: 16 }]}>Condição</Text>
          <View style={s.chipsRow}>
            {CONDICOES.map((op) => (
              <TouchableOpacity
                key={op.value}
                style={[s.chip, condicao === op.value && s.chipAtivo]}
                onPress={() => setCondicao(op.value)}
              >
                <Text style={[s.chipTexto, condicao === op.value && s.chipTextoAtivo]}>
                  {op.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Descrição */}
        <View style={s.secao}>
          <Text style={s.secaoTitulo}>Descrição *</Text>
          <TextInput
            style={[s.input, s.textArea]}
            placeholder="Descreva o que está acontecendo com o animal..."
            placeholderTextColor={TEXT_MUTED}
            multiline
            textAlignVertical="top"
            value={descricao}
            onChangeText={setDescricao}
          />
        </View>

        {/* Evidências */}
        <View style={s.secao}>
          <View style={s.secaoHeaderRow}>
            <Text style={s.secaoTitulo}>Evidências</Text>
            <Text style={s.contadorFotos}>{fotos.length}/6</Text>
          </View>

          {fotos.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.fotosScroll}>
              {fotos.map((foto, i) => (
                <View key={i} style={s.fotoWrapper}>
                  <Image source={{ uri: foto.uri }} style={s.fotoThumb} />
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
                <Text style={s.fotoBtnTexto}>Galeria</Text>
              </TouchableOpacity>
              <View style={s.fotoBtnDivisor} />
              <TouchableOpacity style={s.fotoBtn} onPress={tirarFoto}>
                <Camera size={20} color={PRIMARY} />
                <Text style={s.fotoBtnTexto}>Câmera</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={[s.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={[s.btnEnviar, carregando && s.btnDesabilitado]}
          onPress={enviar}
          disabled={carregando}
          activeOpacity={0.85}
        >
          {carregando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={s.btnEnviarTexto}>Enviar denúncia</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const CARD_W = (width - 48 - 12) / 2;

const s = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#fff" },

  // Etapa 1
  headerEtapa1: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 24,
    paddingBottom: 28,
  },
  backBtn: { marginBottom: 16, alignSelf: "flex-start" },
  headerTitle: { color: "#fff", fontSize: 26, fontWeight: "700", letterSpacing: -0.5 },
  headerSub: { color: "rgba(255,255,255,0.75)", fontSize: 14, marginTop: 4 },

  cardContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -16,
    overflow: "hidden",
  },
  tiposGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    padding: 20,
    paddingBottom: 8,
  },
  tipoCard: {
    width: CARD_W,
    backgroundColor: GRAY_BG,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: "transparent",
  },
  tipoCardAtivo: {
    borderColor: PRIMARY,
    backgroundColor: PRIMARY_LIGHT,
  },
  tipoIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: PRIMARY_LIGHT,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  tipoIconCircleAtivo: { backgroundColor: PRIMARY },
  tipoLabel: { fontSize: 15, fontWeight: "600", color: TEXT_DARK, marginBottom: 4 },
  tipoLabelAtivo: { color: PRIMARY },
  tipoDesc: { fontSize: 12, color: TEXT_MUTED, lineHeight: 16 },
  tipoDescAtivo: { color: "#c04040" },

  footerEtapa1: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: GRAY_BORDER,
    backgroundColor: "#fff",
  },
  btnAvancar: {
    backgroundColor: PRIMARY,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  btnAvancarTexto: { color: "#fff", fontSize: 16, fontWeight: "600" },

  // Etapa 2
  header2: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerTexto: { flex: 1 },
  headerSub2: { color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 2 },

  formContent: { padding: 20, paddingBottom: 32 },
  secao: { marginBottom: 28 },
  secaoTitulo: { fontSize: 15, fontWeight: "700", color: TEXT_DARK, marginBottom: 12 },
  secaoHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  contadorFotos: { fontSize: 13, color: TEXT_MUTED },
  fieldLabel: { fontSize: 13, fontWeight: "500", color: TEXT_MUTED, marginBottom: 8 },

  localizacaoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: PRIMARY_LIGHT,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    gap: 10,
  },
  localizacaoTextos: { flex: 1 },
  gpsRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  gpsTexto: { color: TEXT_MUTED, fontSize: 13 },
  enderecoTexto: { fontSize: 13, color: TEXT_DARK, lineHeight: 18 },
  enderecoPlaceholder: { fontSize: 13, color: TEXT_MUTED },
  reobterTexto: { fontSize: 12, color: PRIMARY, fontWeight: "600" },

  input: {
    backgroundColor: GRAY_BG,
    borderWidth: 1,
    borderColor: GRAY_BORDER,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: TEXT_DARK,
  },
  textArea: { minHeight: 120, textAlignVertical: "top" },

  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: GRAY_BG,
    borderWidth: 1.5,
    borderColor: GRAY_BORDER,
  },
  chipAtivo: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  chipTexto: { fontSize: 13, color: TEXT_MUTED, fontWeight: "500" },
  chipTextoAtivo: { color: "#fff" },

  fotosScroll: { marginBottom: 12 },
  fotoWrapper: { marginRight: 10, position: "relative" },
  fotoThumb: { width: 88, height: 88, borderRadius: 12 },
  fotoRemove: {
    position: "absolute", top: 5, right: 5,
    backgroundColor: PRIMARY, borderRadius: 10,
    width: 20, height: 20,
    alignItems: "center", justifyContent: "center",
  },
  fotoBtns: {
    flexDirection: "row",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: GRAY_BORDER,
    overflow: "hidden",
    backgroundColor: GRAY_BG,
  },
  fotoBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 8,
  },
  fotoBtnDivisor: { width: 1, backgroundColor: GRAY_BORDER },
  fotoBtnTexto: { fontSize: 14, color: PRIMARY, fontWeight: "500" },

  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: GRAY_BORDER,
    backgroundColor: "#fff",
  },
  btnEnviar: {
    backgroundColor: PRIMARY,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  btnDesabilitado: { opacity: 0.55 },
  btnEnviarTexto: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
