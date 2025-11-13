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

export const WithLeftIcon: Story = {
  args: {
    children: 'Download',
    variant: 'primary',
    icon: <Download className="w-5 h-5" />,
    iconPosition: 'left',
  },
};

export const WithRightIcon: Story = {
  args: {
    children: 'Next',
    variant: 'primary',
    icon: <ArrowRight className="w-5 h-5" />,
    iconPosition: 'right',
  },
};

export const Loading: Story = {
  args: {
    children: 'Submit',
    variant: 'primary',
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    variant: 'primary',
    disabled: true,
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

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <TGButton size="sm">Small</TGButton>
      <TGButton size="md">Medium</TGButton>
      <TGButton size="lg">Large</TGButton>
    </div>
  ),
};

export const FullWidth: Story = {
  args: {
    children: 'Full Width Button',
    variant: 'primary',
    fullWidth: true,
  },
};

// Diagnostic story to test if Tailwind is working
export const TailwindTest: Story = {
  render: () => (
    <div className="space-y-4 p-4">
      <div className="bg-primary text-white p-4 rounded">Primary Color Test (should be red #D70127)</div>
      <div className="bg-blue text-white p-4 rounded">Blue Color Test (should be #6558f5)</div>
      <div className="bg-gray-300 text-gray-700 p-4 rounded">Gray 300 Test (should be #D9D9D9)</div>
      <button className="bg-primary text-white border border-primary hover:bg-[#1B44C8] px-7 py-3 rounded-full">
        Direct Tailwind Test
      </button>
    </div>
  ),
};
