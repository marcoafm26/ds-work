const cleanups: any[] = [];

export const addCleanup = (data: any) => {
    cleanups.push(data);
};

export const runCleanups = async () => {
    for (const cleanup of cleanups) {
        await cleanup();
    }
    cleanups.length = 0; // Limpa o array
};
