import type { Meta, StoryObj } from '@storybook/react';
import { TGCheckbox } from './checkbox';

const meta: Meta<typeof TGCheckbox> = {
  title: 'TailGrids/Checkbox',
  component: TGCheckbox,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TGCheckbox>;

export const Default: Story = {
  args: {
    label: 'Agree to terms and conditions',
  },
};

export const WithDescription: Story = {
  args: {
    label: 'Receive email notifications',
    description: 'We will send you important updates and promotions',
  },
};

export const Checked: Story = {
  args: {
    label: 'Checked option',
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled option',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: 'Disabled and checked',
    disabled: true,
    defaultChecked: true,
  },
};

export const WithError: Story = {
  args: {
    label: 'Agree to terms and conditions',
    error: 'You must agree to the terms to continue',
  },
};

export const WithoutLabel: Story = {
  args: {},
};

export const MultipleOptions: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <TGCheckbox label="Option 1" />
      <TGCheckbox label="Option 2" defaultChecked />
      <TGCheckbox
        label="Option 3"
        description="This option has additional description"
      />
      <TGCheckbox label="Option 4 (disabled)" disabled />
    </div>
  ),
};
