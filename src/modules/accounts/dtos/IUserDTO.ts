interface ICreateUserDTO {
  name: string;
  email: string;
  driverLicense: string;
  password: string;
}

interface IListUserDTO {
  id: string;
  name: string;
  email: string;
  avatar: string;
  avatarUrl(): string;
  driverLicense: string;
  isAdmin: boolean;
}

export { ICreateUserDTO, IListUserDTO };
