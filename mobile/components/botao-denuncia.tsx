<<<<<<< HEAD
import { Image, StyleSheet, TouchableOpacity } from "react-native";

interface Props {
  onPress: () => void;
}
=======
import { useRouter } from "expo-router";
import { Image, StyleSheet, TouchableOpacity, View, Animated, Text } from "react-native";
import { Plus, Shield, FileText } from "lucide-react-native";
import { useState, useRef } from "react";

export default function BotaoDenuncia() {
  const router = useRouter();
  const [aberto, setAberto] = useState(false);
  const translateY1 = useRef(new Animated.Value(0)).current;
  const translateY2 = useRef(new Animated.Value(0)).current;
  const opacity1 = useRef(new Animated.Value(0)).current;
  const opacity2 = useRef(new Animated.Value(0)).current;

  function toggle() {
    const novoAberto = !aberto;
    setAberto(novoAberto);

    if (novoAberto) {
      Animated.parallel([
        Animated.timing(translateY1, {
          toValue: -140,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY2, {
          toValue: -80,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity1, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity2, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY1, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY2, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity1, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity2, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }
>>>>>>> 4ee70aaf3d9647a8de6182d31a1ce5b102c33a17

export default function BotaoDenuncia({ onPress }: Props) {
  return (
<<<<<<< HEAD
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
=======
    <View style={styles.container}>
      {/* Botão "Minhas Denúncias" (mais acima) */}
      <Animated.View style={[
        styles.fabMini,
        {
          transform: [{ translateY: translateY1 }],
          opacity: opacity1,
        }
      ]}>
        <Text style={styles.fabLabel}>Minhas denúncias</Text>
        <TouchableOpacity 
          style={styles.fabMiniButton}
          onPress={() => {
            toggle();
            router.push("/minhas-denuncias");
          }}
        >
          <FileText size={20} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      {/* Botão "Denunciar" (abaixo do primeiro) */}
      <Animated.View style={[
        styles.fabMini,
        {
          transform: [{ translateY: translateY2 }],
          opacity: opacity2,
        }
      ]}>
        <Text style={styles.fabLabel}>Denunciar</Text>
        <TouchableOpacity 
          style={styles.fabMiniButton}
          onPress={() => {
            toggle();
            router.push("/criar-denuncia");
          }}
        >
          <Shield size={20} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      {/* Botão principal */}
      <TouchableOpacity 
        style={styles.button}
        onPress={toggle}
      >
        <Image
          source={require("@/assets/icons/denuncia.png")}
          style={styles.icon}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
>>>>>>> 4ee70aaf3d9647a8de6182d31a1ce5b102c33a17
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 130,
    right: 20,
    zIndex: 1000,
    alignItems: "flex-end",
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: "#F54E50",
    justifyContent: "center",
    alignItems: "center",
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
  fabMini: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  fabMiniButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#F54E50",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  fabLabel: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
