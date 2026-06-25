import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View, Text } from "react-native";
import { useRouter } from "expo-router";
import Svg, { Path } from "react-native-svg";
import LogoSvg from "@/assets/svgs/logo-1.svg";

function PawPrint({
  size = 24,
  color = "#FFFFFF",
  opacity = 1,
}: {
  size?: number;
  color?: string;
  opacity?: number;
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      style={{ opacity }}
    >
      <Path
        d="M256 370c-40 0-75-15-100-42-25-27-38-62-38-100 0-25 8-48 22-68 14-20 35-36 60-44 15-5 30-8 46-8s31 3 46 8c25 8 46 24 60 44 14 20 22 43 22 68 0 38-13 73-38 100-25 27-60 42-100 42z"
        fill={color}
      />
      <Path
        d="M140 180c-22 0-40-18-40-42s18-42 40-42 40 18 40 42-18 42-40 42z"
        fill={color}
      />
      <Path
        d="M372 180c-22 0-40-18-40-42s18-42 40-42 40 18 40 42-18 42-40 42z"
        fill={color}
      />
      <Path
        d="M80 280c-22 0-40-18-40-42s18-42 40-42 40 18 40 42-18 42-40 42z"
        fill={color}
      />
      <Path
        d="M432 280c-22 0-40-18-40-42s18-42 40-42 40 18 40 42-18 42-40 42z"
        fill={color}
      />
    </Svg>
  );
}

function PawLoader() {
  const paw1Opacity = useRef(new Animated.Value(0)).current;
  const paw2Opacity = useRef(new Animated.Value(0)).current;
  const paw3Opacity = useRef(new Animated.Value(0)).current;
  const paw4Opacity = useRef(new Animated.Value(0)).current;

  const paw1Scale = useRef(new Animated.Value(0.5)).current;
  const paw2Scale = useRef(new Animated.Value(0.5)).current;
  const paw3Scale = useRef(new Animated.Value(0.5)).current;
  const paw4Scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const animatePaw = (
      opacity: Animated.Value,
      scale: Animated.Value,
      delay: number
    ) => {
      return Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 300,
            easing: Easing.out(Easing.back(2)),
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(800),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0.2,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.5,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ]);
    };

    const loop = () => {
      Animated.parallel([
        animatePaw(paw1Opacity, paw1Scale, 0),
        animatePaw(paw2Opacity, paw2Scale, 250),
        animatePaw(paw3Opacity, paw3Scale, 500),
        animatePaw(paw4Opacity, paw4Scale, 750),
      ]).start(() => {
        paw1Opacity.setValue(0);
        paw2Opacity.setValue(0);
        paw3Opacity.setValue(0);
        paw4Opacity.setValue(0);
        paw1Scale.setValue(0.5);
        paw2Scale.setValue(0.5);
        paw3Scale.setValue(0.5);
        paw4Scale.setValue(0.5);
        loop();
      });
    };

    loop();
  }, [
    paw1Opacity,
    paw1Scale,
    paw2Opacity,
    paw2Scale,
    paw3Opacity,
    paw3Scale,
    paw4Opacity,
    paw4Scale,
  ]);

  const paws = [
    {
      opacity: paw1Opacity,
      scale: paw1Scale,
      rotation: "-25deg",
      translateX: -30,
      translateY: 0,
    },
    {
      opacity: paw2Opacity,
      scale: paw2Scale,
      rotation: "15deg",
      translateX: 20,
      translateY: -20,
    },
    {
      opacity: paw3Opacity,
      scale: paw3Scale,
      rotation: "-20deg",
      translateX: -25,
      translateY: -40,
    },
    {
      opacity: paw4Opacity,
      scale: paw4Scale,
      rotation: "10deg",
      translateX: 25,
      translateY: -60,
    },
  ];

  return (
    <View style={styles.loaderContainer}>
      {paws.map((paw, index) => (
        <Animated.View
          key={index}
          style={[
            styles.pawWrapper,
            {
              opacity: paw.opacity,
              transform: [
                { translateX: paw.translateX },
                { translateY: paw.translateY },
                { scale: paw.scale },
                { rotate: paw.rotation },
              ],
            },
          ]}
        >
          <PawPrint size={32} color="rgba(255, 255, 255, 0.9)" />
        </Animated.View>
      ))}
    </View>
  );
}

export default function SplashScreen() {
  const router = useRouter();
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const loaderOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(loaderOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      router.replace("/login");
    }, 3500);

    return () => clearTimeout(timer);
  }, [loaderOpacity, logoOpacity, logoScale, router]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <LogoSvg width={220} height={174} />
      </Animated.View>

      <Animated.View
        style={[styles.loaderSection, { opacity: loaderOpacity }]}
      >
        <PawLoader />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F54E50",
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 60,
  },
  loaderSection: {
    position: "absolute",
    bottom: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  loaderContainer: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  pawWrapper: {
    position: "absolute",
  },
});