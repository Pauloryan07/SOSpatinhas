import { Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import api from "@/services/api";

import BotaoDenuncia from "@/components/botao-denuncia";
import CriarPostModal from "@/components/criar-post";
import MenuButtom from "@/components/menu-botton";
import MenuTop from "@/components/menu-top";
import PostCard, { PostData } from "@/components/post-card";

type Aba = "populares" | "minhas" | "seguindo";

const ABAS: { key: Aba; label: string }[] = [
  { key: "populares", label: "Populares" },
  { key: "minhas", label: "Minhas postagens" },
  { key: "seguindo", label: "Seguindo" },
];

export default function HomeScreen() {
  const [aba, setAba] = useState<Aba>("populares");
  const [posts, setPosts] = useState<PostData[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [usuarioId, setUsuarioId] = useState<number | null>(null);

  async function carregarPosts() {
    try {
      const resposta = await api.get("/posts");
      // o PostController usa paginate(), então os itens vêm em resposta.data.data
      setPosts(resposta.data.data ?? resposta.data);
    } catch (erro) {
      console.error("Erro ao carregar posts:", erro);
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }

  async function carregarUsuarioAtual() {
    try {
      const resposta = await api.get("/user/profile");
      setUsuarioId(resposta.data.id);
    } catch {
      // sem o id ainda dá pra usar o app, só a aba "Minhas postagens" fica vazia
    }
  }

  useEffect(() => {
    carregarPosts();
    carregarUsuarioAtual();
  }, []);

  function aoAtualizar() {
    setAtualizando(true);
    carregarPosts();
  }

  function aoCriarPost(novoPost: PostData) {
    setPosts((atual) => [novoPost, ...atual]);
    setModalVisivel(false);
  }

  const postsFiltrados =
    aba === "minhas"
      ? posts.filter((p) => p.user?.id === usuarioId)
      : aba === "seguindo"
        ? [] // ainda não há relação de "seguir" no backend
        : posts;

  return (
    <View style={styles.container}>
      <MenuTop />

      <View style={styles.tabsRow}>
        <View style={styles.tabsGrupo}>
          {ABAS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, aba === tab.key && styles.tabAtiva]}
              onPress={() => setAba(tab.key)}
            >
              <Text style={[styles.tabTexto, aba === tab.key && styles.tabTextoAtivo]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.botaoCriar} onPress={() => setModalVisivel(true)}>
          <Plus size={20} color="#fff" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      {carregando ? (
        <ActivityIndicator style={{ marginTop: 40 }} color="#F54E50" />
      ) : (
        <FlatList
          data={postsFiltrados}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <PostCard post={item} />}
          refreshControl={
            <RefreshControl refreshing={atualizando} onRefresh={aoAtualizar} colors={["#F54E50"]} />
          }
          ListEmptyComponent={
            <Text style={styles.vazio}>
              {aba === "seguindo"
                ? "Em breve: posts de quem você segue."
                : "Ainda não há post"}
            </Text>
          }
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 90 }}
        />
      )}

      <BotaoDenuncia />
      <MenuButtom />

      <CriarPostModal
        visible={modalVisivel}
        onClose={() => setModalVisivel(false)}
        onPostCreated={aoCriarPost}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  tabsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  tabsGrupo: { flexDirection: "row", flex: 1, gap: 4 },
  tab: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20 },
  tabAtiva: { backgroundColor: "#F54E50" },
  tabTexto: { fontSize: 12.5, color: "#999", fontWeight: "500" },
  tabTextoAtivo: { color: "#fff", fontWeight: "600" },
  botaoCriar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F54E50",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  vazio: { textAlign: "center", color: "#aaa", marginTop: 60, fontSize: 13 },
});