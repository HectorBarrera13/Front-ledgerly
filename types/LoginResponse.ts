import { Account } from "./Account";
import { User } from "./User";
import { Token } from "./Token";

export interface LoginResponse {
    account: Account;
    user: User;
    token: Token;
}

export interface AuthProfile {
    account: Account;
    user: User;
    token: Token;
}

export interface Profile {
    account: Account;
    user: User;
}
