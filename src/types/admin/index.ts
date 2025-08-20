export type TAdmin = {
  _id: string;
  user: {
    _id: string;
    email: string;
    needsPasswordChange: boolean;
    role: "admin";
    status: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  name: {
    firstName: string;
    lastName: string;
    _id: string;
  };
  email: string;
  profileImg: string;
  isDeleted: boolean;
  fullName: string;
  id: string;
};
