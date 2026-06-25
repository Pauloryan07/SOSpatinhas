import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { ArrowLeft, Edit, Trash2, Plus, PawPrint, MapPin, Dog, Cat, Bird, HelpCircle } from "lucide-react-native";
import { useRef, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  Image,
  Modal,
  PanResponder,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  Denunciation,
  DenunciationFormData,
  listDenunciations,
  createDenunciation,
  updateDenunciation,
  deleteDenunciation,
  getCachedDenunciations,
} from "@/services/denunciations";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const TYPE_LABELS: Record<string, string> = {
  abandonment: "Abandono",
  mistreatment: "Maus-tratos",
  negligence: "Negligência",
  injured: "Animal ferido",
  exploitation: "Exploração",
  other: "Outro",
};

const TYPE_COLORS: Record<string, string> = {
  abandonment: "#FF9F43", // Laranja
  mistreatment: "#F54E50", // Vermelho
  negligence: "#D4A017", // Amarelo escuro
  injured: "#E74C3C", // Vermelho forte
  exploitation: "#9B59B6", // Roxo
  other: "#95A5A6", // Cinza
};

const SPECIES_LABELS: Record<string, string> = {
  dog: "Cachorro",
  cat: "Gato",
  bird: "Pássaro",
  other: "Outro",
  unknown: "Desconhecido",
};

const CONDITION_LABELS: Record<string, string> = {
  unknown: "Desconhecida",
  injured: "Ferido",
  dead: "Morto",
  alive: "Vivo",
};

const SPECIES_ICONS: Record<string, any> = {
  dog: Dog,
  cat: Cat,
  bird: Bird,
  other: HelpCircle,
  unknown: HelpCircle,
};

