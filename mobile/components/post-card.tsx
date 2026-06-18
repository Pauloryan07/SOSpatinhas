import { Bookmark, Heart, MessageCircle, Share2, User } from "lucide-react-native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface PostUser {
  id: number;
  name: string;
  email?: string;
  avatar?: string | null;
}

export interface PostData {
  id: number;
  text: string;
  image_path?: string | null;
  image_url?: string | null;
  publish_date: string;
  created_at: string;
  user: PostUser;
  likes_count?: number;
  comments_count?: number;
}

interface Props {
  post: PostData;
  onLike?: (post: PostData) => void;
  onComment?: (post: PostData) => void;
  onShare?: (post: PostData) => void;
  onSave?: (post: PostData) => void;
}

// TODO: ajuste essa função se as imagens vierem de outro storage/CDN.
// O ideal é o backend já devolver um campo "image_url" pronto (accessor no model Post),
// daí essa função nem precisa existir.
function resolverUrlImagem(post: PostData) {
  if (post.image_url) return post.image_url;
  if (!post.image_path) return null;
  const apiBase = process.env.EXPO_PUBLIC_API_URL ?? "";
  const origem = apiBase.replace(/\/api\/?$/, "");
  return `${origem}/storage/${post.image_path}`;
}

function tempoRelativo(data: string) {
  const diffMs = Date.now() - new Date(data).getTime();
  const minutos = Math.floor(diffMs / 60000);
  if (minutos < 1) return "agora";
  if (minutos < 60) return `há ${minutos} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `há ${horas}h`;
  const dias = Math.floor(horas / 24);
  if (dias < 7) return `há ${dias}d`;
  return new Date(data).toLocaleDateString("pt-BR");
}

export default function PostCard({ post, onLike, onComment, onShare, onSave }: Props) {
  const imagemUrl = resolverUrlImagem(post);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatarWrapper}>
          {post.user?.avatar ? (
            <Image source={{ uri: post.user.avatar }} style={styles.avatarImg} />
          ) : (
            <User size={20} color="#F54E50" strokeWidth={2} />
          )}
        </View>
        <View>
          <Text style={styles.nome}>{post.user?.name ?? "Usuário"}</Text>
          <Text style={styles.data}>
            Publicado {tempoRelativo(post.publish_date || post.created_at)}
          </Text>
        </View>
      </View>

      {!!post.text && <Text style={styles.texto}>{post.text}</Text>}

      {imagemUrl && (
        <Image source={{ uri: imagemUrl }} style={styles.imagemPost} resizeMode="cover" />
      )}

      <View style={styles.footer}>
        <View style={styles.footerGrupo}>
          <TouchableOpacity style={styles.acao} onPress={() => onLike?.(post)}>
            <Heart size={18} color="#555" strokeWidth={1.8} />
            <Text style={styles.acaoTexto}>{post.likes_count ?? 0}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.acao} onPress={() => onComment?.(post)}>
            <MessageCircle size={18} color="#555" strokeWidth={1.8} />
            <Text style={styles.acaoTexto}>{post.comments_count ?? 0}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footerGrupo}>
          <TouchableOpacity onPress={() => onShare?.(post)}>
            <Share2 size={18} color="#555" strokeWidth={1.8} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onSave?.(post)}>
            <Bookmark size={18} color="#555" strokeWidth={1.8} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  header: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  avatarWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(245,78,80,0.15)",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarImg: { width: 38, height: 38 },
  nome: { fontSize: 14, fontWeight: "600", color: "#222" },
  data: { fontSize: 11, color: "#aaa", marginTop: 1 },
  texto: { fontSize: 13.5, color: "#555", lineHeight: 20, marginBottom: 12 },
  imagemPost: { width: "100%", height: 180, borderRadius: 12, marginBottom: 12 },
  footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  footerGrupo: { flexDirection: "row", alignItems: "center", gap: 18 },
  acao: { flexDirection: "row", alignItems: "center", gap: 5 },
  acaoTexto: { fontSize: 12.5, color: "#777" },
});