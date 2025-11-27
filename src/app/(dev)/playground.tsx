import React, { useEffect } from "react";
import debtService from "@/services/debtService";

export default function Playground() {
    useEffect(() => {
        debtService.fetchDebtsBetweenUsers("CREDITOR", "PENDING");
        debtService.fetchQuickDebts("DEBTOR", "PENDING");
    }, []);

    return null;
}