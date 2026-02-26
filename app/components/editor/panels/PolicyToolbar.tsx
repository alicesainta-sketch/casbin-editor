import { useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';
import { FileUploadButton } from '@/app/components/editor/common/FileUploadButton';
import { EngineSelector } from '@/app/components/editor/common/EngineSelector';
import { EndpointSelector } from '@/app/components/editor/common/EndpointSelector';
import type { EngineType } from '@/app/config/engineConfig';
import type { VersionInfo } from '@/app/components/hooks/useRemoteEnforcer';
import { useLang } from '@/app/context/LangContext';

interface PolicyToolbarProps {
  setPolicyPersistent: (content: string) => void;
  selectedEngine: EngineType;
  comparisonEngines: EngineType[];
  handleEngineChange: (newPrimary: EngineType, newComparison: EngineType[]) => void;
  versions: Record<EngineType, VersionInfo>;
  engineGithubLinks: Record<EngineType, string>;
  onDesignPolicy: () => void;
}

export const PolicyToolbar: React.FC<PolicyToolbarProps> = ({
  setPolicyPersistent,
  selectedEngine,
  comparisonEngines,
  handleEngineChange,
  versions,
  engineGithubLinks,
  onDesignPolicy,
}) => {
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const [compactMode, setCompactMode] = useState(false);
  const { t } = useLang();
  const designButtonClassName = clsx(
    'px-3 py-1.5 rounded-lg',
    'border border-primary text-primary bg-secondary',
    'hover:bg-primary hover:text-primary-foreground',
    'transition-all duration-200 shadow-sm hover:shadow-md',
    'font-medium text-sm whitespace-nowrap',
  );

  // Responsive behavior - use compact mode when space is tight
  useEffect(() => {
    const el = toolbarRef.current;
    if (!el) return;

    const check = () => {
      const w = el.clientWidth || 0;
      // Switch to compact mode when width is less than 500px
      setCompactMode(w < 500);
    };

    const ro = new ResizeObserver(check);
    ro.observe(el);
    check();

    return () => {
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={toolbarRef} className="flex-1 overflow-x-auto min-w-0">
      <div className="text-right mr-4 text-sm flex items-center justify-end gap-2 min-w-max">
        <div className="font-normal text-base">
          <FileUploadButton onFileContent={setPolicyPersistent} accept=".csv" />
        </div>
        {/* Primary entry: trigger AI policy design (parent builds prompt and opens the side panel) */}
        <button
          type="button"
          onClick={onDesignPolicy}
          className={designButtonClassName}
        >
          {t('AI Policy Design')}
        </button>
        <EndpointSelector />
        <EngineSelector
          selectedEngine={selectedEngine}
          comparisonEngines={comparisonEngines}
          onEngineChange={handleEngineChange}
          versions={versions}
          engineGithubLinks={engineGithubLinks}
          compactMode={compactMode}
        />
      </div>
    </div>
  );
};
