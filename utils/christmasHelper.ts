export type ChristmasState = {
    isChristmasSeason: boolean;
    targetDate: number;
    currentYear: number;
};

export const checkChristmasState = (): ChristmasState => {
    const vnTimeStr = new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" });
    const now = new Date(vnTimeStr);

    const currentYear = now.getFullYear();

    const xmasDate = new Date(currentYear, 11, 25, 0, 0, 0);
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);

    if (now.getTime() >= xmasDate.getTime() && now.getTime() <= endOfYear.getTime()) {
        return {
            isChristmasSeason: true,
            targetDate: xmasDate.getTime(),
            currentYear: currentYear
        };
    }

    let targetDate = xmasDate;

    if (now.getTime() > endOfYear.getTime() || now.getTime() > xmasDate.getTime()) {
        targetDate = new Date(currentYear + 1, 11, 25, 0, 0, 0);
    }

    return {
        isChristmasSeason: false,
        targetDate: targetDate.getTime(),
        currentYear: targetDate.getFullYear()
    };
};

export const parseJwt = (token: string) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const binaryString = window.atob(base64);
        const bytes = new Uint8Array(binaryString.length);

        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        const jsonPayload = new TextDecoder('utf-8').decode(bytes);
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('Lỗi giải mã JWT:', e);
        return null;
    }
};