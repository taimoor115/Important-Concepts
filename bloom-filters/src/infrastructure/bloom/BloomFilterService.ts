import { createClient } from 'redis';

export class BloomFilterService {
    private client: any;
    private readonly FILTER_NAME = 'user_emails_filter';

    constructor() {
        this.client = createClient({ url: process.env.REDIS_URL });
        this.client.connect();
    }


    async initializeFilter() {
        try {
            await this.client.sendCommand(['BF.RESERVE', this.FILTER_NAME, '0.01', '1000000000']);
        } catch (e: any) {
            if (e.message.includes('item already exists')) return;
            console.error("Bloom Filter Init Error:", e);
        }
    }

    async add(email: string): Promise<void> {
        await this.client.sendCommand(['BF.ADD', this.FILTER_NAME, email]);
    }

    async exists(email: string): Promise<boolean> {
        const result = await this.client.sendCommand(['BF.EXISTS', this.FILTER_NAME, email]);
        return result === 1;
    }
}