import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MenuTopOuther() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <Image
        source={require("@/assets/images/logo-sos.png")}
        style={styles.logo}
        resizeMode="contain"
      />

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
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingBottom: 24,
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
  icon: {
    width: 24,
    height: 24,
  },
});
