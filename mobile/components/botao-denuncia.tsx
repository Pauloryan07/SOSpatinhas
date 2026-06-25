import { Image, StyleSheet, TouchableOpacity } from "react-native";

interface Props {
  onPress: () => void;
}

export default function BotaoDenuncia({ onPress }: Props) {
  return (
    <TouchableOpacity 
      style={styles.button}
      onPress={onPress}
    >
      <Image
        source={require("@/assets/icons/denuncia.png")}
        style={styles.icon}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 130,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: "#F54E50",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  icon: {
    width: 30,
    height: 30,
  },
});
