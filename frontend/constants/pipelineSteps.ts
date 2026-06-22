import {
  Shield,
  Share2,
  Tag,
  FileImage,
  Rocket,
  type LucideIcon,
} from 'lucide-react';

export const STEP_INITIAL_DELAY_MS = 1000;
export const STEP_INTERVAL_MS = 1500;

export type PipelineStep = {
  label: string;
  description: string;
  icon: LucideIcon;
};

/** Minimal shape needed by buildPipelineSteps (avoids circular import). */
interface PipelineAssetRow {
  content_type: string;
}

function summarizeContentTypes(types: string[], max = 3): string {
  if (types.length === 0) return 'No assets selected';
  if (types.length <= max) return types.join(', ');
  return `${types.slice(0, max).join(', ')} & ${types.length - max} more`;
}

export function buildPipelineSteps(selectedAssets: PipelineAssetRow[]): PipelineStep[] {
  const count = selectedAssets.length;
  const types = selectedAssets.map((a) => a.content_type);
  const summary = summarizeContentTypes(types);

  return [
    {
      label: 'Loading MLR-approved assets',
      description:
        count === 0
          ? 'Waiting for asset selection'
          : `${count} asset${count === 1 ? '' : 's'} retrieved with DAM approval metadata`,
      icon: Shield,
    },
    {
      label: 'Mapping assets to channels',
      description:
        count === 0
          ? 'Select assets above to map distribution channels'
          : `${summary} aligned to selected channels`,
      icon: Share2,
    },
    {
      label: 'Applying channel metadata',
      description: 'Audience segments, delivery dates & market codes applied per asset',
      icon: Tag,
    },
    {
      label: 'Generating channel renditions',
      description:
        count === 0
          ? 'Renditions will be prepared after assets are selected'
          : `Export formats prepared for ${count} selected asset${count === 1 ? '' : 's'}`,
      icon: FileImage,
    },
    {
      label: 'Ready for deployment',
      description:
        count === 0
          ? 'Select at least one asset to enable distribution'
          : 'All channels cleared — confirm to start transfer to DAM',
      icon: Rocket,
    },
  ];
}
