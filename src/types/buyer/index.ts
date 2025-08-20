export type TBuyer = {
  _id: string;
  user: {
    _id: string;
    email: string;
    needsPasswordChange: boolean;
    role: string;
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
  address: string;
  profileImg: string;
  isDeleted: boolean;
  fullName: string;
  id: string;
};
