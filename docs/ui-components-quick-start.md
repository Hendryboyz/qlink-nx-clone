# UI 組件庫 - 快速開始指南

> 快速上手 `@org/components` UI 組件庫

## 🎯 已完成項目

✅ 建立 `libs/components` library with Vite
✅ 配置 Tailwind CSS with 共享 preset
✅ 整合 Storybook 7.x
✅ 創建 3 個 TailGrids 組件 (Button, Input, Checkbox)
✅ 所有組件都有完整的 TypeScript 類型和 Stories

## 📁 專案結構

```
qlink-nx-clone/
├── tailwind.preset.js                    # ✅ 共享 Tailwind 配置
├── docs/
│   ├── ui-components-plan.md            # ✅ 完整規劃文檔
│   └── ui-components-quick-start.md     # ✅ 快速開始指南 (本文件)
├── libs/components/                      # ✅ 新建立的 UI library
│   ├── .storybook/                      # ✅ Storybook 配置
│   │   ├── main.ts
│   │   └── preview.ts
│   ├── src/
│   │   ├── lib/
│   │   │   ├── utils.ts                 # ✅ cn() 工具函數
│   │   │   ├── styles.css               # ✅ Tailwind + Shadcn CSS
│   │   │   ├── ui/                      # Shadcn UI 組件 (未來)
│   │   │   └── ui/                      # TailGrids 與 Shadcn 組件
│   │   │       ├── button/              # ✅ TGButton
│   │   │       ├── input/               # ✅ TGInput
│   │   │       └── checkbox/            # ✅ TGCheckbox
│   │   └── index.ts                     # ✅ 統一導出
│   ├── tailwind.config.js               # ✅ 繼承 preset
│   ├── postcss.config.js                # ✅ PostCSS 配置
│   ├── components.json                  # ✅ Shadcn UI 配置
│   ├── project.json                     # ✅ Nx 專案配置
│   └── README.md                        # ✅ 組件庫文檔
└── tsconfig.base.json                   # ✅ 已新增 @org/components 路徑
```

## 🚀 快速使用

### 1. 啟動 Storybook 查看組件

```bash
nx storybook components
```

瀏覽器會自動開啟 http://localhost:4400

### 2. 在應用中使用組件

```typescript
// 在任何應用中 (client, bo 等)
import { TGButton, TGInput, TGCheckbox } from '@org/components';

function LoginForm() {
  return (
    <form className="space-y-4">
      <TGInput
        label="電子郵件"
        type="email"
        placeholder="your@email.com"
      />
      <TGInput
        label="密碼"
        type="password"
        placeholder="輸入密碼"
      />
      <TGCheckbox label="記住我" />
      <TGButton variant="primary" fullWidth>
        登入
      </TGButton>
    </form>
  );
}
```

### 3. 建構 Library

```bash
nx build components
```

## 📦 已安裝的依賴

```json
{
  "class-variance-authority": "^0.7.1",   // Variant 管理
  "clsx": "^2.1.1",                       // 類名組合
  "tailwind-merge": "^3.0.1",             // Tailwind 合併
  "lucide-react": "latest",               // 圖標庫
  "date-fns": "latest",                   // 日期處理
  "@radix-ui/react-popover": "latest",    // Popover primitive
  "@radix-ui/react-dropdown-menu": "latest",
  "@radix-ui/react-checkbox": "latest",
  "@radix-ui/react-dialog": "latest",
  "@radix-ui/react-slot": "latest"
}
```

## 🎨 可用組件

### ✅ TGButton

全功能按鈕組件,支援:
- 4 種變體: primary, secondary, outline, ghost
- 3 種尺寸: sm, md, lg
- 圖標支援 (左側/右側)
- 載入狀態
- 全寬模式

```tsx
<TGButton variant="primary" size="lg">
  提交
</TGButton>
```

### ✅ TGInput

輸入框組件,支援:
- 標籤和錯誤訊息
- 左/右圖標
- 密碼顯示/隱藏切換
- 輔助文字
- 停用狀態

```tsx
<TGInput
  label="搜尋"
  leftIcon={<Search />}
  placeholder="搜尋..."
/>
```

### ✅ TGCheckbox

核取框組件,支援:
- 標籤和說明
- 錯誤狀態
- 停用狀態
- 打勾動畫

```tsx
<TGCheckbox
  label="同意條款"
  description="請詳閱我們的服務條款"
/>
```

## 📋 待完成組件 (按規劃文檔)

