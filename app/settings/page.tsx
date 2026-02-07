'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSettings } from '../../hooks/useSettings';
import type { OrgType } from '../../types/copilot';

export default function SettingsPage() {
  const router = useRouter();
  const { settings, saveSettings } = useSettings();
  
  const [token, setToken] = useState(settings?.token || '');
  const [orgName, setOrgName] = useState(settings?.orgName || '');
  const [orgType, setOrgType] = useState<OrgType>(settings?.orgType || 'organization');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!token || !orgName) {
      alert('请填写所有必填字段');
      return;
    }
    saveSettings({ token, orgName, orgType });
    setSaved(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">设置</h1>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
                GitHub Token <span className="text-red-500">*</span>
              </label>
              <input
                id="token"
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="ghp_xxxxx"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                需要 <code className="bg-gray-100 px-1 py-0.5 rounded">copilot</code> 和 <code className="bg-gray-100 px-1 py-0.5 rounded">read:org</code> 权限
              </p>
            </div>

            <div>
              <label htmlFor="orgType" className="block text-sm font-medium text-gray-700 mb-2">
                账户类型 <span className="text-red-500">*</span>
              </label>
              <select
                id="orgType"
                value={orgType}
                onChange={(e) => setOrgType(e.target.value as OrgType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="organization">组织 (Organization)</option>
                <option value="enterprise">企业 (Enterprise)</option>
              </select>
            </div>

            <div>
              <label htmlFor="orgName" className="block text-sm font-medium text-gray-700 mb-2">
                组织/企业名称 <span className="text-red-500">*</span>
              </label>
              <input
                id="orgName"
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="my-org"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {saved && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded">
                设置已保存！正在跳转...
              </div>
            )}

            <button
              onClick={handleSave}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              保存并继续
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
