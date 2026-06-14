import { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MenuTop from "@/components/menu-top";
import MenuBottom from "@/components/menu-botton";


const ENDERECOS = [
  "Rua das Flores, 123 - Centro",
  "Av. Beira Mar, 456 - Meireles",
  "Rua Abolição, 789 - Benfica",
  "Av. Washington Soares, 321 - Edson Queiroz",
];

const ALIMENTOS = [
  "Ração seca para cães",
  "Ração seca para gatos",
  "Ração úmida para cães",
  "Ração úmida para gatos",
  "Petisco para cães",
  "Petisco para gatos",
];

export default function DoacoesAlimentos() {
  const router = useRouter();
  const [enderecoAberto, setEnderecoAberto] = useState(false);
  const [alimentoAberto, setAlimentoAberto] = useState(false);
  const [enderecoSelecionado, setEnderecoSelecionado] = useState("");
  const [alimentoSelecionado, setAlimentoSelecionado] = useState("");

return (
    <View style={styles.container}>
      <MenuTop />

      <ScrollView 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
    >

        <View style={styles.banner}>
          <Image
            source={require("@/assets/images/textura-login.png")}
            style={styles.texture}
            resizeMode="cover"
          />
          <Image
            source={require("@/assets/images/cachorros-alim.png")}
            style={styles.bannerImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Doe com alimentos</Text>
          <View style={styles.underline} />
        </View>

        <View style={styles.buttons}>
          {/* SELECT ENDEREÇO */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setEnderecoAberto(!enderecoAberto);
              setAlimentoAberto(false);
            }}
          >
            <Text style={styles.buttonText}>
              {enderecoSelecionado || "Local de entrega"}
            </Text>
            <MaterialCommunityIcons
              name={enderecoAberto ? "chevron-up" : "chevron-down"}
              size={20}
              color="#fff"
            />
          </TouchableOpacity>

          {enderecoAberto && (
            <View style={styles.dropdown}>
              {ENDERECOS.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setEnderecoSelecionado(item);
                    setEnderecoAberto(false);
                  }}
                >
                  <Text style={styles.dropdownText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* SELECT ALIMENTO */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setAlimentoAberto(!alimentoAberto);
              setEnderecoAberto(false);
            }}
          >
            <Text style={styles.buttonText}>
              {alimentoSelecionado || "O que vai doar"}
            </Text>
            <MaterialCommunityIcons
              name={alimentoAberto ? "chevron-up" : "chevron-down"}
              size={20}
              color="#fff"
            />
          </TouchableOpacity>

          {alimentoAberto && (
            <View style={styles.dropdown}>
              {ALIMENTOS.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setAlimentoSelecionado(item);
                    setAlimentoAberto(false);
                  }}
                >
                  <Text style={styles.dropdownText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />

      </ScrollView>

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
  bannerImage: {
    width: "80%",
    height: "80%",
    position: "absolute",
    bottom: -20,
  },
  texture: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.9,
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
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F54E50",
    overflow: "hidden",
    marginTop: -8,
  },
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownText: {
    fontSize: 15,
    color: "#333",
  },
});