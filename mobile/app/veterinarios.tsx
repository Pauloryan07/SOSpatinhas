import { 
  ArrowLeft, 
  Syringe, 
  Bath, 
  Utensils, 
  PawPrint, 
  Stethoscope, 
  Search, 
  HeartPulse, 
  Scissors, 
  Home, 
  ShieldCheck,
  Activity
} from "lucide-react-native";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import React from "react";

import MenuTopOuther from "@/components/menu-top-outher";
import MenuButtom from "@/components/menu-botton";

type Tip = {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
};

const DICAS: Tip[] = [
  {
    id: 1,
    title: "Vacinação regular",
    description: "Mantenha a carteirinha de vacinação do seu pet sempre em dia! Vacinas previnem doenças graves como raiva, parvovirose, cinomose e leptospirose.",
    icon: Syringe,
  },
  {
    id: 2,
    title: "Higiene e banho",
    description: "Dê banhos no seu pet regularmente, mas não excessivamente! Use produtos específicos para a espécie e evite banhos muito frequentes que podem ressecar a pele e pelos.",
    icon: Bath,
  },
  {
    id: 3,
    title: "Alimentação balanceada",
    description: "Ofereça ração de qualidade adequada à idade, tamanho e necessidades do seu animal. Evite dar alimentos humanos como chocolate, uva, cebola e alho, que são tóxicos para pets!",
    icon: Utensils,
  },
  {
    id: 4,
    title: "Exercícios diários",
    description: "Cães precisam de caminhadas e brincadeiras diárias. Gatos também precisam de atividades com brinquedos para se manterem saudáveis, evitar obesidade e estresse.",
    icon: PawPrint,
  },
  {
    id: 5,
    title: "Consultas veterinárias periódicas",
    description: "Leve seu pet para consultas pelo menos uma vez por ano, mesmo que ele pareça saudável. Prevenção é sempre melhor que o tratamento! Para animais idosos, a cada 6 meses.",
    icon: Stethoscope,
  },
  {
    id: 6,
    title: "Cuidado com pulgas e carrapatos",
    description: "Use produtos preventivos regularmente. Pulgas e carrapatos podem transmitir doenças graves como babesiosi, erliquiose e febre maculosa.",
    icon: Search,
  },
  {
    id: 7,
    title: "Castração",
    description: "Castre seu pet! Além de evitar ninhadas indesejadas, previne doenças como câncer de útero, mama e próstata, e reduz comportamento de fuga.",
    icon: HeartPulse,
  },
  {
    id: 8,
    title: "Higiene bucal",
    description: "Escove os dentes do seu pet regularmente com pastas específicas! Problemas bucais podem causar dor, perda de dentes e até doenças em órgãos como rim e coração.",
    icon: Scissors,
  },
  {
    id: 9,
    title: "Ambiente seguro",
    description: "Mantenha seu ambiente seguro! Coloque telas em janelas, guarde produtos de limpeza e medicamentos fora do alcance, e evite plantas tóxicas como comigo-ninguém-pode.",
    icon: Home,
  },
  {
    id: 10,
    title: "Identificação",
    description: "Coloque uma coleira com identificação no seu pet e, se possível, microchip! Isso aumenta muito as chances de encontrar seu amigo se ele se perder.",
    icon: ShieldCheck,
  },
  {
    id: 11,
    title: "Atenção aos sinais",
    description: "Fique atento a sinais de doença: falta de apetite, apatia, vômitos, diarreia, dificuldade para respirar ou andar. Procure um veterinário imediatamente!",
    icon: Activity,
  },
];

export default function VeterinariosScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  function renderItem({ item }: { item: Tip }) {
    const Icon = item.icon;
    return (
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Icon size={32} color="#F54E50" strokeWidth={2} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MenuTopOuther />

      <View style={[styles.header, { paddingTop: insets.top + 100 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#F54E50" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dicas de Veterinários</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <FlatList
          data={DICAS}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <MenuButtom />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listContent: {
    gap: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    gap: 16,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(245, 78, 80, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
});
