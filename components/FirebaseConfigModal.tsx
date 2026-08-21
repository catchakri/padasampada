'use client';

import React, { useState } from 'react';
import { X, Database, CheckCircle2, AlertCircle, RefreshCw, Server, ShieldCheck } from 'lucide-react';
import { FirebaseConfigState } from '@/types/dictionary';

interface FirebaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: FirebaseConfigState;
  onSaveConfig: (newConfig: FirebaseConfigState) => void;
  onTriggerSync: () => void;
}

export const FirebaseConfigModal: React.FC<FirebaseConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onTriggerSync
}) => {
  const [apiKey, setApiKey] = useState(config.apiKey || '');
  const [projectId, setProjectId] = useState(config.projectId || '');
  const [authDomain, setAuthDomain] = useState(config.authDomain || '');
  const [appId, setAppId] = useState(config.appId || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newConfig: FirebaseConfigState = {
      apiKey: apiKey.trim(),
      projectId: projectId.trim(),
      authDomain: authDomain.trim() || (projectId.trim() ? `${projectId.trim()}.firebaseapp.com` : ''),
      appId: appId.trim(),
      isConfigured: !!(apiKey.trim() && projectId.trim())
    };

    onSaveConfig(newConfig);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-lg bg-[#FCFAF7] border border-[#E0D5BE] rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="telugu-maroon-gradient text-amber-50 px-6 py-4 flex items-center justify-between border-b border-amber-500/30">
          <div>
            <h3 className="text-lg font-bold font-telugu text-amber-100 flex items-center gap-2">
              <Database className="w-5 h-5 text-amber-400" />
              <span>ఫైర్‌బేస్ క్లౌడ్ అనుసంధానం (Firebase Sync)</span>
            </h3>
            <p className="text-xs text-amber-200/80 font-telugu">
              నిఘంటు పదాలు & ఓట్ల డేటాను క్లౌడ్‌లో సురక్షితంగా నిక్షిప్తం చేయండి
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-amber-300 hover:text-white hover:bg-amber-900/50 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          
          {/* Status Box */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            config.isConfigured 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            {config.isConfigured ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="text-xs font-telugu">
              <strong className="block font-bold mb-0.5 text-sm">
                {config.isConfigured ? 'ఫైర్‌బేస్ యాక్టివ్‌గా ఉంది (Cloud Connected)' : 'స్థానిక మోడ్ (Local Persistence Active)'}
              </strong>
              <span>
                {config.isConfigured
                  ? `Firestore కలెక్షన్ 'telugu_concepts' లో ప్రత్యక్షంగా డేటా సింక్ అవుతుంది.`
                  : 'ప్రస్తుతం మీ పదాలు మరియు ఓట్లు బ్రౌజర్ స్థానిక నిల్వలో భద్రంగా ఉంటాయి. క్లౌడ్ సింక్ కోసం ప్రాజెక్ట్ వివరాలను నమోదు చేయండి.'}
              </span>
            </div>
          </div>

          {/* Firebase Credentials Inputs */}
          <div className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-bold font-telugu text-stone-700 mb-1">
                Firebase Project ID
              </label>
              <input
                id="input-firebase-project-id"
                type="text"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                placeholder="e.g. pada-sampada-telugu"
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-[#7D191D]/30 focus:border-[#7D191D] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold font-telugu text-stone-700 mb-1">
                Firebase Web API Key
              </label>
              <input
                id="input-firebase-api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-[#7D191D]/30 focus:border-[#7D191D] font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold font-telugu text-stone-700 mb-1">
                  Auth Domain (ఐచ్ఛికం)
                </label>
                <input
                  id="input-firebase-auth-domain"
                  type="text"
                  value={authDomain}
                  onChange={(e) => setAuthDomain(e.target.value)}
                  placeholder="project-id.firebaseapp.com"
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-[#7D191D]/30 focus:border-[#7D191D] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold font-telugu text-stone-700 mb-1">
                  App ID (ఐచ్ఛికం)
                </label>
                <input
                  id="input-firebase-app-id"
                  type="text"
                  value={appId}
                  onChange={(e) => setAppId(e.target.value)}
                  placeholder="1:123456789:web:abcdef..."
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-[#7D191D]/30 focus:border-[#7D191D] font-mono"
                />
              </div>
            </div>
          </div>

          {/* Sync Information */}
          <div className="bg-stone-100/80 p-3 rounded-xl text-[11px] font-telugu text-stone-600 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-stone-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>ఆటోమేటిక్ సింక్ సామర్థ్యం</span>
            </div>
            <p>
              మీరు లేదా ఇతర వినియోగదారులు జోడించే ప్రతి తెలుగు పదం మరియు ఓటు వెంటనే Firebase Firestore కు అనుసంధానమై నిల్వ చేయబడుతుంది.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-stone-200">
            {config.isConfigured && (
              <button
                type="button"
                onClick={onTriggerSync}
                className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 hover:text-amber-900 font-telugu"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>ఇప్పుడే సింక్ చేయండి</span>
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-xs font-semibold text-stone-600 hover:text-stone-800 font-telugu"
              >
                రద్దు
              </button>

              <button
                id="btn-save-firebase-config"
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 bg-[#7D191D] hover:bg-[#5E0D10] text-amber-100 font-bold text-xs rounded-lg shadow font-telugu transition-all active:scale-95"
              >
                <span>{savedSuccess ? 'సేవ్ అయ్యింది!' : 'కాన్ఫిగరేషన్ సేవ్ చేయండి'}</span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
