export interface SignupRequest {
  email: string;
  fullName: string;
  regNo: string;
  dateOfBirth: Date;
  department: string;
  level: string;
  password: string;
  expoToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
