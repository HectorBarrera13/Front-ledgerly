import { Account } from "@type/Account";
import { User } from "@type/User";
import { Token } from "@type/Token";

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
