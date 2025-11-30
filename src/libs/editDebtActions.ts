import debtService from "@/services/debtService";
import { DebtBetweenUsers, QuickDebt } from "@/types/Debt";

export async function editDebt(
    id: string,
    type: string,
    concept: string,
    amount: string,
    description: string,
    router: any
) {
    const payload = {
        new_purpose: concept,
        new_description: description,
        new_amount: Math.round(parseFloat(String(amount)) * 100),
        new_currency: "MXN",
    };
    if (type === "betweenUsers") {
        await debtService.editDebtBetweenUsers(id, payload as unknown as Partial<DebtBetweenUsers>);
    } else {
        await debtService.editQuickDebt(id, payload as unknown as Partial<QuickDebt>);
    }
    router.replace({
        pathname: "debts/receivable",
    });
}