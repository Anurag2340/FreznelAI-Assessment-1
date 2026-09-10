import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header.jsx';
import { Sidebar } from './Sidebar.jsx';
import { NetworkStatus } from './NetworkStatus.jsx';
import { SelectedModelBanner } from '../models/SelectedModelBanner.jsx';
import { ModelComparisonModal } from '../models/ModelComparisonModal.jsx';
import { ModelDetailsDrawer } from '../models/ModelDetailsDrawer.jsx';

export function AppLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [inspectingModel, setInspectingModel] = useState(null);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/80 dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Global Application Header */}
      <Header onToggleMobileNav={() => setMobileNavOpen(true)} />

      {/* Global Network Status Banner (Online/Offline/Cache Status) */}
      <NetworkStatus />

      {/* Main Layout Body: Sidebar + Workspace */}
      <div className="flex-1 flex w-full">
        {/* Desktop Sidebar */}
        <Sidebar
          onOpenCompare={() => setCompareModalOpen(true)}
        />

        {/* Mobile Navigation Drawer */}
        {mobileNavOpen && (
          <Sidebar
            isMobile
            onClose={() => setMobileNavOpen(false)}
            onOpenCompare={() => {
              setMobileNavOpen(false);
              setCompareModalOpen(true);
            }}
          />
        )}

        {/* Workspace Canvas */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 pb-28 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            <Outlet context={{ onInspectModel: (m) => setInspectingModel(m) }} />
          </div>
        </main>
      </div>

      {/* Persistent Selected Model Summary Dock */}
      <SelectedModelBanner onOpenDetails={(m) => setInspectingModel(m)} />

      {/* Comparison Modal */}
      <ModelComparisonModal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
      />

      {/* Model Specs Drawer */}
      {inspectingModel && (
        <ModelDetailsDrawer
          model={inspectingModel}
          onClose={() => setInspectingModel(null)}
        />
      )}
    </div>
  );
}
