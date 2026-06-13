import { Search } from "lucide-react-native";
import {
    Image,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MenuTop() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <Image
        source={require("@/assets/images/logo-sos.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.searchBar}>
        <Search size={20} color="#9CA3AF" strokeWidth={2} />
        <TextInput
          placeholder="Buscar"
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
        />
      </View>

      <TouchableOpacity>
        <Image
          source={require("@/assets/icons/notification.png")}
          style={styles.icon}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    height: "20%",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 14,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  logo: {
    width: 50,
    height: 50,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 999,
    paddingHorizontal: 16,
    height: 50,
    width: 60,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#1F2937",
    padding: 0,
  },
  icon: {
    width: 24,
    height: 24,
  },
});
