'use client';

import React, { useState } from 'react';
import { X, Download, Copy, Check, FileSpreadsheet, FileCode, FileText, Share2, Sparkles } from 'lucide-react';
import { EnglishConcept } from '@/types/dictionary';
import { exportToCSV, exportToJSON, exportToMarkdown, downloadFile } from '@/lib/storage';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  concepts: EnglishConcept[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  concepts
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'json' | 'markdown'>('csv');
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const totalWords = concepts.reduce((acc, c) => acc + (c.proposals?.length || 0), 0);
  const standardizedWords = concepts.reduce(
    (acc, c) => acc + (c.proposals?.filter(p => p.isStandardized)?.length || 0),
    0
  );

  const getExportContent = () => {
    switch (selectedFormat) {
      case 'csv':
        return exportToCSV(concepts);
      case 'json':
        return exportToJSON(concepts);
      case 'markdown':
        return exportToMarkdown(concepts);
      default:
        return '';
    }
  };

  const handleDownload = () => {
    const content = getExportContent();
    const dateStr = new Date().toISOString().split('T')[0];
    if (selectedFormat === 'csv') {
      downloadFile(content, `telugu_pada_sampada_${dateStr}.csv`, 'text/csv;charset=utf-8;');
    } else if (selectedFormat === 'json') {
      downloadFile(content, `telugu_pada_sampada_${dateStr}.json`, 'application/json;charset=utf-8;');
    } else {
      downloadFile(content, `telugu_pada_sampada_${dateStr}.md`, 'text/markdown;charset=utf-8;');
    }
  };

  const handleCopy = () => {
    const content = getExportContent();
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-xl bg-[#FCFAF7] border border-[#E0D5BE] rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="telugu-maroon-gradient text-amber-50 px-6 py-4 flex items-center justify-between border-b border-amber-500/30">
          <div>
            <h3 className="text-lg font-bold font-telugu text-amber-100 flex items-center gap-2">
              <Download className="w-5 h-5 text-amber-400" />
              <span>స్వేచ్ఛా దత్తాంశ ఎగుమతి (Open Data Export)</span>
            </h3>
            <p className="text-xs text-amber-200/80 font-telugu">
              తెలుగు సంస్కృతి & నిఘంటు పద సంపదను CSV, JSON లేదా Markdown లో డౌన్‌లోడ్ చేయండి
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-amber-300 hover:text-white hover:bg-amber-900/50 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {/* Open Source Stats Ribbon */}
          <div className="grid grid-cols-3 gap-3 bg-[#FFF9EE] border border-[#F3DFC1] rounded-xl p-3.5 text-center font-telugu">
            <div>
              <div className="text-xs text-stone-500">మొత్తం ఆంగ్ల భావనలు</div>
              <div className="text-xl font-bold text-[#6B1114]">{concepts.length}</div>
            </div>
            <div>
              <div className="text-xs text-stone-500">ప్రతిపాదిత తెలుగు పదాలు</div>
              <div className="text-xl font-bold text-amber-800">{totalWords}</div>
            </div>
            <div>
              <div className="text-xs text-stone-500">నిఘంటువులో స్థిరపడినవి</div>
              <div className="text-xl font-bold text-emerald-700">{standardizedWords}</div>
            </div>
          </div>

          {/* Format Selection Cards */}
          <div className="space-y-2">
            <label className="block text-xs font-bold font-telugu text-stone-700">
              ఫార్మాట్ ఎంచుకోండి (Choose Export Format):
            </label>
            <div className="grid grid-cols-3 gap-3">
              
              {/* CSV Option */}
              <button
                id="btn-format-csv"
                type="button"
                onClick={() => setSelectedFormat('csv')}
                className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all ${
                  selectedFormat === 'csv'
                    ? 'bg-amber-50 border-amber-600 ring-2 ring-amber-600/20 text-[#6B1114]'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <FileSpreadsheet className="w-6 h-6 mb-1 text-emerald-600" />
                <span className="font-bold text-xs">CSV Table</span>
                <span className="text-[10px] text-stone-400">Excel, Sheets</span>
              </button>

              {/* JSON Option */}
              <button
                id="btn-format-json"
                type="button"
                onClick={() => setSelectedFormat('json')}
                className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all ${
                  selectedFormat === 'json'
                    ? 'bg-amber-50 border-amber-600 ring-2 ring-amber-600/20 text-[#6B1114]'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <FileCode className="w-6 h-6 mb-1 text-amber-600" />
                <span className="font-bold text-xs">JSON API</span>
                <span className="text-[10px] text-stone-400">Developers & Apps</span>
              </button>

              {/* Markdown Option */}
              <button
                id="btn-format-markdown"
                type="button"
                onClick={() => setSelectedFormat('markdown')}
                className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all ${
                  selectedFormat === 'markdown'
                    ? 'bg-amber-50 border-amber-600 ring-2 ring-amber-600/20 text-[#6B1114]'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <FileText className="w-6 h-6 mb-1 text-blue-600" />
                <span className="font-bold text-xs">Markdown</span>
                <span className="text-[10px] text-stone-400">Docs & GitHub</span>
              </button>

            </div>
          </div>

          {/* Preview Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-telugu text-stone-600">
              <span>ముందస్తు పరిశీలన (Preview):</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-amber-700 hover:text-amber-900 font-semibold"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'కాపీ చేయబడింది!' : 'కాపీ చేయండి'}</span>
              </button>
            </div>
            <pre className="w-full h-32 bg-stone-900 text-amber-100 text-[11px] p-3 rounded-xl overflow-auto font-mono">
              {getExportContent()}
            </pre>
          </div>

          {/* Open Source License Note */}
          <div className="text-[11px] font-telugu text-stone-500 bg-stone-100/80 p-3 rounded-lg flex items-start gap-2">
            <Share2 className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
            <span>
              ఈ నిఘంటువు సమాచారం తెలుగు సంస్కృతి పరిరక్షణార్థం <strong>Creative Commons (CC BY-SA 4.0)</strong> ఓపెన్ సోర్స్ లైసెన్స్ కింద ఉచితంగా లభిస్తుంది. సాఫ్ట్‌వేర్ అనువాదాలు, వికీపీడియా, నిఘంటువులలో స్వేచ్ఛగా వాడుకోవచ్చు.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-stone-600 hover:text-stone-800 font-telugu"
            >
              మూసివేయండి (Close)
            </button>

            <button
              id="btn-download-file"
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-900 font-bold text-xs sm:text-sm rounded-lg shadow-md font-telugu transition-all active:scale-95"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>ఫైల్ డౌన్‌లోడ్ చేయండి ({selectedFormat.toUpperCase()})</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
