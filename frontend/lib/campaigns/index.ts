import type { Campaign } from './types';
import type { CampaignId } from '../types';
import { brexivaCampaign } from './brexiva';
import { zoflevrixCampaign } from './zoflevrix';
import { oncoryvaCampaign } from './oncoryva';
import { corvantaCampaign } from './corvanta';

export type { Campaign, CampaignData } from './types';
export type { CampaignId } from '../types';

export const DEFAULT_CAMPAIGN_ID: CampaignId = 'brexiva';

// Registry of all available campaigns, keyed by id. The active campaign is
// chosen via the welcome-screen chips and drives every storyline step and modal.
export const CAMPAIGNS: Record<CampaignId, Campaign> = {
  brexiva: brexivaCampaign,
  zoflevrix: zoflevrixCampaign,
  oncoryva: oncoryvaCampaign,
  corvanta: corvantaCampaign,
};

// Ordered list for rendering the welcome-screen chips.
export const CAMPAIGN_LIST: Campaign[] = [
  brexivaCampaign,
  // zoflevrixCampaign,
  // oncoryvaCampaign,
  // corvantaCampaign,
];

export function getCampaign(id: CampaignId): Campaign {
  return CAMPAIGNS[id] ?? CAMPAIGNS[DEFAULT_CAMPAIGN_ID];
}
