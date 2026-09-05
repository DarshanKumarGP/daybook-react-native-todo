export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppStackParamList = {
  TaskList: undefined;
  TaskEditor: { taskId?: string } | undefined;
};
