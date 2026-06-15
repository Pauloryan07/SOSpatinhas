import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

import MenuTopOuther from "@/components/menu-top-outher";
import MenuBotton from "@/components/menu-botton";

export default function DoacoesPix() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <MenuTopOuther />

      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image
            source={require("@/assets/images/cat-doacoes.png")}
            style={styles.catImage}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Doe com dinheiro</Text>

        <View style={styles.line} />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>
            000-000-000-00
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
    backgroundColor: "#ECECEC",
  },

  content: {
    flex: 1,
    paddingTop: 140,
    paddingHorizontal: 20,
    alignItems: "center",
  },

  imageContainer: {
    width: "100%",
    backgroundColor: "#F54E50",
    borderRadius: 30,
    alignItems: "center",
    paddingVertical: 20,
  },

  catImage: {
    width: 250,
    height: 250,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
  },

  line: {
    width: 90,
    height: 2,
    backgroundColor: "#F54E50",
    marginVertical: 10,
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