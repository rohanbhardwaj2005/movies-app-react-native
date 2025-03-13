import { Tabs } from 'expo-router';
import { Film, Search, Bookmark, TrendingUp } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1F1D2B',
          borderTopColor: '#1F1D2B',
        },
        tabBarActiveTintColor: '#E21221',
        tabBarInactiveTintColor: '#6B7280',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Movies',
          tabBarIcon: ({ size, color }) => (
            <Film size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="trending"
        options={{
          title: 'Trending',
          tabBarIcon: ({ size, color }) => (
            <TrendingUp size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ size, color }) => (
            <Search size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="watchlist"
        options={{
          title: 'Watchlist',
          tabBarIcon: ({ size, color }) => (
            <Bookmark size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}