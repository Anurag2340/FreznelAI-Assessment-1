import React, { useState } from 'react';
import { Fingerprint, ShieldCheck, X, KeyRound, Sparkles } from 'lucide-react';
import { SpectrumButton } from '../common/SpectrumButton.jsx';

export function BiometricModal({ isOpen, onClose, onVerified, email }) {
  const [scanning, setScanning] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleScan = async () => {
    setScanning(true);
    setError(null);
    try {
      // Simulate/trigger biometric sensor
      setTimeout(() => {
        setScanning(false);
        setSuccess(true);
        setTimeout(() => {
          onVerified();
        }, 600);
      }, 900);
    } catch {
      setScanning(false);
      setError('Biometric sensor timed out or was cancelled.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#202020] border border-neutral-300 dark:border-[#333] rounded-lg shadow-2xl max-w-sm w-full p-6 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center flex flex-col items-center">
          <div className="relative mb-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
              success
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500'
                : scanning
                  ? 'bg-[#1473e6]/10 border-[#1473e6] text-[#1473e6] animate-pulse scale-105'
                  : 'bg-neutral-100 dark:bg-[#282828] border-neutral-300 dark:border-[#404040] text-neutral-600 dark:text-neutral-300'
            }`}>
              {success ? (
                <ShieldCheck className="w-8 h-8 text-emerald-500" />
              ) : (
                <Fingerprint className="w-8 h-8" />
              )}
            </div>

            {scanning && (
              <span className="absolute inset-0 rounded-full border-2 border-[#1473e6] animate-ping opacity-25" />
            )}
          </div>

          <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
            {success ? 'Identity Verified' : 'Biometric Authentication'}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4 max-w-xs">
            {success 
              ? 'Access granted to ModelHub developer workspace.' 
              : `Confirm your identity using Touch ID, Face ID, or Passkey${email ? ` for ${email}` : ''}.`}
          </p>

          {error && (
            <p className="text-xs text-rose-500 mb-3 bg-rose-500/10 p-2 rounded border border-rose-500/20">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-2 w-full mt-2">
            {!success && (
              <SpectrumButton
                variant="primary"
                size="large"
                loading={scanning}
                onClick={handleScan}
                icon={Fingerprint}
                className="w-full justify-center"
              >
                {scanning ? 'Scanning Sensor...' : 'Touch Sensor / Authenticate'}
              </SpectrumButton>
            )}

            <SpectrumButton
              variant="quiet"
              size="medium"
              onClick={onClose}
              className="w-full justify-center text-xs"
            >
              Cancel
            </SpectrumButton>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-[#303030] flex items-center justify-center gap-1.5 text-[11px] text-neutral-400">
            <KeyRound className="w-3.5 h-3.5" />
            <span>FIDO2 / WebAuthn Hardware Security Standard</span>
          </div>
        </div>
      </div>
    </div>
  );
}
