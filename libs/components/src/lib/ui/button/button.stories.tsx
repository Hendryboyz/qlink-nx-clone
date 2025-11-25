import type { Meta, StoryObj } from '@storybook/react';
import { TGButton } from './button';
import { ArrowRight, Download, Plus } from 'lucide-react';
import { ReactComponent as GiftIcon } from './assets/gift.svg';

const meta: Meta<typeof TGButton> = {
  title: 'TailGrids/Button',
  component: TGButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'white'],
    },
    size: {
      control: 'select',
      options: ['xl', 'lg', 'md', 'sm'],
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
    children: 'OK',
    variant: 'primary',
    size: 'lg',
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <TGButton variant="primary" size="lg">OK</TGButton>
      <TGButton variant="outline" size="lg">OK</TGButton>
      <TGButton variant="ghost" size="lg">OK</TGButton>
      <TGButton variant="primary" size="lg" disabled>OK</TGButton>
    </div>
  ),
};

export const WithGiftIcon: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <TGButton variant="primary" icon={<GiftIcon className="w-4 h-4" />} iconPosition="left" size="lg">
        OK
      </TGButton>
      <TGButton variant="outline" icon={<GiftIcon className="w-4 h-4" />} iconPosition="left" size="lg">
        OK
      </TGButton>
      <TGButton variant="ghost" icon={<GiftIcon className="w-4 h-4" />} iconPosition="left" size="lg">
        OK
      </TGButton>
      <TGButton variant="primary" icon={<GiftIcon className="w-4 h-4" />} iconPosition="left" size="lg" disabled>
        OK
      </TGButton>
    </div>
  ),
};

export const Loading: Story = {
  args: {
    children: 'Submit',
    variant: 'primary',
    size: 'lg',
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    variant: 'primary',
    size: 'lg',
    disabled: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <TGButton variant="primary" size="lg">Primary</TGButton>
      <TGButton variant="secondary" size="lg">Secondary</TGButton>
      <TGButton variant="outline" size="lg">Outline</TGButton>
      <TGButton variant="ghost" size="lg">Ghost</TGButton>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <TGButton size="xl">Extra Large</TGButton>
      <TGButton size="lg">Large</TGButton>
      <TGButton size="md">Medium</TGButton>
      <TGButton size="sm">SM</TGButton>
    </div>
  ),
};

export const FullWidth: Story = {
  args: {
    children: 'Full Width Button',
    variant: 'primary',
    size: 'lg',
    fullWidth: true,
  },
};

export const WhiteVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start bg-gray-100 p-6">
      <div className="text-sm font-semibold text-gray-600">White background variants:</div>
      <TGButton variant="outline" size="lg">
        Outline (with border)
      </TGButton>
      <TGButton variant="white" size="lg">
        White (no border)
      </TGButton>
    </div>
  ),
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
