import Voltar from "@/components/cadastro-prof/back";
import Card from "@/components/cadastro-prof/card";
import { Image, StyleSheet, View } from "react-native";

export default function CadastroUserScreen() {
  return (
    <View style={styles.container}>
      <Image
        style={styles.textura}
        source={require("@/assets/images/textura-login.png")}
      />
      <Voltar />
      <Image
        style={styles.image}
        source={require("@/assets/images/Logo_SOSPatinhas.png")}
      />
      <Card />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F54E50",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    marginTop: 70,
    marginBottom: 30,
    width: 220,
    height: 60,
  },
  textura: {
    width: "100%",
    height: "40%",
    opacity: 0.5,
    resizeMode: "cover",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
});
