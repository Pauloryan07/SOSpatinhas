import { usePathname, useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ITEMS = [
  {
    key: "veterinarios",
    label: "Veterinários",
    icon: require("@/assets/icons/veterinarios.png"),
    route: "/veterinarios",
    size: 24,
  },
  {
    key: "doacoes",
    label: "Doações",
    icon: require("@/assets/icons/doacoes.png"),
    route: "/doacoes",
    size: 24,
  },
  {
    key: "home",
    label: "Home",
    icon: require("@/assets/icons/home.png"),
    route: "/home",
    size: 30,
  },
  {
    key: "chat",
    label: "Chat",
    icon: require("@/assets/icons/chat.png"),
    route: "/chat",
    size: 24,
  },
  {
    key: "perfil",
    label: "Perfil",
    icon: require("@/assets/icons/perfil.png"),
    route: "/perfil",
    size: 24,
  },
] as const;

export default function MenuBotton() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 10 }]}>
      {ITEMS.map((item) => {
        const isActive = pathname === item.route;

        return (
          <TouchableOpacity
            key={item.key}
            style={styles.item}
            onPress={() => router.push(item.route as any)}
          >
            <Image
              source={item.icon}
              style={[
                { width: item.size, height: item.size },
                { opacity: isActive ? 1 : 0.85 },
              ]}
              resizeMode="contain"
            />
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F54E50",
    paddingTop: 10,
    paddingHorizontal: 16,
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "500",
  },
});
