import { describe, it, expect, beforeEach } from 'vitest';
import { Client, Provider, ProviderRegistry, Result } from '@blockstack/clarity';

class SkillExchangeMarketplaceClient extends Client {
  constructor(provider: Provider) {
    super(
        'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.skill-exchange-marketplace',
        'skill-exchange-marketplace',
        provider
    );
  }
  
  async listService(description: string, price: number): Promise<Result> {
    return this.callPublic('list-service', [`"${description}"`, `u${price}`]);
  }
  
  async initiateTrade(serviceId: number): Promise<Result> {
    return this.callPublic('initiate-trade', [`u${serviceId}`]);
  }
  
  async completeTrade(tradeId: number): Promise<Result> {
    return this.callPublic('complete-trade', [`u${tradeId}`]);
  }
  
  async refundTrade(tradeId: number): Promise<Result> {
    return this.callPublic('refund-trade', [`u${tradeId}`]);
  }
  
  async getService(serviceId: number): Promise<Result> {
    return this.callReadOnly('get-service', [`u${serviceId}`]);
  }
  
  async getTrade(tradeId: number): Promise<Result> {
    return this.callReadOnly('get-trade', [`u${tradeId}`]);
  }
  
  async getReputation(user: string): Promise<Result> {
    return this.callReadOnly('get-reputation', [`'${user}`]);
  }
}

describe('Skill Exchange Marketplace', () => {
  let client: SkillExchangeMarketplaceClient;
  let provider: Provider;
  
  beforeEach(async () => {
    provider = await ProviderRegistry.createProvider();
    client = new SkillExchangeMarketplaceClient(provider);
    await client.deployContract();
  });
  
  it('should list a service', async () => {
    const result = await client.listService('Web Development', 100);
    expect(result.success).toBe(true);
    const serviceId = parseInt(result.value);
    expect(serviceId).toBeGreaterThan(0);
    
    const serviceResult = await client.getService(serviceId);
    expect(serviceResult.success).toBe(true);
    const service = serviceResult.value;
    expect(service.description).toBe('Web Development');
    expect(parseInt(service.price)).toBe(100);
    expect(service.active).toBe(true);
  });
  
  it('should initiate a trade', async () => {
    const listResult = await client.listService('Data Analysis', 200);
    const serviceId = parseInt(listResult.value);
    
    const tradeResult = await client.initiateTrade(serviceId);
    expect(tradeResult.success).toBe(true);
    const tradeId = parseInt(tradeResult.value);
    expect(tradeId).toBeGreaterThan(0);
    
    const tradeInfo = await client.getTrade(tradeId);
    expect(tradeInfo.success).toBe(true);
    const trade = tradeInfo.value;
    expect(parseInt(trade.service_id)).toBe(serviceId);
    expect(parseInt(trade.amount)).toBe(200);
    expect(trade.completed).toBe(false);
    expect(trade.refunded).toBe(false);
  });
  
  it('should complete a trade and update reputations', async () => {
    const listResult = await client.listService('Mobile App Design', 300);
    const serviceId = parseInt(listResult.value);
    
    const tradeResult = await client.initiateTrade(serviceId);
    const tradeId = parseInt(tradeResult.value);
    
    const completeResult = await client.completeTrade(tradeId);
    expect(completeResult.success).toBe(true);
    
    const tradeInfo = await client.getTrade(tradeId);
    expect(tradeInfo.value.completed).toBe(true);
    
    // Check reputation updates
    const providerReputation = await client.getReputation(client.address);
    const requesterReputation = await client.getReputation(client.address); // In this test, provider and requester are the same
    expect(parseInt(providerReputation.value.score)).toBe(1);
    expect(parseInt(requesterReputation.value.score)).toBe(1);
  });
  
  it('should refund a trade', async () => {
    const listResult = await client.listService('Content Writing', 150);
    const serviceId = parseInt(listResult.value);
    
    const tradeResult = await client.initiateTrade(serviceId);
    const tradeId = parseInt(tradeResult.value);
    
    const refundResult = await client.refundTrade(tradeId);
    expect(refundResult.success).toBe(true);
    
    const tradeInfo = await client.getTrade(tradeId);
    expect(tradeInfo.value.refunded).toBe(true);
  });
});
