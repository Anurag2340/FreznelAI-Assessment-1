import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useModels } from '../context/ModelContext.jsx';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Fingerprint, 
  Database, 
  LogOut, 
  Check, 
  Edit3,
  CheckCircle2,
  Trash2,
  Lock
} from 'lucide-react';
import { BiometricModal } from '../components/auth/BiometricModal.jsx';
import { useToast } from '../context/ToastContext.jsx';

export function Profile() {
  const { 
    user, 
    signOut, 
    updateProfileName, 
    isConfigured, 
    isBiometricEnrolled, 
    enrollBiometrics 
  } = useAuth();

  const { totalModelCount, isUsingCache } = useModels();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user?.displayName || '');
  const [updating, setUpdating] = useState(false);
  const [bioModalOpen, setBioModalOpen] = useState(false);

  const handleSaveName = async () => {
    if (!nameInput.trim()) return;
    setUpdating(true);
    try {
      await updateProfileName(nameInput.trim());
      setIsEditingName(false);
      addToast('Profile display name updated successfully.', 'success');
    } catch {
      addToast('Failed to update name.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    addToast('Signed out of ModelHub.', 'info');
    navigate('/login');
  };

  const handleClearCache = async () => {
    try {
      if (window.indexedDB) {
        window.indexedDB.deleteDatabase('ModelHubCacheDB');
        addToast('IndexedDB cache purged. Refreshing state...', 'success');
        setTimeout(() => window.location.reload(), 1200);
      }
    } catch {
      addToast('Could not delete cache database.', 'error');
    }
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6 text-xs pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          User Account & Security Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage identity, biometric passkeys, local storage cache, and active session controls.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-black text-2xl shadow-md shadow-blue-500/20 shrink-0">
            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'D'}
          </div>

          <div className="flex-1 min-w-0">
            {isEditingName ? (
              <div className="flex items-center gap-2 max-w-sm">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="px-3 py-1.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  disabled={updating}
                  onClick={handleSaveName}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingName(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium text-xs"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                  {user?.displayName || 'Developer'}
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setNameInput(user?.displayName || '');
                    setIsEditingName(true);
                  }}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  title="Edit Display Name"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1 font-medium">
              <Mail className="w-3.5 h-3.5" />
              <span>{user?.email || 'developer@modelhub.ai'}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>
              Member Since:{' '}
              <strong className="text-slate-900 dark:text-white">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active Session'}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Shield className="w-4 h-4 text-blue-500" />
            <span>
              Auth Status:{' '}
              <strong className="text-emerald-500">
                Verified Session
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Biometric Authentication Section */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Fingerprint className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Biometric Authentication & Passkeys
              </h3>
              <p className="text-[11px] text-slate-500">
                Touch ID, Face ID, Windows Hello, and WebAuthn credentials.
              </p>
            </div>
          </div>

          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
            isBiometricEnrolled
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}>
            {isBiometricEnrolled ? 'Enrolled & Verified' : 'Not Enrolled'}
          </span>
        </div>

        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          Log in with a single touch or glance using Apple Touch ID, Windows Hello, Android Biometrics, or FIDO2 hardware keys for maximum security.
        </p>

        <div className="flex items-center gap-3 pt-1 flex-wrap">
          <button
            type="button"
            onClick={enrollBiometrics}
            className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Fingerprint className="w-4 h-4" />
            <span>{isBiometricEnrolled ? 'Re-enroll Passkey' : 'Enroll Biometric Passkey'}</span>
          </button>

          <button
            type="button"
            onClick={() => setBioModalOpen(true)}
            className="py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
          >
            Test Biometric Scanner
          </button>
        </div>
      </div>

      {/* Offline Storage & IndexedDB Cache */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              IndexedDB Offline Persistence Cache
            </h3>
            <p className="text-[11px] text-slate-500">
              Synchronized store for zero-latency queries and offline survival.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Database Name:</span>
            <code className="font-mono text-slate-800 dark:text-slate-200">ModelHubCacheDB</code>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Stored Model Records:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{totalModelCount || 161} models</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Active Storage Layer:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {isUsingCache ? 'IndexedDB Local Cache' : 'Live Synced + IndexedDB Cache'}
            </span>
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={handleClearCache}
            className="py-2 px-3.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Purge Offline Cache</span>
          </button>
        </div>
      </div>

      {/* Sign Out Action */}
      <div className="flex justify-between items-center pt-2">
        <span className="text-slate-400 text-[11px]">
          Session: <code className="font-mono">{user?.email}</code>
        </span>
        <button
          type="button"
          onClick={handleSignOut}
          className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of ModelHub</span>
        </button>
      </div>

      {/* Interactive Biometric Sensor Modal */}
      <BiometricModal
        isOpen={bioModalOpen}
        onClose={() => setBioModalOpen(false)}
        onVerified={() => setBioModalOpen(false)}
        email={user?.email}
      />
    </div>
  );
}
