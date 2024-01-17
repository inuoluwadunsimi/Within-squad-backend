import {Document} from "mongoose";

export interface UserAuth extends Document{
    id:string;
    email:string;
    password:string;
    user:string;
    expoToken:string;
    createdAt:string;
    updatedAt:string;
}