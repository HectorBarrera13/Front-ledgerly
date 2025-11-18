import { Account } from "./Account";
import { User } from "./User";
import { Token } from "./Token";

export interface LoginResponse {
    account: Account;
    user: User;
    token: Token;
}
