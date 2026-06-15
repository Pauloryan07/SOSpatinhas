import { ScrollView, StyleSheet, Text, View } from "react-native";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  telefone?: string;
}

interface Props {
  user: UserProfile | null;
}

export default function Card({ user }: Props) {
  const telefoneFormatado = user?.telefone
    ? user.telefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
    : "Não informado";

  return (
    <View style={styles.card}>
      <ScrollView contentContainerStyle={styles.cardContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Meus Dados</Text>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Nome</Text>
          <Text style={styles.fieldValue}>{user?.name ?? "—"}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Email</Text>
          <Text style={styles.fieldValue}>{user?.email ?? "—"}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Telefone</Text>
          <Text style={styles.fieldValue}>{telefoneFormatado}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Senha</Text>
          <Text style={styles.fieldValue}>············</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, backgroundColor: "#FFF", borderTopLeftRadius: 28, borderTopRightRadius: 28 },
  cardContent: { padding: 24, paddingBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#1F2937", marginBottom: 20 },
  field: { paddingVertical: 10 },
  fieldLabel: { fontSize: 13, fontWeight: "600", color: "#1F2937", marginBottom: 4 },
  fieldValue: { fontSize: 14, color: "#6B7280" },
  divider: { height: 1, backgroundColor: "#F3F4F6" },
});
