export interface UserData {
  userId: string;
  tekkenId: string;
  state: string;
}

export type ReturnedUserData = Omit<UserData, 'userId'> & { _id: string };
