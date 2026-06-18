'use client';

import { useEffect, useState } from 'react';
import Typography from '@/components/Typography';
import Button from '@/components/Button';

export default function AdminSetupPage() {
  const [cmsOk, setCmsOk] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/cms-health')
      .then((res) => res.json())
      .then((data) => setCmsOk(!!data.ok))
      .catch(() => setCmsOk(false));
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <Typography variant="h1" className="mb-4">
            CMS Setup Status
          </Typography>
          <Typography variant="p" className="text-neutral-600 dark:text-neutral-400">
            Contentful powers all site content
          </Typography>
        </div>

        <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-6 mb-8">
          <Typography variant="h3" className="mb-4">
            Connection
          </Typography>
          <p className="text-sm">
            {cmsOk === null && 'Checking Contentful connection...'}
            {cmsOk === true && 'Connected to Contentful'}
            {cmsOk === false && 'Contentful not connected — check CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN in .env.local'}
          </p>
        </div>

        <div className="text-center">
          <Button href="https://app.contentful.com" target="_blank">
            Open Contentful Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
