export interface UserProfile {
  id?: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  phone: string;
  email: string;
  city: string;
  gender: string;
  goal: string;
  agreedToTerms: boolean;
  photoUri?: string;
}

export type RootStackParamList = {
  Register: undefined;
  ProfileView: { userId?: number };
};