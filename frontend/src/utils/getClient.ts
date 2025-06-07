interface Client {
    id: string;
    name: string;
    cpf: string;
    phone: string;
}

const getClient = (): Client | null => {
    const client = localStorage.getItem('client');
    if (client) {
        return JSON.parse(client).client;
    }
    return null;
};

export default getClient;
