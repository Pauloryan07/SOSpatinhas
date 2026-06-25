import { useRouter } from "expo-router";
import { ArrowLeft, Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
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

const ESPECIE_LABELS: Record<string, string> = {
  dog: "Cachorro",
  cat: "Gato",
  bird: "Ave",
  other: "Outro",
  unknown: "Desconhecido",
};

export default function DenunciasScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarDenuncias();
  }, []);

  async function carregarDenuncias() {
    try {
      const response = await api.get("/denunciations");
      setDenuncias(response.data.data || response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setCarregando(false);
    }
  }

  function renderItem({ item }: { item: Denuncia }) {
    const foto = item.evidences?.[0]?.photo_path 
      ? `${process.env.EXPO_PUBLIC_API_URL}/storage/${item.evidences[0].photo_path}` 
      : null;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View>
              <Text style={styles.userName}>{item.user.name}</Text>
              <Text style={styles.tipoLabel}>
                {TIPO_LABELS[item.type] || item.type}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.descricao}>{item.description}</Text>

        {foto && (
          <Image
            source={{ uri: foto }}
            style={styles.foto}
            resizeMode="cover"
          />
        )}

        <View style={styles.footerCard}>
          {item.address && (
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📍</Text>
              <Text style={styles.infoText} numberOfLines={1}>
                {item.address}
              </Text>
            </View>
          )}
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>🐾</Text>
            <Text style={styles.infoText}>
              {ESPECIE_LABELS[item.animal_species] || item.animal_species}
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
            <ArrowLeft size={22} color="#FFF" strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Denúncias</Text>
          <TouchableOpacity onPress={() => router.push('/criar-denuncia')} style={styles.novaDenunciaBtn}>
            <Plus size={20} color="#F54E50" strokeWidth={2.5} />
          </TouchableOpacity>
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
  novaDenunciaBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "#FFF",
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
  tipoLabel: {
    fontSize: 13,
    color: "#F54E50",
    fontWeight: "500",
  },
  descricao: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
    marginBottom: 12,
  },
  foto: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  footerCard: {
    flexDirection: "row",
    gap: 16,
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
