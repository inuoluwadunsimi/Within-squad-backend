import {Document} from "mongoose";

export interface User extends Document{
    id: string;
    fullName:string;
    email:string;
    regNo:string;
    dateOfBirth:string;
    department:string;
    level:string;
    createdAt:string;
    updatedAt:string;
}