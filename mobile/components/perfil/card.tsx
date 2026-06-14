import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Card() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.card}>
      <ScrollView
        contentContainerStyle={styles.cardContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Meus Dados</Text>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Nome</Text>
          <Text style={styles.fieldValue}>Angelina Jolie Voight</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Email</Text>
          <Text style={styles.fieldValue}>Angelina.Jolie@gmail.com</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Telefone</Text>
          <Text style={styles.fieldValue}>(88) 9****-****</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Senha</Text>
          <Text style={styles.fieldValue}>············</Text>
        </View>
      </ScrollView>

      {/* Footer fixo igual ao criar-post */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>Alterar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  cardContent: {
    padding: 24,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 20,
  },
  field: {
    paddingVertical: 10,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 14,
    color: "#6B7280",
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
  },
  footer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  saveBtn: {
    backgroundColor: "#F54E50",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});