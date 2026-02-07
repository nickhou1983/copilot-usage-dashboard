# UI 开发指南 - GitHub Copilot 用量统计网站

## 🎯 当前状态

✅ **后端完全就绪**：所有 API、类型、Hooks 都已可用
🚧 **待开发**：4 个 UI 页面/组件

---

## 📋 开发清单（按顺序）

### 1. 初始化 shadcn/ui（5 分钟）

```bash
# 初始化 shadcn/ui
npx shadcn@latest init

# 选择配置（建议）:
# - TypeScript: Yes
# - Style: Default
# - Base color: Slate
# - CSS variables: Yes

# 添加需要的组件
npx shadcn@latest add input label select button card
```

### 2. 创建设置页面（30 分钟）

**文件**: `app/settings/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSettings } from '@/hooks/useSettings';
import { OrgType } from '@/types/copilot';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SettingsPage() {
  const router = useRouter();
  const { settings, saveSettings } = useSettings();
  
  const [token, setToken] = useState(settings?.token || '');
  const [orgName, setOrgName] = useState(settings?.orgName || '');
  const [orgType, setOrgType] = useState<OrgType>(settings?.orgType || 'organization');

  const handleSave = () => {
    saveSettings({ token, orgName, orgType });
    router.push('/dashboard');
  };

  return (
    <div className="container max-w-2xl py-10">
      <h1 className="text-3xl font-bold mb-6">设置</h1>
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="token">GitHub Token</Label>
            <Input
              id="token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_xxxxx"
            />
            <p className="text-sm text-muted-foreground mt-1">
              需要 <code>copilot</code> 和 <code>read:org</code> 权限
            </p>
          </div>

          <div>
            <Label htmlFor="orgType">账户类型</Label>
            <Select value={orgType} onValueChange={(v) => setOrgType(v as OrgType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="organization">组织 (Organization)</SelectItem>
                <SelectItem value="enterprise">企业 (Enterprise)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="orgName">组织/企业名称</Label>
            <Input
              id="orgName"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="my-org"
            />
          </div>

          <Button onClick={handleSave} className="w-full">
            保存并继续
          </Button>
        </div>
      </Card>
    </div>
  );
}
```

### 3. 创建指标卡片组件（20 分钟）

**文件**: `components/metrics/MetricCard.tsx`

```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
}

export function MetricCard({ title, value, icon: Icon, description }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
```

### 4. 创建仪表板页面（45 分钟）

**文件**: `app/dashboard/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { useRouter } from 'next/navigation';
import { MetricCard } from '@/components/metrics/MetricCard';
import { Button } from '@/components/ui/button';
import { TrendingUp, CheckCircle, FileCode, RefreshCw } from 'lucide-react';
import type { UsageMetrics } from '@/types/copilot';

export default function DashboardPage() {
  const router = useRouter();
  const { settings, isLoaded } = useSettings();
  const [metrics, setMetrics] = useState<UsageMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 重定向到设置页面如果没有配置
  useEffect(() => {
    if (isLoaded && !settings) {
      router.push('/settings');
    }
  }, [isLoaded, settings, router]);

  // 获取数据
  const fetchData = async () => {
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
  };

  // 初始加载
  useEffect(() => {
    if (settings) {
      fetchData();
    }
  }, [settings]);

  if (!isLoaded || !settings) {
    return <div className="container py-10">加载中...</div>;
  }

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Copilot 用量统计</h1>
        <Button onClick={fetchData} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          刷新
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded mb-6">
          {error}
        </div>
      )}

      {loading && !metrics && (
        <div className="text-center py-20">加载中...</div>
      )}

      {metrics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="总建议数"
            value={metrics.totalSuggestions.toLocaleString()}
            icon={TrendingUp}
          />
          <MetricCard
            title="总接受数"
            value={metrics.totalAcceptances.toLocaleString()}
            icon={CheckCircle}
          />
          <MetricCard
            title="接受率"
            value={`${metrics.acceptanceRate}%`}
            icon={FileCode}
          />
          <MetricCard
            title="建议行数"
            value={metrics.totalLinesSuggested.toLocaleString()}
            icon={TrendingUp}
          />
        </div>
      )}
    </div>
  );
}
```

### 5. 更新首页重定向（5 分钟）

**文件**: `app/page.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSettings } from '@/hooks/useSettings';

export default function HomePage() {
  const router = useRouter();
  const { settings, isLoaded } = useSettings();

  useEffect(() => {
    if (isLoaded) {
      if (settings) {
        router.push('/dashboard');
      } else {
        router.push('/settings');
      }
    }
  }, [isLoaded, settings, router]);

  return (
    <div className="container flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">GitHub Copilot 用量统计</h1>
        <p className="text-muted-foreground">加载中...</p>
      </div>
    </div>
  );
}
```

---

## 🧪 测试步骤

1. **启动开发服务器**
   ```bash
   npm run dev
   ```

2. **访问应用**
   - 打开 http://localhost:3000
   - 应该自动重定向到设置页面

3. **配置设置**
   - 输入你的 GitHub Token
   - 选择账户类型（组织/企业）
   - 输入组织名称
   - 点击"保存并继续"

4. **查看仪表板**
   - 应该看到 4 个指标卡片
   - 点击刷新按钮测试数据获取

---

## 📦 可选扩展（如有时间）

### 添加图表（使用 Recharts）

```bash
# 已安装：recharts
```

**文件**: `components/charts/TrendChart.tsx`

```typescript
'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { DailyStat } from '@/types/copilot';

interface TrendChartProps {
  data: DailyStat[];
}

export function TrendChart({ data }: TrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="suggestions" stroke="#8884d8" name="建议数" />
        <Line type="monotone" dataKey="acceptances" stroke="#82ca9d" name="接受数" />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

在 `app/dashboard/page.tsx` 中添加：

```typescript
import { TrendChart } from '@/components/charts/TrendChart';

// 在 metrics 渲染后添加：
{metrics && metrics.dailyStats && (
  <div className="mt-6">
    <h2 className="text-2xl font-bold mb-4">趋势分析</h2>
    <TrendChart data={metrics.dailyStats} />
  </div>
)}
```

---

## 🎨 样式建议

- 使用 Tailwind CSS 的暗色模式：在 `app/layout.tsx` 添加 `className="dark"`
- 响应式设计：使用 `md:` 和 `lg:` 前缀
- 间距一致：使用 `space-y-4`、`gap-4` 等

---

## ✅ 完成检查清单

- [ ] shadcn/ui 已初始化
- [ ] 设置页面可用
- [ ] 仪表板显示指标
- [ ] 数据可以刷新
- [ ] 首页正确重定向
- [ ] 错误处理正常显示
- [ ] 移动端响应式正常

---

## 🚀 准备部署

完成后：

```bash
# 1. 运行测试
npm test

# 2. 构建生产版本
npm run build

# 3. 部署到 Vercel
# 访问 vercel.com，导入 GitHub 仓库即可
```

---

## 💡 提示

- 所有已实现的功能都在 `hooks/` 和 `lib/` 中
- 使用 `useSettings` hook 获取配置
- API 端点：`POST /api/copilot/usage`
- 类型定义在 `types/copilot.ts`

有问题随时问我！🎉
