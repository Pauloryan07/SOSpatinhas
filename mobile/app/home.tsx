import { StyleSheet, Text, View } from "react-native";
import MenuButtom from "../components/menu-botton";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>HomeScreen</Text>
      <MenuButtom />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
});
