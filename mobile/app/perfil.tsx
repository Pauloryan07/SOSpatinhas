import Card from "@/components/perfil/card";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PerfilScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={22} color="#FFF" strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Meu Perfil</Text>
          <TouchableOpacity>
            <Image
              source={require("@/assets/icons/Noti.png")}
              style={styles.icon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.avatarWrapper}>
          <Image
            source={require("@/assets/icons/Perfil-2.png")}
            style={styles.avatar}
            resizeMode="cover"
          />
        </View>

        <Text style={styles.name}>Angelina Jolie Voight</Text>
        <Text style={styles.userId}>#7852</Text>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn}>
            <Image
              source={require("@/assets/icons/Editar.png")}
              style={styles.actionIcon}
              resizeMode="contain"
            />
            <Text style={styles.actionText}>Editar perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn}>
            <Image
              source={require("@/assets/icons/Senha.png")}
              style={styles.actionIcon}
              resizeMode="contain"
            />
            <Text style={styles.actionText}>Alterar senha</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Card />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F54E50",
  },

  header: {
    backgroundColor: "#F54E50",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  headerTop: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "600",
  },
  avatarWrapper: {
    width: 110,
    height: 110,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    overflow: "hidden",
  },
  avatar: {
    width: 60,
    height: 60,
  },
  name: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 4,
  },
  userId: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
    marginBottom: 20,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  actionIcon: {
    width: 16,
    height: 16,
    opacity: 0.7,
  },
  actionText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "500",
  },
});
