import {
  createNavigationContainerRef,
  CommonActions,
  type NavigationState,
  type PartialState,
} from '@react-navigation/native';
import { NAVIGATION } from '@/navigation/constants';
import type { RootStackParamList } from '@/navigation/types';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

const TAB_SCREENS: readonly string[] = [
  NAVIGATION.RESULTS,
  NAVIGATION.PRACTICE,
  NAVIGATION.ANALYTICS,
];

export function navigate<RouteName extends keyof RootStackParamList>(
  name: RouteName,
  params?: RootStackParamList[RouteName],
): void {
  if (navigationRef.isReady()) {
    if (TAB_SCREENS.includes(name as string)) {
      navigationRef.navigate(name as any, params as any);
    } else {
      navigationRef.navigate(name as any, params as any);
    }
  }
}

export function goBack(): void {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}

export function resetRoot(state: PartialState<NavigationState> | NavigationState): void {
  if (navigationRef.isReady()) {
    navigationRef.resetRoot(state);
  }
}