import api from "@/services/apiClient";
import { DebtBetweenUsers, QuickDebt } from "@/types/Debt";

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
    }
};

export default debtService;