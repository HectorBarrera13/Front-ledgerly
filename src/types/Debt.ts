export interface Debt {
    id: string;
    title: string;
    creditor: string;
    amount: number;
}

export type DebtStatus =
    | "PENDING"
    | "ACCEPTED"
    | "REJECTED"
    | "PAYMENT_CONFIRMATION_PENDING"
    | "PAYMENT_CONFIRMATION_REJECTED"
    | "PAYMENT_CONFIRMED";

export interface DebtUserSummary {
    userId: string;
    firstName: string;
    lastName: string;
}

export interface DebtBetweenUsers {
    id: string;
    purpose: string;
    description: string;
    amount: number;
    currency: string;
    status: DebtStatus;
    debtorSummary: DebtUserSummary;
    creditorSummary: DebtUserSummary;
}

export interface QuickDebt {
    id: string;
    purpose: string;
    description: string;
    amount: number;
    currency: string;
    status: DebtStatus;
    userSummary: DebtUserSummary;
    role: "DEBTOR" | "CREDITOR";
    targetUserName: string;
}