import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  AddRequest: undefined;
  RequestDetails: {
    requestId: string;
  };
  Rating: {
    proposalId: string;
  };
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
