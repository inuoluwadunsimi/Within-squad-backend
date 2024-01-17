
import {User} from "../models/user.interface";

export interface AuthResponse{
    user:User,
    token:string;
}