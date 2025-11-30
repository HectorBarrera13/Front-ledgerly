import debtService from "@/services/debtService";

export async function reportPayment(debt: any, setDebt: (d: any) => void, router: any) {
    await debtService.reportDebtPayment(debt.id);
    setDebt({ ...debt, status: "PAYMENT_CONFIRMATION_PENDING" });
    router.push(`(modals)/successNotification?title=¡Listo!&message=Hemos notificado al acreedor`);
}

export async function verifyPayment(debt: any, setDebt: (d: any) => void, router: any) {
    await debtService.verifyDebtPayment(debt.id);
    setDebt({ ...debt, status: "PAYMENT_CONFIRMED" });
    router.push(`(modals)/successNotification?title=¡Pago confirmado!&message=La deuda ha sido saldada`);
}

export async function rejectPayment(debt: any, setDebt: (d: any) => void, router: any) {
    await debtService.rejectDebtPayment(debt.id);
    setDebt({ ...debt, status: "PAYMENT_CONFIRMATION_REJECTED" });
    router.push(`(modals)/successNotification?title=Pago rechazado&message=El pago fue rechazado`);
}

export async function quickConfirm(debt: any, setDebt: (d: any) => void, router: any) {
    await debtService.verifyDebtPayment(debt.id);
    setDebt({ ...debt, status: "PAYMENT_CONFIRMED" });
    router.push(`(modals)/successNotification?title=¡Listo!&message=La deuda ha sido saldada`);
}