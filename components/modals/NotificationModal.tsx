'use client';

import { X, CheckCircle, Clock } from 'lucide-react';
import type { NotificationData } from '@/lib/types';
import StatusPill from '@/components/shared/StatusPill';

interface NotificationModalProps {
  notification: NotificationData;
  onClose: () => void;
}

export default function NotificationModal({ notification, onClose }: NotificationModalProps) {
  const { type, title, message, timestamp, details } = notification;

  // Icon based on notification type
  const getIcon = () => {
    switch (type) {
      case 'mlr-approved':
        return <CheckCircle className="text-dawn-green" size={24} />;
      case 'warning':
        return <Clock className="text-dawn-amber" size={24} />;
      default:
        return <CheckCircle className="text-dawn-teal" size={24} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-dawn-border px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            {getIcon()}
            <div>
              <h2 className="font-serif text-xl text-dawn-navy">{title}</h2>
              <p className="text-xs text-gray-400 mt-0.5">{timestamp}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-dawn-navy transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Message */}
          <div className="mb-6">
            <p className="text-sm text-gray-700 leading-relaxed">{message}</p>
          </div>

          {/* MLR Approval Details */}
          {type === 'mlr-approved' && details && (
            <div className="space-y-4">
              {/* Approver Info */}
              <div className="bg-dawn-sky rounded-xl border border-dawn-teal/20 p-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Approved By</p>
                    <p className="text-sm font-medium text-dawn-navy">{details.approver}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Approval Date</p>
                    <p className="text-sm font-medium text-dawn-navy">{details.approvalDate}</p>
                  </div>
                </div>
                {details.comments && (
                  <div className="mt-3 pt-3 border-t border-dawn-teal/10">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Comments</p>
                    <p className="text-sm text-gray-700">{details.comments}</p>
                  </div>
                )}
              </div>

              {/* Approved Assets Table */}
              <div>
                <p className="text-xs font-semibold text-dawn-navy mb-2 uppercase tracking-wide">
                  Approved Assets ({details.approvedAssets.length})
                </p>
                <div className="overflow-hidden rounded-xl border border-dawn-border">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b border-dawn-border">
                        <th className="px-3 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wide text-[10px]">
                          Asset
                        </th>
                        <th className="px-3 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wide text-[10px]">
                          Tier
                        </th>
                        <th className="px-3 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wide text-[10px]">
                          Pre-Screen
                        </th>
                        <th className="px-3 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wide text-[10px]">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {details.approvedAssets.map((asset, i) => (
                        <tr
                          key={i}
                          className="border-b border-dawn-border last:border-0 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-3 py-2.5 font-medium text-dawn-navy">{asset.asset}</td>
                          <td className="px-3 py-2.5">
                            <span
                              className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                                asset.tier === 'Tier 1'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-purple-100 text-purple-700'
                              }`}
                            >
                              {asset.tier}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-gray-500">{asset.aiPreScreen}</td>
                          <td className="px-3 py-2.5">
                            <StatusPill status={asset.status} size="sm" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-dawn-border px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-dawn-teal text-white text-sm font-medium hover:bg-dawn-teal/90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
