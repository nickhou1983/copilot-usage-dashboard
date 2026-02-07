'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { useRouter } from 'next/navigation';
import { MetricCard } from '../../components/metrics/MetricCard';
import type { LanguageBreakdown, DailyStat } from '../../types/copilot';

interface DashboardMetrics {
  totalSuggestions: number;
  totalAcceptances: number;
  acceptanceRate: number;
  totalLinesSuggested: number;
  totalLinesAccepted: number;
  languageBreakdown?: LanguageBreakdown[];
  dailyStats?: DailyStat[];
}

export default function DashboardPage() {
  const router = useRouter();
  const { settings, isLoaded } = useSettings();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && !settings) {
      router.push('/settings');
    }
  }, [isLoaded, settings, router]);

  const fetchData = useCallback(async () => {
    if (!settings) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/copilot/usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: settings.token,
          orgName: settings.orgName,
          orgType: settings.orgType,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '获取数据失败');
      }

      const data = await response.json();
      setMetrics(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [settings]);

  useEffect(() => {
    if (settings) {
      fetchData();
    }
  }, [settings, fetchData]);

  if (!isLoaded || !settings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Copilot 用量统计</h1>
            <p className="mt-1 text-sm text-gray-600">
              {settings.orgName} ({settings.orgType === 'organization' ? '组织' : '企业'})
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '刷新中...' : '🔄 刷新'}
            </button>
            <button
              onClick={() => router.push('/settings')}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              ⚙️ 设置
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
            ❌ {error}
          </div>
        )}

        {loading && !metrics && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">加载数据中...</p>
          </div>
        )}

        {metrics && (
          <div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <MetricCard
                title="总建议数"
                value={metrics.totalSuggestions.toLocaleString()}
                icon="💡"
              />
              <MetricCard
                title="总接受数"
                value={metrics.totalAcceptances.toLocaleString()}
                icon="✅"
              />
              <MetricCard
                title="接受率"
                value={`${metrics.acceptanceRate}%`}
                icon="📊"
                description="建议被接受的百分比"
              />
              <MetricCard
                title="建议行数"
                value={metrics.totalLinesSuggested.toLocaleString()}
                icon="📝"
              />
            </div>

            {metrics.languageBreakdown && metrics.languageBreakdown.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">🌐 编程语言分布</h2>
                <div className="space-y-3">
                  {metrics.languageBreakdown.slice(0, 5).map((lang: LanguageBreakdown) => {
                    const percentage = metrics.totalSuggestions > 0
                      ? Math.round((lang.suggestions_count / metrics.totalSuggestions) * 100)
                      : 0;
                    return (
                      <div key={lang.language}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">{lang.language}</span>
                          <span className="text-gray-600">
                            {lang.suggestions_count.toLocaleString()} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {metrics.dailyStats && metrics.dailyStats.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">📈 每日趋势</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">日期</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">建议数</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">接受数</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">接受率</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {metrics.dailyStats.slice(-7).map((stat: DailyStat) => (
                        <tr key={stat.date}>
                          <td className="px-4 py-2 text-sm text-gray-900">{stat.date}</td>
                          <td className="px-4 py-2 text-sm text-gray-600 text-right">{stat.suggestions.toLocaleString()}</td>
                          <td className="px-4 py-2 text-sm text-gray-600 text-right">{stat.acceptances.toLocaleString()}</td>
                          <td className="px-4 py-2 text-sm font-medium text-gray-900 text-right">
                            {stat.suggestions > 0 ? Math.round((stat.acceptances / stat.suggestions) * 100) : 0}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
