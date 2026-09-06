import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NAVIGATION } from '@/navigation/constants';

export type TabParamList = {
  [NAVIGATION.RESULTS]: undefined;
  [NAVIGATION.PRACTICE]: undefined;
  [NAVIGATION.ANALYTICS]: undefined;
};

export type RootStackParamList = {
  [NAVIGATION.MAIN_TABS]: NavigatorScreenParams<TabParamList> | undefined;
  [NAVIGATION.RESULTS]: undefined;
  [NAVIGATION.PRACTICE]: undefined;
  [NAVIGATION.ANALYTICS]: undefined;
};

declare global {
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootStackParamList {}
  }
}