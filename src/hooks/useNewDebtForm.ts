import { useState } from "react";

export function useNewDebtForm() {
    const [concept, setConcept] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [amountWarning, setAmountWarning] = useState(false);

    const canContinue = concept.trim() !== "" && amount.trim() !== "" && description.trim() !== "";

    const handleAmountChange = (text: string) => {
        if (/[^0-9.]/.test(text)) {
            setAmountWarning(true);
        } else {
            setAmountWarning(false);
        }
        const numericText = text.replace(/[^0-9.]/g, "");
        setAmount(numericText);
    };

    return {
        concept,
        setConcept,
        amount,
        setAmount,
        description,
        setDescription,
        amountWarning,
        setAmountWarning,
        canContinue,
        handleAmountChange,
    };
}