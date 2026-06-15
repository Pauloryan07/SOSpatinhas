import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MenuTop from "@/components/menu-top";
import MenuBottom from "@/components/menu-botton";

export default function Doacoes() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <MenuTop />

      <View style={styles.banner}>
        <Image
          source={require("@/assets/images/textura-login.png")}
          style={styles.texture}
          resizeMode="cover"
        />
        <Image
          source={require("@/assets/images/doacaoimg.png")}
          style={styles.bannerImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Escolha sua doação</Text>
        <View style={styles.underline} />
      </View>

      <View style={styles.buttons}>
  
      <TouchableOpacity style={styles.button} onPress={() => router.push("/doacoes-pix")}>
        <Image
          source={require("@/assets/images/textura-dinheiro.png")}
          style={styles.buttonTexture}
          resizeMode="cover"
        />
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="cash" size={24} color="#fff" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/doacao-alimentos")}
      >
        <Image
          source={require("@/assets/images/textura-comida.png")}
          style={styles.buttonTexture}
          resizeMode="cover"
        />
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="bowl-mix" size={24} color="#fff" />
        </View>
      </TouchableOpacity>

    </View>

      <View style={{ flex: 1 }} />
      <MenuBottom />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  banner: {
    backgroundColor: "#F54E50",
    height: 320,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 120,
  },
  texture: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.9,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    bottom: -20,
  },
  titleContainer: {
    alignItems: "center",
    marginTop: 28,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#111",
  },
  underline: {
    width: 80,
    height: 4,
    backgroundColor: "#F54E50",
    borderRadius: 2,
    marginTop: 6,
  },
  buttons: {
    paddingHorizontal: 32,
    gap: 14,
  },
  button: {
    backgroundColor: "#F54E50",
    borderRadius: 14,
    paddingVertical: 8,
    alignItems: "center",
    overflow: "hidden",  
  },
  buttonTexture: {
    position: "absolute",
    width: "120%",
    height: "100%",
    opacity: 0.9,  
    margin:10,     
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#C63F41",
    alignItems: "center",
    justifyContent: "center",
  },
});