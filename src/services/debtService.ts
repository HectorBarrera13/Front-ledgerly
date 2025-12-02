import api from "@/services/apiClient";
import { DebtBetweenUsers, QuickDebt } from "@/types/Debt";
import { NewDebtPayload } from "./authService";

interface DebtsResponse<T> {
    items: T[];
}

const debtService = {
    fetchDebtsBetweenUsers: async (
        role: "CREDITOR" | "DEBTOR",
        status?: string
    ): Promise<DebtsResponse<DebtBetweenUsers>> => {
        let params = `?role=${role}`;
        if (status) params += `&status=${status}`;
        const response = await api.get(`/debt-between-users${params}`);
        return response as DebtsResponse<DebtBetweenUsers>;
    },

    fetchQuickDebts: async (
        role: "CREDITOR" | "DEBTOR",
        status?: string
    ): Promise<DebtsResponse<QuickDebt>> => {
        let params = `?role=${role}`;
        if (status) params += `&status=${status}`;
        const response = await api.get(`/quick-debt${params}`);
        return response as DebtsResponse<QuickDebt>;
    },

    fetchDebtsBetweenUsersById: async (id: string) => {
        return await api.get(`/debt-between-users/${id}`);
    },

    fetchQuickDebtById: async (id: string) => {
        return await api.get(`/quick-debt/${id}`);
    },

    acceptDebtBetweenUsers: async (debtId: string) => {
        return await api.post(`/debt-between-users/${debtId}/accept-debt`);
    },
    rejectDebtBetweenUsers: async (debtId: string) => {
        return await api.post(`/debt-between-users/${debtId}/decline-debt`);
    },
    reportDebtPayment: async (debtId: string) => {
        return await api.post(`/debt-between-users/${debtId}/report-payment`);
    },
    verifyDebtPayment: async (debtId: string) => {
        return await api.post(`/debt-between-users/${debtId}/verify-payment`);
    },

    resendDebt: async (debtId: string) => {
        return await api.post(`/debt-between-users/${debtId}/resend-debt`);
    },

    rejectDebtPayment: async (debtId: string) => {
        return await api.post(`/debt-between-users/${debtId}/reject-payment`);
    },

    editQuickDebt: async (debtId: string, data: Partial<QuickDebt>) => {
        return await api.patch(`/quick-debt/${debtId}`, data);
    },

    editDebtBetweenUsers: async (
        debtId: string,
        data: Partial<DebtBetweenUsers>
    ) => {
        return await api.patch(`/debt-between-users/${debtId}`, data);
    },

    async newDebtQuick(data: NewDebtPayload): Promise<void> {
        return await api.post("/quick-debt", data);
    },

    async newDebtBetweenUsers(data: NewDebtPayload): Promise<void> {
        return await api.post("/debt-between-users", data);
    },
};

export default debtService;