export default function DenunciasModal({ visible, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const [editingDenunciation, setEditingDenunciation] = useState<Denunciation | null>(null);
  const [denunciations, setDenunciations] = useState<Denunciation[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [carregandoInicial, setCarregandoInicial] = useState(false);
  const [atualizando, setAtualizando] = useState(false);
  const [proximaPagina, setProximaPagina] = useState(1);
  const [temMaisPaginas, setTemMaisPaginas] = useState(true);

  // Form state
  const [type, setType] = useState("other");
  const [description, setDescription] = useState("");
  const [animalSpecies, setAnimalSpecies] = useState("unknown");
  const [animalCondition, setAnimalCondition] = useState("unknown");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [localizandoGps, setLocalizandoGps] = useState(false);
  const [fotos, setFotos] = useState<any[]>([]);
  const [enviando, setEnviando] = useState(false);

  const translateY = useRef(new Animated.Value(600)).current;

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

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 8,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120 || g.vy > 1.2) {
          closeAnim(handleClose);
        } else {
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  const handleClose = () => {
    resetForm();
    closeAnim(onClose);
  };

  const resetForm = () => {
    setType("other");
    setDescription("");
    setAnimalSpecies("unknown");
    setAnimalCondition("unknown");
    setAddress("");
    setLatitude(null);
    setLongitude(null);
    setFotos([]);
    setEditingDenunciation(null);
    setViewMode("list");
  };

  async function carregarDenuncias(page: number = 1, refresh: boolean = false) {
    if (refresh) {
      setProximaPagina(1);
      setTemMaisPaginas(true);
      if (denunciations.length === 0) {
        setDenunciations([]);
        setCarregandoInicial(true);
      }
    }
    if (!temMaisPaginas && !refresh) return;

    try {
      setCarregando(true);
      const data = await listDenunciations(page);
      const newDenunciations = data.data || data;
      setDenunciations((prev) =>
        refresh ? newDenunciations : [...prev, ...newDenunciations]
      );
      setTemMaisPaginas(!data.last_page || page < data.last_page);
      setProximaPagina(page + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setCarregando(false);
      setAtualizando(false);
      setCarregandoInicial(false);
    }
  }

  async function obterLocalizacao() {
    setLocalizandoGps(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLatitude(loc.coords.latitude);
      setLongitude(loc.coords.longitude);
      const [geocode] = await Location.reverseGeocodeAsync(loc.coords);
      if (geocode) {
        const partes = [
          geocode.street,
          geocode.streetNumber,
          geocode.district,
          geocode.city,
        ];
        setAddress(partes.filter(Boolean).join(", "));
      }
    } catch {}
    finally {
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
    if (!resultado.canceled) {
      setFotos((prev) => [...prev, ...resultado.assets]);
    }
  }

  async function tirarFoto() {
    const permissao = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert("Permissão necessária", "Permita o acesso à câmera.");
      return;
    }
    const resultado = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!resultado.canceled && fotos.length < 6) {
      setFotos((prev) => [...prev, resultado.assets[0]]);
    }
  }

  function removerFoto(index: number) {
    setFotos((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    if (!description.trim()) {
      Alert.alert("Campo obrigatório", "Descreva o incidente.");
      return;
    }
    setEnviando(true);
    try {
      const data: DenunciationFormData = {
        type,
        description,
        animal_species: animalSpecies,
        animal_condition: animalCondition,
      };
      if (address) data.address = address;
      if (latitude) data.latitude = latitude;
      if (longitude) data.longitude = longitude;

      if (editingDenunciation) {
        await updateDenunciation(editingDenunciation.id, data, fotos);
      } else {
        await createDenunciation(data, fotos);
      }
      resetForm();
      carregarDenuncias(1, true);
    } catch (err: any) {
      const message = err.response?.data?.message || "Não foi possível salvar. Tente novamente.";
      Alert.alert("Erro", message);
    } finally {
      setEnviando(false);
    }
  }

  async function handleDelete(denunciation: Denunciation) {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir esta denúncia?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDenunciation(denunciation.id);
              setDenunciations((prev) => prev.filter((d) => d.id !== denunciation.id));
            } catch {
              Alert.alert("Erro", "Não foi possível excluir.");
            }
          },
        },
      ]
    );
  }

  function handleEdit(denunciation: Denunciation) {
    setEditingDenunciation(denunciation);
    setType(denunciation.type);
    setDescription(denunciation.description);
    setAnimalSpecies(denunciation.animal_species);
    setAnimalCondition(denunciation.animal_condition);
    setAddress(denunciation.address || "");
    setLatitude(denunciation.latitude ? parseFloat(denunciation.latitude) : null);
    setLongitude(denunciation.longitude ? parseFloat(denunciation.longitude) : null);
    setFotos([]);
    setViewMode("form");
  }

  const renderItem = ({ item }: { item: Denunciation }) => {
    const primeiraFoto = item.evidences[0]?.photo_path
      ? `${process.env.EXPO_PUBLIC_API_URL}/storage/${item.evidences[0].photo_path}`
      : null;
    const data = new Date(item.created_at).toLocaleDateString("pt-BR");
    const cor = TYPE_COLORS[item.type];

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.cardTypeBadge, { backgroundColor: `${cor}15` }]}>
            <Text style={[styles.cardTypeText, { color: cor }]}>{TYPE_LABELS[item.type]}</Text>
          </View>
          <Text style={styles.cardDate}>{data}</Text>
        </View>
        <Text style={styles.cardDesc} numberOfLines={3}>
          {item.description}
        </Text>
        <View style={styles.cardRow}>
          <View style={styles.cardThumbContainer}>
            {primeiraFoto ? (
              <Image source={{ uri: primeiraFoto }} style={styles.cardThumb} />
            ) : (
              (() => {
                const SpeciesIcon = SPECIES_ICONS[item.animal_species] || HelpCircle;
                return (
                  <View style={styles.cardThumbPlaceholder}>
                    <SpeciesIcon size={28} color="#94A3B8" strokeWidth={1.5} />
                  </View>
                );
              })()
            )}
          </View>
          <View style={styles.cardMeta}>
            <View style={styles.cardMetaRow}>
              <PawPrint size={14} color="#666" />
              <Text style={styles.cardMetaText}>
                {SPECIES_LABELS[item.animal_species]} • {CONDITION_LABELS[item.animal_condition]}
              </Text>
            </View>
            {item.address && (
              <View style={styles.cardMetaRow}>
                <MapPin size={14} color="#666" />
                <Text style={styles.cardMetaText} numberOfLines={1}>
                  {item.address}
                </Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.cardActionBtn} onPress={() => handleEdit(item)}>
            <Edit size={14} color="#F54E50" />
            <Text style={styles.cardActionText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cardActionBtn} onPress={() => handleDelete(item)}>
            <Trash2 size={14} color="#F54E50" />
            <Text style={styles.cardActionText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const EmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Você ainda não registrou nenhuma denúncia.</Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onShow={() => {
        openAnim();
        const cache = getCachedDenunciations();
        if (cache) {
          const cachedItems = cache.data || cache;
          setDenunciations(cachedItems);
          setTemMaisPaginas(!cache.last_page || 1 < cache.last_page);
          setProximaPagina(2);
          setCarregandoInicial(false);
        }
        carregarDenuncias(1, true);
      }}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={handleClose} />

        <Animated.View
          style={[styles.sheet, { paddingBottom: insets.bottom + 16, transform: [{ translateY }] }]}
        >
          <View {...panResponder.panHandlers} style={styles.handleArea}>
            <View style={styles.handle} />
          </View>

          {viewMode === "list" ? (
            <>
              <View style={styles.header}>
                <TouchableOpacity onPress={handleClose}>
                  <ArrowLeft size={22} color="#333" strokeWidth={2} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Minhas Denúncias</Text>
                <TouchableOpacity onPress={() => setViewMode("form")}>
                  <Plus size={22} color="#F54E50" strokeWidth={2} />
                </TouchableOpacity>
              </View>

              {carregandoInicial ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#F54E50" />
                </View>
              ) : (
                <FlatList
                  data={denunciations}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderItem}
                  ListEmptyComponent={EmptyList}
                  contentContainerStyle={styles.listContent}
                  showsVerticalScrollIndicator={false}
                  refreshControl={
                    <RefreshControl
                      refreshing={atualizando}
                      onRefresh={() => { setAtualizando(true); carregarDenuncias(1, true); }}
                      colors={["#F54E50"]}
                    />
                  }
                  onEndReached={() => carregarDenuncias(proximaPagina)}
                  onEndReachedThreshold={0.5}
                  ListFooterComponent={
                    carregando && !atualizando ? (
                      <ActivityIndicator size="small" color="#F54E50" style={{ marginVertical: 20 }} />
                    ) : null
                  }
                />
              )}
            </>
          ) : (
            <>
              <View style={styles.header}>
                <TouchableOpacity onPress={resetForm}>
                  <ArrowLeft size={22} color="#333" strokeWidth={2} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                  {editingDenunciation ? "Editar Denúncia" : "Nova Denúncia"}
                </Text>
                <View style={{ width: 22 }} />
              </View>

              <ScrollView
                style={styles.formBody}
                contentContainerStyle={styles.formBodyContent}
                keyboardShouldPersistTaps="handled"
              >
                {(() => {
                  const renderChips = (
                    labels: Record<string, string>,
                    selected: string,
                    onSelect: (key: string) => void
                  ) => (
                    <View style={styles.chipsRow}>
                      {Object.entries(labels).map(([key, label]) => (
                      <TouchableOpacity
                        key={key}
                        style={[styles.chip, selected === key && styles.chipActive]}
                        onPress={() => onSelect(key)}
                      >
                        <Text style={[styles.chipText, selected === key && styles.chipTextActive]}>
                          {label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                    </View>
                  );

                  return (
                    <>
                      <View style={styles.formSection}>
                        <Text style={styles.formSectionTitle}>Tipo de denúncia</Text>
                        {renderChips(TYPE_LABELS, type, setType)}
                      </View>

                      <View style={styles.formSection}>
                        <Text style={styles.formSectionTitle}>Descrição *</Text>
                        <TextInput
                          style={[styles.input, styles.textArea]}
                          placeholder="Descreva o que está acontecendo..."
                          placeholderTextColor="#aaa"
                          multiline
                          textAlignVertical="top"
                          value={description}
                          onChangeText={setDescription}
                        />
                      </View>

                      <View style={styles.formSection}>
                        <Text style={styles.formSectionTitle}>Espécie do animal</Text>
                        {renderChips(SPECIES_LABELS, animalSpecies, setAnimalSpecies)}
                      </View>

                      <View style={styles.formSection}>
                        <Text style={styles.formSectionTitle}>Condição do animal</Text>
                        {renderChips(CONDITION_LABELS, animalCondition, setAnimalCondition)}
                      </View>
                    </>
                  );
                })()}

                <View style={styles.formSection}>
                  <Text style={styles.formSectionTitle}>Localização</Text>
                  <View style={styles.locationRow}>
                    <Text style={styles.locationText} numberOfLines={2}>
                      {latitude
                        ? `${address || `${latitude.toFixed(5)}, ${longitude?.toFixed(5)}`}`
                        : "Não definida"}
                    </Text>
                    <TouchableOpacity onPress={obterLocalizacao} disabled={localizandoGps}>
                      {localizandoGps ? (
                        <ActivityIndicator size="small" color="#F54E50" />
                      ) : (
                        <Text style={styles.locationBtn}>Usar minha localização</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Endereço (opcional)"
                    placeholderTextColor="#aaa"
                    value={address}
                    onChangeText={setAddress}
                  />
                </View>

                <View style={styles.formSection}>
                  <Text style={styles.formSectionTitle}>Evidências</Text>
                  {fotos.length > 0 && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.fotosRow}>
                      {fotos.map((foto, index) => (
                        <View key={index} style={styles.fotoPreview}>
                          <Image source={{ uri: foto.uri }} style={styles.fotoPreviewImg} />
                          <TouchableOpacity style={styles.fotoRemove} onPress={() => removerFoto(index)}>
                            <Text style={styles.fotoRemoveText}>✕</Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </ScrollView>
                  )}
                  {fotos.length < 6 && (
                    <View style={styles.fotoBtns}>
                      <TouchableOpacity style={styles.fotoBtn} onPress={escolherImagens}>
                        <Text style={styles.fotoBtnIcon}>🖼</Text>
                        <Text style={styles.fotoBtnText}>Galeria</Text>
                      </TouchableOpacity>
                      <View style={styles.fotoBtnDivider} />
                      <TouchableOpacity style={styles.fotoBtn} onPress={tirarFoto}>
                        <Text style={styles.fotoBtnIcon}>📷</Text>
                        <Text style={styles.fotoBtnText}>Câmera</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </ScrollView>

              <View style={styles.footer}>
                <TouchableOpacity
                  style={[styles.submitBtn, enviando && styles.submitBtnDisabled]}
                  onPress={handleSubmit}
                  disabled={enviando}
                >
                  {enviando ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.submitBtnText}>
                      {editingDenunciation ? "Salvar alterações" : "Registrar denúncia"}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
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
  listContent: { padding: 20, gap: 16 },
  emptyContainer: { alignItems: "center", justifyContent: "center", paddingVertical: 60 },
  emptyText: { fontSize: 14, color: "#aaa", textAlign: "center" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", minHeight: 200 },
  card: { 
    backgroundColor: "#fff", 
    borderRadius: 20, 
    padding: 20, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.08, 
    shadowRadius: 12, 
    elevation: 3 
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  cardTypeBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  cardTypeText: { fontSize: 12, fontWeight: "600" },
  cardDate: { fontSize: 12, color: "#aaa" },
  cardDesc: { fontSize: 14, color: "#333", lineHeight: 22, marginBottom: 16 },
  cardRow: { flexDirection: "row", gap: 14, marginBottom: 16 },
  cardThumbContainer: { width: 72, height: 72 },
  cardThumb: { width: 72, height: 72, borderRadius: 14, backgroundColor: "#f0f0f0" },
  cardThumbPlaceholder: { width: 72, height: 72, borderRadius: 14, backgroundColor: "#f8fafc", justifyContent: "center", alignItems: "center" },
  cardMeta: { flex: 1, justifyContent: "center", gap: 8 },
  cardMetaRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  cardMetaText: { fontSize: 13, color: "#666", flex: 1 },
  cardActions: { flexDirection: "row", gap: 10, justifyContent: "flex-end" },
  cardActionBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#f5f5f5", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  cardActionText: { fontSize: 13, color: "#F54E50", fontWeight: "500" },
  formBody: { flexGrow: 0 },
  formBodyContent: { padding: 20, paddingBottom: 8 },
  formSection: { marginBottom: 24 },
  formSectionTitle: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 12 },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: "#f5f5f5", borderWidth: 1, borderColor: "#f0f0f0" },
  chipActive: { backgroundColor: "#F54E50", borderColor: "#F54E50" },
  chipText: { fontSize: 13, color: "#666", fontWeight: "500" },
  chipTextActive: { color: "#fff" },
  input: { backgroundColor: "#f5f5f5", borderWidth: 1, borderColor: "#f0f0f0", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: "#333" },
  textArea: { minHeight: 120, textAlignVertical: "top" },
  locationRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, backgroundColor: "#fff5f5", padding: 12, borderRadius: 10 },
  locationText: { flex: 1, fontSize: 13, color: "#333", lineHeight: 18, marginRight: 12 },
  locationBtn: { fontSize: 12, color: "#F54E50", fontWeight: "600" },
  fotosRow: { marginBottom: 12, gap: 10, flexDirection: "row" },
  fotoPreview: { width: 80, height: 80, borderRadius: 10, position: "relative", overflow: "hidden" },
  fotoPreviewImg: { width: "100%", height: "100%" },
  fotoRemove: { position: "absolute", top: 5, right: 5, backgroundColor: "#F54E50", borderRadius: 12, width: 24, height: 24, alignItems: "center", justifyContent: "center" },
  fotoRemoveText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  fotoBtns: { flexDirection: "row", borderRadius: 12, borderWidth: 1, borderColor: "#f0f0f0", overflow: "hidden", backgroundColor: "#f5f5f5" },
  fotoBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 14, gap: 6 },
  fotoBtnIcon: { fontSize: 16 },
  fotoBtnText: { fontSize: 13, color: "#F54E50", fontWeight: "500" },
  fotoBtnDivider: { width: 1, backgroundColor: "#f0f0f0" },
  footer: { paddingHorizontal: 20, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#f0f0f0" },
  submitBtn: { backgroundColor: "#F54E50", borderRadius: 12, paddingVertical: 15, alignItems: "center" },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