以下組件已經在規劃文檔中有完整的實作代碼,可以直接複製使用:

### TGModal
警告/確認對話框,支援:
- 多種類型 (warning, danger, info, success)
- 自訂按鈕文字
- Backdrop 遮罩
- 動畫效果

### TGToast
通知訊息組件,支援:
- 4 種類型 (success, error, warning, info)
- 自動關閉
- 關閉按鈕
- Toast Container 管理

### TGOTPInput
OTP 驗證碼輸入,支援:
- 自訂長度
- 自動聚焦
- 貼上支援
- 錯誤狀態

### TGDropdown
下拉選單組件,支援:
- 選項圖標
- 停用選項
- 錯誤狀態
- 外部點擊關閉

### Shadcn DatePickerWithInput
日期選擇器,整合:
- Calendar 組件
- Popover 組件
- date-fns 格式化

## 🛠️ 下一步驟

### 選項 A: 完成剩餘組件 (推薦)

1. 從 `docs/ui-components-plan.md` 複製組件代碼
2. 創建對應的目錄和檔案
3. 更新 `src/index.ts` 導出
4. 在 Storybook 中測試

### 選項 B: 直接使用現有組件

1. 啟動 Storybook 查看已完成的組件
2. 在 client 應用中開始使用 TGButton, TGInput, TGCheckbox
3. 根據需求逐步添加其他組件

### 選項 C: 客製化現有組件

1. 修改 `tailwind.preset.js` 調整主題
2. 編輯組件檔案添加新功能
3. 更新 Storybook stories 展示新變體

## 📝 常用命令

```bash
# 開發
nx storybook components          # 啟動 Storybook
nx serve client                  # 啟動 client 應用測試組件

# 測試
nx test components               # 執行單元測試
nx lint components               # 檢查程式碼

# 建構
nx build components              # 建構 library
nx build-storybook components    # 建構靜態 Storybook
```

## 🎯 範例: 完整登入表單

```typescript
import { TGButton, TGInput, TGCheckbox } from '@org/components';
import { Mail, Lock } from 'lucide-react';
import { useState } from 'react';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 處理登入邏輯
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold text-center">登入</h1>

      <TGInput
        label="電子郵件"
        type="email"
        placeholder="your@email.com"
        leftIcon={<Mail className="w-5 h-5" />}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error}
      />

      <TGInput
        label="密碼"
        type="password"
        placeholder="輸入密碼"
        leftIcon={<Lock className="w-5 h-5" />}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="flex items-center justify-between">
        <TGCheckbox
          label="記住我"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
        />
        <a href="#" className="text-sm text-primary hover:underline">
          忘記密碼?
        </a>
      </div>

      <TGButton type="submit" variant="primary" fullWidth>
        登入
      </TGButton>

      <div className="text-center text-sm">
        還沒有帳號?{' '}
        <a href="#" className="text-primary hover:underline font-medium">
          立即註冊
        </a>
      </div>
    </form>
  );
}
```

## 💡 提示和最佳實踐

1. **使用 cn() 函數**: 當需要合併 className 時,使用提供的 `cn()` 工具函數
   ```tsx
   import { cn } from '@org/components';
   <TGButton className={cn('mt-4', isActive && 'shadow-lg')} />
   ```

2. **遵循命名規範**: TailGrids 組件使用 `TG` 前綴,Shadcn UI 組件不使用前綴

3. **查看 Storybook**: 所有組件的用法和範例都在 Storybook 中,是最佳的參考資料

4. **TypeScript 支援**: 所有組件都有完整的類型定義,IDE 會提供智能提示

5. **主題一致性**: 修改 `tailwind.preset.js` 而非個別組件,確保設計系統一致

## 🔗 相關連結

- [完整規劃文檔](./ui-components-plan.md)
- [Components Library README](../libs/components/README.md)
- [Shadcn UI 官方文件](https://ui.shadcn.com)
- [TailGrids 組件](https://tailgrids.com/components)
- [Storybook 文件](https://storybook.js.org)

## ✨ 總結

你現在擁有:
- ✅ 完整配置的 UI 組件庫
- ✅ 3 個即用型組件 (Button, Input, Checkbox)
- ✅ Storybook 互動式文檔
- ✅ 完整的實作規劃文檔
- ✅ 共享的 Tailwind 主題系統

接下來可以:
1. 啟動 Storybook 查看組件
2. 在 client 應用中開始使用
3. 根據需求添加更多組件

Happy coding! 🚀
