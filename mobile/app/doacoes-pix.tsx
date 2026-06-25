import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import * as Clipboard from "expo-clipboard";

import MenuTopOuther from "@/components/menu-top-outher";
import MenuBotton from "@/components/menu-botton";

export default function DoacoesPix() {
  const router = useRouter();
  const numeroConta = "000-000-000-00";

  async function copiarNumero() {
    await Clipboard.setStringAsync(numeroConta);

    Alert.alert(
      "Copiado!",
      `Número ${numeroConta} copiado para a área de transferência!`
    );
  }

  return (
    <View style={styles.container}>
      <MenuTopOuther />

      <View style={styles.banner}>
        <Image
          source={require("@/assets/images/textura-dinheiro.png")}
          style={styles.texture}
          resizeMode="cover"
        />
        <Image
          source={require("@/assets/images/cat-doacoes.png")}
          style={styles.catImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Doe com dinheiro</Text>
          <View style={styles.underline} />
        </View>

        <TouchableOpacity style={styles.button} onPress={copiarNumero}>
          <Text style={styles.buttonText}>
            {numeroConta}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/doacoes-qrcode")}
        >
          <Text style={styles.buttonText}>
            Gerar QR Code
          </Text>
        </TouchableOpacity>
      </View>

      <MenuBotton />
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
    opacity: 0.4,
  },

  catImage: {
    width: "110%",
    height: "110%",
    position: "absolute",
    bottom: -30,
  },

  content: {
    paddingHorizontal: 32,
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

  button: {
    width: "100%",
    backgroundColor: "#F54E50",
    borderRadius: 12,
    padding: 18,
    marginTop: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
