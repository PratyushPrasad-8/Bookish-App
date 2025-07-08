import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import COLORS from "../../constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarLabelPosition: "beside-icon",
        tabBarLabelStyle: { fontSize: 13, fontWeight: "700" },
        tabBarStyle: { backgroundColor: COLORS.cardBackground,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          paddingTop: 1,
          paddingBottom: insets.bottom,
          height: 55 + insets.bottom
         },
        headerTitleStyle: { color: COLORS.textPrimary, fontWeight: "700" },
        headerShadowVisible: false,
      }}
    >
        <Tabs.Screen name="index" options={{tabBarLabel: 'Home',
            tabBarIcon:(color, size=24)=>(<Ionicons name="home-outline" size={size} color={"gray"}/>)
          }}/>
        <Tabs.Screen name="create" options={{tabBarLabel: 'Create',
            tabBarIcon:(color, size=24)=>(<Ionicons name="create-outline" size={size} color="gray"/>)
        }}/>
        <Tabs.Screen name="profile" options={{tabBarLabel: 'Profile',
            tabBarIcon:(color, size=24)=>(<Ionicons name="person-outline" size={size} color="gray"/>)
        }}/>
    </Tabs>
  )
}