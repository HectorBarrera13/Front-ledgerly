type ErrorStatus = 400 | 403 | 404 | 409 | number;

interface ErrorPresentation {
    [key: ErrorStatus]: { title: string; description: string };
    default: { title: string; description: string };
}

interface MessagePresentation {
    title: string;
    description: string;
}

export const manageApiError = (
    status: number,
    errorPresentation: ErrorPresentation
): MessagePresentation => {
    return errorPresentation[status] || errorPresentation.default;
};
