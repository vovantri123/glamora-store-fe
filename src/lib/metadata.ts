import { Metadata } from 'next';

interface PageMetadataProps {
  title: string;
  description?: string;
}

export function generatePageMetadata({
  title,
  description = 'Glamora Store - Your premium fashion destination',
}: PageMetadataProps): Metadata {
  return {
    title: `${title} | Glamora Store`,
    description,
  };
}
