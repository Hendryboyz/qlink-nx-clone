# @org/components

統一的 UI 組件庫,整合 Shadcn UI 和 TailGrids。

## 📦 安裝

此 library 是 monorepo 的一部分,不需要單獨安裝。使用 `@org/components` 路徑別名直接導入。

## 🚀 快速開始

```typescript
import { TGButton, TGInput, TGCheckbox } from '@org/components';

function MyComponent() {
  return (
    <div>
      <TGInput
        label="電子郵件"
        type="email"
        placeholder="your@email.com"
      />
      <TGCheckbox label="同意條款與條件" />
      <TGButton variant="primary">提交</TGButton>
    </div>
  );
}
```

## 📚 可用組件

### TailGrids 組件

| 組件 | 說明 | 狀態 |
|------|------|------|
| **TGButton** | 圓角按鈕,支援多種變體和尺寸 | ✅ 完成 |
| **TGInput** | 輸入框,支援圖標和密碼顯示/隱藏 | ✅ 完成 |
| **TGCheckbox** | 方形核取框,帶打勾圖標 | ✅ 完成 |
| **TGModal** | 確認對話框,支援 4 種類型 | ✅ 完成 |
| **TGToast** | 通知訊息,支援自動關閉和容器管理 | ✅ 完成 |
| **TGOTPInput** | OTP 驗證碼輸入,支援貼上和鍵盤導航 | ✅ 完成 |
| **TGDropdown** | 下拉選單,支援圖標和鍵盤操作 | ✅ 完成 |

### Shadcn UI 組件

| 組件 | 說明 | 狀態 |
|------|------|------|
| **DatePickerWithInput** | 日期選擇器,支援標籤、驗證和日期禁用 | ✅ 完成 |
| **Calendar** | 日曆組件 (DatePicker 依賴) | ✅ 完成 |
| **Popover** | 彈出層組件 (DatePicker 依賴) | ✅ 完成 |
| **Button** | Shadcn 按鈕組件 (DatePicker 依賴) | ✅ 完成 |

## 🎨 開發

### 啟動 Storybook

查看所有組件的互動式文檔:

```bash
nx storybook components
```

Storybook 會在 http://localhost:4400 啟動。

### 執行測試

```bash
nx test components
```

### 建構 Library

```bash
nx build components
```

### Linting

```bash
nx lint components
```

## 🎯 組件 API

### TGButton

```typescript
interface TGButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  loading?: boolean;
}
```

**範例:**

```tsx
<TGButton variant="primary" size="lg" fullWidth>
  提交表單
</TGButton>

<TGButton
  variant="outline"
  icon={<Download className="w-5 h-5" />}
  iconPosition="left"
>
  下載
</TGButton>
```

### TGInput

```typescript
interface TGInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}
```

**範例:**

```tsx
<TGInput
  label="搜尋"
  placeholder="搜尋..."
  leftIcon={<Search className="w-5 h-5" />}
/>

<TGInput
  label="密碼"
  type="password"
  error="密碼至少需要 8 個字元"
/>
```

### TGCheckbox

```typescript
interface TGCheckboxProps {
  label?: string;
  description?: string;
  error?: string;
}
```

**範例:**

```tsx
<TGCheckbox
  label="接收電子郵件通知"
  description="我們會寄送重要更新給你"
/>
```

## 🎨 客製化

### 使用自訂樣式

所有組件都接受 `className` prop,可以使用 Tailwind classes 覆寫樣式:

```tsx
<TGButton className="shadow-xl hover:scale-105 transition-transform">
  自訂按鈕
</TGButton>
```

### 修改全局主題

編輯根目錄的 `tailwind.preset.js` 來修改顏色、字體等:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#你的顏色',
        },
      },
    },
  },
};
```

## 🔧 技術細節

- **框架**: React 18
- **樣式**: Tailwind CSS 3.4
- **打包工具**: Vite
- **類型**: 完整 TypeScript 支援
- **文檔**: Storybook 7

## 📖 更多資訊

完整的規劃文檔請參考: [docs/ui-components-plan.md](../../docs/ui-components-plan.md)

## 🤝 貢獻

1. 所有組件必須有 TypeScript 類型定義
2. 每個組件必須有對應的 Storybook story
3. 遵循 Tailwind CSS 最佳實踐
4. 使用 `cn()` 函數合併 className
