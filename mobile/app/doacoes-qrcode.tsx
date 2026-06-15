import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";

import * as Clipboard from "expo-clipboard";

import MenuTopOuther from "@/components/menu-top-outher";
import MenuBotton from "@/components/menu-botton";

export default function DoacoesQRCode() {
  const codigoPix =
    "00020126580014BR.GOV.BCB.PIX0136sospatinhas@pix.com520400005303986";

  async function copiarCodigo() {
    await Clipboard.setStringAsync(codigoPix);

    Alert.alert(
      "Código copiado",
      "O código PIX foi copiado para a área de transferência."
    );
  }

  return (
    <View style={styles.container}>
      <MenuTopOuther />

      <View style={styles.content}>
        <View style={styles.qrContainer}>
          <Image
            source={require("@/assets/images/qrcode.png")}
            style={styles.qrCode}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>
          Copie o código
        </Text>

        <View style={styles.line} />

        <TouchableOpacity
          style={styles.codeContainer}
          onPress={copiarCodigo}
        >
          <Text style={styles.codeText}>
            {codigoPix}
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

  qrContainer: {
    width: "100%",
    backgroundColor: "#F54E50",
    borderRadius: 30,
    paddingVertical: 30,
    alignItems: "center",
  },

  qrCode: {
    width: 220,
    height: 220,
    backgroundColor: "#FFF",
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

  codeContainer: {
    width: "100%",
    backgroundColor: "#F54E50",
    borderRadius: 12,
    padding: 15,
  },

  codeText: {
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
  },
});