import { Redirect } from 'expo-router';

export default function Index() {
  console.log('[Index] Redirecting to /home');
  return <Redirect href="/(tabs)/home" />;
}
