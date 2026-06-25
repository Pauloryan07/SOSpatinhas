import { useRouter } from "expo-router";
import { ArrowLeft, FileText } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import api from "@/services/api";

type Denuncia = {
  id: number;
  type: string;
  description: string;
  address: string | null;
  latitude: string | null;
  longitude: string | null;
  animal_species: string;
  animal_condition: string;
  evidence_photo: string | null;
  evidences?: { id: number; photo_path: string }[];
  user: { id: number; name: string };
  created_at: string;
};

const TIPO_LABELS: Record<string, string> = {
  abandonment: "Abandono",
  mistreatment: "Maus tratos",
  negligence: "Negligência",
  injured: "Animal ferido",
  exploitation: "Exploração",
  other: "Outro",
};

const TIPO_CORES: Record<string, { background: string; text: string }> = {
  abandonment: { background: "#FFF3E0", text: "#E65100" },
  mistreatment: { background: "#FCE4EC", text: "#C62828" },
  negligence: { background: "#F3E5F5", text: "#6A1B9A" },
  injured: { background: "#E8F5E9", text: "#2E7D32" },
  exploitation: { background: "#FFF8E1", text: "#F57F17" },
  other: { background: "#F5F5F5", text: "#616161" },
};

const ESPECIE_LABELS: Record<string, string> = {
  dog: "Cachorro",
  cat: "Gato",
  bird: "Ave",
  other: "Outro",
  unknown: "Desconhecido",
};

const CONDICAO_LABELS: Record<string, string> = {
  alive: "Vivo",
  injured: "Ferido",
  dead: "Morto",
  unknown: "Desconhecido",
};

function formatarData(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export default function MinhasDenunciasScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);

  useEffect(() => {
    carregarDenuncias();
  }, []);

  async function carregarDenuncias() {
    try {
      const response = await api.get("/my-denunciations");
      setDenuncias(response.data.data || response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }

  function aoAtualizar() {
    setAtualizando(true);
    carregarDenuncias();
  }

  function renderItem({ item }: { item: Denuncia }) {
    const evidencias = item.evidences || [];
    const temEvidencias = evidencias.length > 0;
    const cores = TIPO_CORES[item.type] || TIPO_CORES.other;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{item.user.name}</Text>
              <View style={[styles.badgeTipo, { backgroundColor: cores.background }]}>
                <Text style={[styles.badgeTipoTexto, { color: cores.text }]}>
                  {TIPO_LABELS[item.type] || item.type}
                </Text>
              </View>
            </View>
            <Text style={styles.dataTexto}>{formatarData(item.created_at)}</Text>
          </View>
        </View>

        <Text style={styles.descricao}>{item.description}</Text>

        {temEvidencias && evidencias.length === 1 ? (
          <Image
            source={{ uri: `${process.env.EXPO_PUBLIC_API_URL}/storage/${evidencias[0].photo_path}` }}
            style={styles.fotoGrande}
            resizeMode="cover"
          />
        ) : null}

        {temEvidencias && evidencias.length > 1 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.galeriaHorizontal}>
            {evidencias.map((evidencia) => (
              <Image
                key={evidencia.id}
                source={{ uri: `${process.env.EXPO_PUBLIC_API_URL}/storage/${evidencia.photo_path}` }}
                style={styles.fotoPequena}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        ) : null}

        <View style={styles.footerCard}>
          {item.address && (
            <View style={[styles.infoRow, { flex: 1 }]}>
              <Text style={styles.infoIcon}>📍</Text>
              <Text style={styles.infoText} numberOfLines={1}>
                {item.address}
              </Text>
            </View>
          )}
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>🐾</Text>
            <Text style={styles.infoText}>
              {ESPECIE_LABELS[item.animal_species] || item.animal_species} • {CONDICAO_LABELS[item.animal_condition] || item.animal_condition}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={22} color="#fff" strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Minhas denúncias</Text>
          <View style={{ width: 22 }} />
        </View>
      </View>

      <View style={styles.body}>
        {carregando ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#F54E50" />
          </View>
        ) : (
          <FlatList
            data={denuncias}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={atualizando} onRefresh={aoAtualizar} colors={["#F54E50"]} />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <FileText size={48} color="#ddd" />
                <Text style={styles.emptyText}>Você ainda não fez nenhuma denúncia.</Text>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
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
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  body: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
    gap: 16,
  },
  emptyText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F54E50",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  userName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  badgeTipo: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginTop: 2,
  },
  badgeTipoTexto: {
    fontSize: 12,
    fontWeight: "600",
  },
  dataTexto: {
    fontSize: 12,
    color: "#aaa",
  },
  descricao: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
    marginBottom: 12,
  },
  fotoGrande: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  galeriaHorizontal: {
    marginBottom: 12,
  },
  fotoPequena: {
    width: 88,
    height: 88,
    borderRadius: 12,
    marginRight: 8,
  },
  footerCard: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    flexWrap: "wrap",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoIcon: {
    fontSize: 14,
  },
  infoText: {
    fontSize: 13,
    color: "#888",
    flexShrink: 1,
  },
});
