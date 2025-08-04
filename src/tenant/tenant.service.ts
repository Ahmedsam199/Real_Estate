import { Injectable } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';

const clients: Record<string, PrismaClient> = {};

@Injectable()
export class TenantService {
  async getClient(tenantId: string): Promise<PrismaClient> {
    if (clients[tenantId]) return clients[tenantId];
    console.log(clients);

    const dbUrl = `mysql://root:@localhost:3306/${tenantId}`;

    const client = new PrismaClient({
      datasources: {
        db: {
          url: dbUrl,
        },
      },
    });

    await client.$connect();
    clients[tenantId] = client;
    return client;
  }
}
