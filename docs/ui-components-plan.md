# UI 組件庫整合規劃文檔

> **創建日期**: 2025-11-12
> **專案**: qlink-nx-clone
> **目標**: 建立統一的 UI 組件庫 `@org/components`,整合 Shadcn UI 與 TailGrids

---

## 📋 目錄

1. [專案概述](#專案概述)
2. [技術選型](#技術選型)
3. [架構設計](#架構設計)
4. [實施計畫](#實施計畫)
5. [組件清單](#組件清單)
6. [使用指南](#使用指南)
7. [開發規範](#開發規範)

---

## 專案概述

### 背景

目前專案是一個 Nx monorepo,包含:
- **apps/client**: Next.js 14 前端應用
- **apps/bo**: React + Vite 後台管理
- **apps/be**: NestJS 後端 API
- **common/**: 共用業務邏輯 (`@org/common`)
- **types/**: 共用 TypeScript 類型 (`@org/types`)

### 現有技術棧

- **React**: 18.2.0
- **Next.js**: 14.2.4
- **Tailwind CSS**: 3.4.4
- **Nx**: 17.2.4
- **UI 庫**: Ant Design 5.21.0, Radix UI Themes 3.1.3

### 目標

建立一個新的共享 UI 組件庫 `@org/components`,提供:
1. **統一的設計系統**: 基於 Tailwind CSS 的一致性設計
2. **可重用組件**: 封裝 Shadcn UI 和 TailGrids 組件
3. **開發者友善**: 清晰的 API、完整的 TypeScript 支援
4. **可視化展示**: 使用 Storybook 展示所有組件

---

## 技術選型

### 為什麼選擇 Shadcn UI?

| 優勢 | 說明 |
|------|------|
| **完全可客製化** | 組件源碼直接在專案中,可完全控制 |
| **無運行時依賴** | 不像 Ant Design,不會增加 bundle size |
| **基於 Radix UI** | 底層使用無樣式的 Radix UI primitives,可訪問性優秀 |
| **Tailwind 原生** | 與專案現有 Tailwind 配置完美整合 |
| **TypeScript 優先** | 完整的類型支援 |

### 為什麼選擇 TailGrids?

| 優勢 | 說明 |
|------|------|
| **MIT 開源授權** | 可免費用於商業專案 |
| **即用即拷** | 不需要額外依賴,複製代碼即可使用 |
| **Tailwind 原生** | 純 Tailwind CSS 實現 |
| **設計精美** | 提供現代化、專業的 UI 設計 |
| **豐富組件** | 200+ 免費組件可選擇 |

### 為什麼選擇 Storybook?

| 優勢 | 說明 |
|------|------|
| **業界標準** | UI 組件開發和展示的事實標準 |
| **獨立開發環境** | 可獨立於應用開發和測試組件 |
| **互動文檔** | 自動生成可互動的組件文檔 |
| **Nx 原生支援** | Nx 提供官方整合和生成器 |
| **團隊協作** | 設計師和開發者可共同查看組件 |

---

## 架構設計

### 專案結構

```
qlink-nx-clone/
├── tailwind.preset.js              # 共享 Tailwind 主題配置
│
├── apps/
│   ├── client/                     # Next.js 用戶端 (使用 @org/components)
│   │   ├── tailwind.config.js      # 繼承 preset + client 專屬配置
│   │   └── app/globals.css         # 包含 Shadcn UI CSS 變數
│   ├── bo/                         # React 後台 (可選使用 @org/components)
│   └── be/                         # NestJS 後端
│
├── libs/
│   ├── components/                 # 🆕 新建立的 UI 組件庫
│   │   ├── .storybook/
│   │   │   ├── main.ts             # Storybook 主配置
│   │   │   ├── preview.ts          # 全局裝飾器和參數
│   │   │   └── tsconfig.json
│   │   │
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── ui/             # Shadcn UI 組件
│   │   │   │   │   ├── date-picker/
│   │   │   │   │   │   ├── date-picker.tsx
│   │   │   │   │   │   ├── date-picker.stories.tsx
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── calendar/   # Shadcn Calendar (依賴)
│   │   │   │   │   ├── popover/    # Shadcn Popover (依賴)
│   │   │   │   │   └── button/     # Shadcn Button (依賴)
│   │   │   │   │
│   │   │   │   ├── tailgrids/      # TailGrids 包裝組件
│   │   │   │   │   ├── button/
│   │   │   │   │   │   ├── button.tsx
│   │   │   │   │   │   ├── button.stories.tsx
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── toast/
│   │   │   │   │   ├── modal/
│   │   │   │   │   ├── checkbox/
│   │   │   │   │   ├── input/
│   │   │   │   │   ├── otp-input/
│   │   │   │   │   └── dropdown/
│   │   │   │   │
│   │   │   │   └── utils.ts        # cn() 輔助函數
│   │   │   │
│   │   │   └── index.ts             # 統一導出
│   │   │
│   │   ├── tailwind.config.js       # 繼承 preset
│   │   ├── postcss.config.js
│   │   ├── components.json          # Shadcn UI 配置
│   │   ├── tsconfig.json
│   │   ├── tsconfig.lib.json
│   │   ├── tsconfig.storybook.json
│   │   ├── vite.config.ts           # Vite 打包配置
│   │   ├── project.json             # Nx 專案配置
│   │   ├── package.json             # Library 依賴
│   │   └── README.md
│   │
│   ├── common/                      # 現有共用邏輯
│   └── types/                       # 現有共用類型
│
├── package.json                     # Root 依賴
├── nx.json
└── tsconfig.base.json               # 新增 @org/components 路徑別名
```

### 組件分層架構

```
@org/components
│
├── 第一層: Shadcn UI 基礎組件
│   ├── Button, Calendar, Popover, Input...
│   └── 直接從 Shadcn 安裝,可自由修改
│
├── 第二層: TailGrids 包裝組件
│   ├── 從 TailGrids 複製代碼
│   ├── 包裝成 React 組件
│   └── 添加 TypeScript 類型定義
│
├── 第三層: 複合組件
│   ├── DatePickerWithInput (Shadcn DatePicker + Input)
│   ├── ConfirmModal (TailGrids Modal + Button)
│   └── 組合多個基礎組件的高階組件
│
└── 工具層
    ├── utils.ts (cn() 函數)
    ├── hooks/ (共用 React hooks)
    └── constants/ (常數定義)
```

### 命名規範

| 類型 | 規範 | 範例 |
|------|------|------|
| **組件檔案** | kebab-case | `date-picker.tsx` |
| **組件名稱** | PascalCase | `DatePickerWithInput` |
| **Props 介面** | PascalCase + Props 後綴 | `DatePickerWithInputProps` |
| **Story 檔案** | kebab-case.stories.tsx | `date-picker.stories.tsx` |
| **工具函數** | camelCase | `formatDate()` |
| **CSS 類名** | Tailwind utilities | `px-4 py-2 rounded-lg` |

---

## 實施計畫

### Phase 1: 建立基礎架構 (30-45分鐘)

#### 1.1 建立共享 Tailwind Preset

**檔案**: `tailwind.preset.js`

**目的**:
- 提取 client 應用的 Tailwind 主題配置
- 讓所有應用和 library 共享一致的設計 token

**配置內容**:
```javascript
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        'gilroy-regular': ['GilroyRegular', 'sans-serif'],
        'gilroy-medium': ['GilroyMedium', 'sans-serif'],
        'gilroy-bold': ['GilroyBold', 'sans-serif'],
        // ... 其他 Gilroy 字體
      },
      colors: {
        primary: {
          DEFAULT: '#D70127',
          200: '#FF7D7D',
          500: '#A8001E'
        },
        blue: {
          DEFAULT: '#6558f5',
          100: '#7AD7FF',
        },
        // ... 其他顏色
      },
      borderRadius: {
        'xl': '14px',
        '3xl': '27.5px'
      },
      boxShadow: {
        'avatar': '0px 0px 8px 0px rgba(0, 0, 0, 0.25)'
      }
    }
  },
  plugins: []
}
```

#### 1.2 創建 Components Library

**指令**:
```bash
nx g @nx/react:library components --directory=libs/components --bundler=vite --unitTestRunner=jest --component=false
```

**參數說明**:
- `--directory=libs/components`: 放在 libs/ 目錄下
- `--bundler=vite`: 使用 Vite 打包 (快速、現代)
- `--unitTestRunner=jest`: 使用 Jest 測試
- `--component=false`: 不自動生成範例組件

#### 1.3 配置 TypeScript Path Alias

**檔案**: `tsconfig.base.json`

**新增**:
```json
{
  "compilerOptions": {
    "paths": {
      "@org/common": ["common/src/index.ts"],
      "@org/types": ["types/src/index.ts"],
      "@org/components": ["libs/components/src/index.ts"]
    }
  }
}
```

#### 1.4 安裝依賴套件

**指令**:
```bash
# Shadcn UI 核心依賴
npm install class-variance-authority clsx tailwind-merge lucide-react date-fns

# Radix UI primitives (Shadcn 依賴)
npm install @radix-ui/react-popover @radix-ui/react-calendar @radix-ui/react-dropdown-menu @radix-ui/react-checkbox @radix-ui/react-dialog

# Storybook
nx add @nx/storybook@17.2.4
```

**依賴說明**:
- `class-variance-authority`: 類型安全的 variant 管理
- `clsx`: 條件式 className 組合
- `tailwind-merge`: 智能合併 Tailwind classes
- `lucide-react`: 圖標庫
- `date-fns`: 日期處理

#### 1.5 配置 Storybook

**指令**:
```bash
nx g @nx/react:storybook-configuration components --uiFramework=@storybook/react-vite --interactionTests=true
```

**生成檔案**:
- `.storybook/main.ts`: 主配置
- `.storybook/preview.ts`: 全局設置
- `tsconfig.storybook.json`: TypeScript 配置

**手動配置 Tailwind 支援**:

在 `.storybook/preview.ts` 中:
```typescript
import '../src/styles.css'; // 導入 Tailwind

export const parameters = {
  backgrounds: {
    default: 'light',
    values: [
      { name: 'light', value: '#ffffff' },
      { name: 'dark', value: '#1a1a1a' },
    ],
  },
};
```

---

### Phase 2: 整合 Shadcn UI (20-30分鐘)

#### 2.1 初始化 Shadcn UI

**創建 `components.json`**:
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "libs/components/tailwind.config.js",
    "css": "libs/components/src/lib/styles.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@org/components/lib/ui",
    "utils": "@org/components/lib/utils"
  }
}
```

#### 2.2 創建工具函數

**檔案**: `libs/components/src/lib/utils.ts`

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 合併 Tailwind CSS 類名的輔助函數
 * 使用 clsx 處理條件式類名,使用 twMerge 智能合併 Tailwind utilities
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

#### 2.3 創建 Tailwind 樣式檔

**檔案**: `libs/components/src/lib/styles.css`

```css
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

@layer base {
  :root {
    --background: 100% 0 0;
    --foreground: 0% 0 0;
    --card: 100% 0 0;
    --card-foreground: 0% 0 0;
    --popover: 100% 0 0;
    --popover-foreground: 0% 0 0;
    --primary: 0.99 0.15 9.91;
    --primary-foreground: 100% 0 0;
    --secondary: 96.48% 0 0;
    --secondary-foreground: 0% 0 0;
    --muted: 96.48% 0 0;
    --muted-foreground: 45.71% 0.01 256.35;
    --accent: 96.48% 0 0;
    --accent-foreground: 0% 0 0;
    --destructive: 57.49% 0.24 25.38;
    --destructive-foreground: 100% 0 0;
    --border: 91.43% 0.01 256.35;
    --input: 91.43% 0.01 256.35;
    --ring: 0.99 0.15 9.91;
    --radius: 0.5rem;
  }
}
```

#### 2.4 安裝 Shadcn Date Picker

**步驟**:

1. 安裝基礎組件:
```bash
npx shadcn@latest add calendar
npx shadcn@latest add popover
npx shadcn@latest add button
npx shadcn@latest add input
```

2. 創建包裝組件:

**檔案**: `libs/components/src/lib/ui/date-picker/date-picker.tsx`

```typescript
'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '../../utils';
import { Button } from '../button/button';
import { Calendar } from '../calendar/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../popover/popover';

export interface DatePickerWithInputProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  format?: string;
}

export function DatePickerWithInput({
  value,
  onChange,
  placeholder = '選擇日期',
  disabled = false,
  className,
  format: dateFormat = 'PPP',
}: DatePickerWithInputProps) {
  const [date, setDate] = React.useState<Date | undefined>(value);

  React.useEffect(() => {
    setDate(value);
  }, [value]);

  const handleSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    onChange?.(newDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground',
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, dateFormat) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
```

---

### Phase 3: 整合 TailGrids 組件 (40-60分鐘)

以下是 8 個需要整合的 TailGrids 組件詳細規格:

#### 3.1 Primary Full Rounded Button With Icon

**來源**: https://tailgrids.com/components/buttons

**檔案**: `libs/components/src/lib/tailgrids/button/button.tsx`

```typescript
import * as React from 'react';
import { cn } from '../../utils';

export interface TGButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  loading?: boolean;
}

export const TGButton = React.forwardRef<HTMLButtonElement, TGButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      icon,
      iconPosition = 'left',
      fullWidth = false,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-primary text-white hover:bg-primary-500 focus:ring-primary',
      secondary: 'bg-blue text-white hover:bg-blue-600 focus:ring-blue',
      outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
      ghost: 'text-primary hover:bg-primary-50 focus:ring-primary',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>載入中...</span>
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && icon}
            {children}
            {icon && iconPosition === 'right' && icon}
          </>
        )}
      </button>
    );
  }
);

TGButton.displayName = 'TGButton';
```

**Story 檔案**: `button.stories.tsx`

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { TGButton } from './button';
import { ArrowRight, Download, Plus } from 'lucide-react';

const meta: Meta<typeof TGButton> = {
  title: 'TailGrids/Button',
  component: TGButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    iconPosition: {
      control: 'radio',
      options: ['left', 'right'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof TGButton>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
};

export const WithIcon: Story = {
  args: {
    children: 'Download',
    variant: 'primary',
    icon: <Download className="w-5 h-5" />,
    iconPosition: 'left',
  },
};

export const Loading: Story = {
  args: {
    children: 'Submit',
    variant: 'primary',
    loading: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <TGButton variant="primary">Primary</TGButton>
      <TGButton variant="secondary">Secondary</TGButton>
      <TGButton variant="outline">Outline</TGButton>
      <TGButton variant="ghost">Ghost</TGButton>
    </div>
  ),
};
```

#### 3.2 Primary Confirmation Toast with Close Button

**來源**: https://tailgrids.com/components/toast

**檔案**: `libs/components/src/lib/tailgrids/toast/toast.tsx`

```typescript
'use client';

import * as React from 'react';
import { cn } from '../../utils';
import { X, CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';

export interface TGToastProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseDuration?: number;
  className?: string;
}

const icons = {
  success: <CheckCircle className="w-6 h-6" />,
  error: <XCircle className="w-6 h-6" />,
  warning: <AlertCircle className="w-6 h-6" />,
  info: <Info className="w-6 h-6" />,
};

const typeStyles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-orange-50 border-orange-200 text-orange-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const iconStyles = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-orange-500',
  info: 'text-blue-500',
};

export function TGToast({
  type = 'success',
  title,
  message,
  onClose,
  autoClose = true,
  autoCloseDuration = 5000,
  className,
}: TGToastProps) {
  React.useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(onClose, autoCloseDuration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDuration, onClose]);

  return (
    <div
      className={cn(
        'flex items-start gap-4 p-4 rounded-lg border-2 shadow-lg max-w-md',
        typeStyles[type],
        className
      )}
      role="alert"
    >
      <div className={cn('flex-shrink-0 mt-0.5', iconStyles[type])}>
        {icons[type]}
      </div>
      <div className="flex-1 min-w-0">
        {title && (
          <p className="font-semibold text-sm mb-1">{title}</p>
        )}
        <p className="text-sm">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="關閉"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

// Toast Container for managing multiple toasts
export interface ToastContainerProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  children: React.ReactNode;
}

const positionStyles = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
};

export function TGToastContainer({ position = 'top-right', children }: ToastContainerProps) {
  return (
    <div className={cn('fixed z-50 flex flex-col gap-2', positionStyles[position])}>
      {children}
    </div>
  );
}
```

#### 3.3 Warning Modal with Confirmation Button

**來源**: https://tailgrids.com/components/modals

**檔案**: `libs/components/src/lib/tailgrids/modal/modal.tsx`

```typescript
'use client';

import * as React from 'react';
import { cn } from '../../utils';
import { X, AlertTriangle } from 'lucide-react';
import { TGButton } from '../button/button';

export interface TGModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  type?: 'warning' | 'danger' | 'info' | 'success';
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  showCloseButton?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const typeConfig = {
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-orange-500',
    iconBgColor: 'bg-orange-100',
  },
  danger: {
    icon: X,
    iconColor: 'text-red-500',
    iconBgColor: 'bg-red-100',
  },
  info: {
    icon: AlertTriangle,
    iconColor: 'text-blue-500',
    iconBgColor: 'bg-blue-100',
  },
  success: {
    icon: AlertTriangle,
    iconColor: 'text-green-500',
    iconBgColor: 'bg-green-100',
  },
};

export function TGModal({
  open,
  onClose,
  title,
  description,
  type = 'warning',
  confirmText = '確認',
  cancelText = '取消',
  onConfirm,
  onCancel,
  showCloseButton = true,
  className,
  children,
}: TGModalProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className={cn(
          'relative bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-md w-full mx-4',
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Close Button */}
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="關閉"
          >
            <X className="w-6 h-6" />
          </button>
        )}

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className={cn('p-3 rounded-full', config.iconBgColor)}>
            <Icon className={cn('w-8 h-8', config.iconColor)} />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h3 id="modal-title" className="text-xl font-bold text-gray-900 mb-2">
            {title}
          </h3>
          {description && (
            <p className="text-gray-600 text-sm">{description}</p>
          )}
          {children && <div className="mt-4">{children}</div>}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <TGButton
            variant="outline"
            fullWidth
            onClick={handleCancel}
          >
            {cancelText}
          </TGButton>
          <TGButton
            variant="primary"
            fullWidth
            onClick={handleConfirm}
          >
            {confirmText}
          </TGButton>
        </div>
      </div>
    </div>
  );
}
```

#### 3.4 Square Checkbox with Checkmark Icon

**來源**: https://tailgrids.com/components/checkbox

**檔案**: `libs/components/src/lib/tailgrids/checkbox/checkbox.tsx`

```typescript
'use client';

import * as React from 'react';
import { cn } from '../../utils';
import { Check } from 'lucide-react';

export interface TGCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: string;
  containerClassName?: string;
}

export const TGCheckbox = React.forwardRef<HTMLInputElement, TGCheckboxProps>(
  ({ className, label, description, error, containerClassName, id, ...props }, ref) => {
    const checkboxId = id || React.useId();

    return (
      <div className={cn('flex items-start gap-3', containerClassName)}>
        <div className="relative flex items-center">
          <input
            type="checkbox"
            ref={ref}
            id={checkboxId}
            className={cn(
              'peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-gray-300',
              'transition-all checked:bg-primary checked:border-primary',
              'hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          />
          <Check
            className={cn(
              'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
              'w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity'
            )}
            strokeWidth={3}
          />
        </div>
        {(label || description) && (
          <div className="flex-1">
            {label && (
              <label
                htmlFor={checkboxId}
                className={cn(
                  'text-sm font-medium text-gray-900 cursor-pointer',
                  props.disabled && 'cursor-not-allowed opacity-50'
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-xs text-gray-500 mt-0.5">{description}</p>
            )}
            {error && (
              <p className="text-xs text-red-500 mt-0.5">{error}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

TGCheckbox.displayName = 'TGCheckbox';
```

#### 3.5 Input Field Variations

**來源**: https://tailgrids.com/components/form-elements

**檔案**: `libs/components/src/lib/tailgrids/input/input.tsx`

```typescript
'use client';

import * as React from 'react';
import { cn } from '../../utils';
import { Eye, EyeOff } from 'lucide-react';

export interface TGInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  fullWidth?: boolean;
}

export const TGInput = React.forwardRef<HTMLInputElement, TGInputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      containerClassName,
      fullWidth = true,
      type,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const inputId = id || React.useId();
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className={cn(
              'w-full px-4 py-2.5 rounded-lg border-2 border-gray-300',
              'bg-white text-gray-900 text-sm',
              'placeholder:text-gray-400',
              'transition-colors',
              'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
              'hover:border-gray-400',
              'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
              leftIcon && 'pl-10',
              (rightIcon || isPassword) && 'pr-10',
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}
          {rightIcon && !isPassword && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        {(error || helperText) && (
          <p className={cn('text-xs', error ? 'text-red-500' : 'text-gray-500')}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

TGInput.displayName = 'TGInput';
```

#### 3.6 OTP Input

**來源**: https://tailgrids.com/components/verification-code-inputs

**檔案**: `libs/components/src/lib/tailgrids/otp-input/otp-input.tsx`

```typescript
'use client';

import * as React from 'react';
import { cn } from '../../utils';

export interface TGOTPInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  error?: boolean;
  disabled?: boolean;
  className?: string;
}

export function TGOTPInput({
  length = 6,
  value = '',
  onChange,
  onComplete,
  error = false,
  disabled = false,
  className,
}: TGOTPInputProps) {
  const [otp, setOtp] = React.useState<string[]>(Array(length).fill(''));
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  React.useEffect(() => {
    if (value) {
      const otpArray = value.split('').slice(0, length);
      setOtp([...otpArray, ...Array(length - otpArray.length).fill('')]);
    }
  }, [value, length]);

  const handleChange = (index: number, newValue: string) => {
    if (disabled) return;

    // Only allow numbers
    if (newValue && !/^\d+$/.test(newValue)) return;

    const newOtp = [...otp];
    newOtp[index] = newValue.slice(-1); // Take only the last character
    setOtp(newOtp);

    const otpString = newOtp.join('');
    onChange?.(otpString);

    // Move to next input if value is entered
    if (newValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Call onComplete if all fields are filled
    if (newOtp.every((digit) => digit !== '') && onComplete) {
      onComplete(otpString);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input on backspace if current input is empty
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split('');
    setOtp([...newOtp, ...Array(length - newOtp.length).fill('')]);
    onChange?.(pastedData);

    // Focus the next empty input or the last input
    const nextEmptyIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[nextEmptyIndex]?.focus();

    if (newOtp.length === length && onComplete) {
      onComplete(pastedData);
    }
  };

  return (
    <div className={cn('flex gap-2 justify-center', className)}>
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={cn(
            'w-12 h-14 text-center text-2xl font-semibold',
            'rounded-lg border-2 border-gray-300',
            'bg-white text-gray-900',
            'transition-all',
            'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
            'hover:border-gray-400',
            'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
          )}
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  );
}
```

#### 3.7 Simple Dropdown Button

**來源**: https://tailgrids.com/components/dropdown-buttons

**檔案**: `libs/components/src/lib/tailgrids/dropdown/dropdown.tsx`

```typescript
'use client';

import * as React from 'react';
import { cn } from '../../utils';
import { ChevronDown } from 'lucide-react';

export interface DropdownOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TGDropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
  label?: string;
}

export function TGDropdown({
  options,
  value,
  onChange,
  placeholder = '請選擇',
  disabled = false,
  className,
  error,
  label,
}: TGDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: DropdownOption) => {
    if (option.disabled) return;
    onChange?.(option.value);
    setIsOpen(false);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            'w-full flex items-center justify-between gap-2',
            'px-4 py-2.5 rounded-lg border-2 border-gray-300',
            'bg-white text-sm text-left',
            'transition-colors',
            'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
            'hover:border-gray-400',
            'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            className
          )}
        >
          <span className={cn('flex items-center gap-2', !selectedOption && 'text-gray-400')}>
            {selectedOption?.icon}
            {selectedOption?.label || placeholder}
          </span>
          <ChevronDown
            className={cn(
              'w-5 h-5 text-gray-400 transition-transform',
              isOpen && 'rotate-180'
            )}
          />
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option)}
                disabled={option.disabled}
                className={cn(
                  'w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left',
                  'transition-colors',
                  'hover:bg-gray-50',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  value === option.value && 'bg-primary/5 text-primary font-medium'
                )}
              >
                {option.icon}
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
```

---

### Phase 4: 編寫 Storybook Stories (30-40分鐘)

每個組件都需要對應的 `.stories.tsx` 檔案。以下是通用範本:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from './component-name';

const meta: Meta<typeof ComponentName> = {
  title: 'Category/ComponentName',
  component: ComponentName,
  tags: ['autodocs'],
  argTypes: {
    // Define controls for props
  },
};

export default meta;
type Story = StoryObj<typeof ComponentName>;

export const Default: Story = {
  args: {
    // Default props
  },
};

export const Variant1: Story = {
  args: {
    // Variant props
  },
};

// Interactive playground
export const Playground: Story = {
  render: (args) => <ComponentName {...args} />,
};
```

---

### Phase 5: 文檔與整合 (15-20分鐘)

#### 5.1 創建 Library README

**檔案**: `libs/components/README.md`

```markdown
# @org/components

統一的 UI 組件庫,整合 Shadcn UI 和 TailGrids。

## 安裝

此 library 是 monorepo 的一部分,不需要單獨安裝。

## 使用方式

```typescript
import { DatePickerWithInput, TGButton, TGInput } from '@org/components';

function MyComponent() {
  return (
    <div>
      <DatePickerWithInput placeholder="選擇日期" />
      <TGButton variant="primary">提交</TGButton>
      <TGInput label="電子郵件" type="email" />
    </div>
  );
}
```

## 開發

### 啟動 Storybook

```bash
nx storybook components
```

### 執行測試

```bash
nx test components
```

### 建構 Library

```bash
nx build components
```

## 組件清單

### Shadcn UI 組件
- DatePickerWithInput
- Calendar
- Popover
- Button

### TailGrids 組件
- TGButton
- TGToast / TGToastContainer
- TGModal
- TGCheckbox
- TGInput
- TGOTPInput
- TGDropdown

## 貢獻指南

1. 所有組件必須有對應的 TypeScript 類型定義
2. 每個組件必須有 Storybook story
3. 遵循 Tailwind CSS 最佳實踐
4. 使用 `cn()` 函數合併 className
```

#### 5.2 更新 Client 應用

**更新 `apps/client/tailwind.config.js`**:

```javascript
const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

module.exports = {
  presets: [require('../../tailwind.preset.js')],
  content: [
    join(__dirname, '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      // Client 專屬覆寫
    },
  },
};
```

**在 Client 中使用**:

```typescript
// apps/client/app/example/page.tsx
import { DatePickerWithInput, TGButton } from '@org/components';

export default function ExamplePage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">使用 @org/components</h1>
      <DatePickerWithInput placeholder="選擇日期" />
      <TGButton variant="primary" className="mt-4">
        提交表單
      </TGButton>
    </div>
  );
}
```

---

## 組件清單

| # | 組件名稱 | 來源 | 類型 | 狀態 |
|---|---------|------|------|------|
| 1 | DatePickerWithInput | Shadcn | 複合組件 | 待實作 |
| 2 | TGButton | TailGrids | 基礎組件 | 待實作 |
| 3 | TGToast | TailGrids | 提示組件 | 待實作 |
| 4 | TGModal | TailGrids | 對話框組件 | 待實作 |
| 5 | TGCheckbox | TailGrids | 表單組件 | 待實作 |
| 6 | TGInput | TailGrids | 表單組件 | 待實作 |
| 7 | TGOTPInput | TailGrids | 表單組件 | 待實作 |
| 8 | TGDropdown | TailGrids | 表單組件 | 待實作 |

---

## 使用指南

### 開發工作流程

```bash
# 1. 啟動 Storybook 開發伺服器
nx storybook components

# 2. 在瀏覽器中查看組件 (通常是 http://localhost:4400)

# 3. 編輯組件檔案,Storybook 會自動熱重載

# 4. 執行測試
nx test components

# 5. 建構 library
nx build components
```

### 在應用中使用

```typescript
// 1. 直接導入組件
import { TGButton, DatePickerWithInput } from '@org/components';

// 2. 在 JSX 中使用
<TGButton variant="primary" size="lg">
  點擊我
</TGButton>

// 3. 使用自定義 className (會自動合併)
<TGButton
  variant="primary"
  className="mt-4 shadow-lg"
>
  自定義樣式
</TGButton>
```

### 客製化主題

修改 `tailwind.preset.js` 來客製化全局主題:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#Your-Color',  // 修改主色
          // ...
        },
      },
    },
  },
};
```

---

## 開發規範

### 組件設計原則

1. **單一職責**: 每個組件只做一件事
2. **可組合性**: 組件應該可以組合成更複雜的 UI
3. **可訪問性**: 遵循 WCAG 2.1 AA 標準
4. **TypeScript 優先**: 所有 props 必須有類型定義
5. **受控/非受控**: 支援兩種模式 (使用 React hooks)

### 程式碼風格

```typescript
// ✅ 好的寫法
export interface ComponentProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
}

export const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('base-styles', variantStyles[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Component.displayName = 'Component';
```

### 測試策略

```typescript
// ComponentName.spec.tsx
import { render, screen } from '@testing-library/react';
import { ComponentName } from './component-name';

describe('ComponentName', () => {
  it('should render successfully', () => {
    render(<ComponentName />);
    expect(screen.getByRole('...')).toBeInTheDocument();
  });

  it('should handle user interactions', () => {
    // Test user interactions
  });

  it('should be accessible', () => {
    // Test accessibility
  });
});
```

---

## 技術規格

### 依賴版本

| 套件 | 版本 | 用途 |
|------|------|------|
| React | ^18.2.0 | UI 框架 |
| Tailwind CSS | ^3.4.4 | 樣式框架 |
| class-variance-authority | ^0.7.1 | Variant 管理 |
| clsx | ^2.1.1 | 類名組合 |
| tailwind-merge | ^3.0.1 | Tailwind 類名合併 |
| lucide-react | latest | 圖標庫 |
| date-fns | latest | 日期處理 |
| @radix-ui/react-* | latest | 無障礙 UI primitives |

### 瀏覽器支援

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

### 效能指標

- Bundle size: < 50KB (gzipped)
- First paint: < 100ms
- Tree-shakable: ✅
- TypeScript 支援: ✅

---

## 常見問題

### Q: 為什麼選擇 Vite 而非 Webpack?

A: Vite 提供更快的開發體驗和建構速度,且與 Nx 整合良好。

### Q: 可以在 Next.js 中使用 'use client' 組件嗎?

A: 可以,部分組件已標記為 'use client' (例如 DatePicker, Modal),可在 Next.js App Router 中使用。

### Q: 如何覆寫組件樣式?

A: 所有組件都接受 `className` prop,使用 `cn()` 函數可安全地覆寫樣式:

```typescript
<TGButton className="bg-blue-500 hover:bg-blue-600">
  覆寫顏色
</TGButton>
```

### Q: 如何添加新組件?

A:
1. 在 `libs/components/src/lib/` 下創建新組件資料夾
2. 編寫組件和類型定義
3. 創建 `.stories.tsx` 檔案
4. 在 `index.ts` 中導出
5. 執行測試確保無誤

---

## 路線圖

### v1.0 (當前版本)
- ✅ Shadcn UI Date Picker
- ✅ TailGrids 8 個基礎組件
- ✅ Storybook 整合
- ✅ TypeScript 支援

### v1.1 (未來計畫)
- [ ] 主題系統 (深色模式)
- [ ] 更多 Shadcn UI 組件 (Table, Select, Tabs)
- [ ] 動畫效果增強
- [ ] 可訪問性測試套件

### v2.0 (長期計畫)
- [ ] 表單驗證整合 (React Hook Form)
- [ ] 國際化支援 (i18n)
- [ ] 移動端優化
- [ ] 設計系統文檔網站

---

## 授權

此專案使用的開源組件授權:
- Shadcn UI: MIT License
- TailGrids: MIT License (免費版)
- Radix UI: MIT License
- Lucide Icons: ISC License

---

## 聯絡方式

如有問題或建議,請聯絡開發團隊。

**最後更新**: 2025-11-12
