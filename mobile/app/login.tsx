import CriarConta from "@/components/login/botao-criar";
import Card from "@/components/login/card";
import { Image, StyleSheet, View } from "react-native";
import Logo from "@/assets/svgs/Logo_SOSPatinhas.svg";

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Image
        style={styles.textura}
        source={require("@/assets/images/textura-login.png")}
      />
      <CriarConta />
      <Logo width={240} height={240} />
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