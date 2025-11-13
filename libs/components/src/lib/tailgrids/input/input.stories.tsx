import type { Meta, StoryObj } from '@storybook/react';
import { TGInput } from './input';
import { Mail, Search, User } from 'lucide-react';

const meta: Meta<typeof TGInput> = {
  title: 'TailGrids/Input',
  component: TGInput,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TGInput>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Email',
    placeholder: 'your@email.com',
    type: 'email',
  },
};

export const WithLeftIcon: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search...',
    leftIcon: <Search className="w-5 h-5" />,
  },
};

export const WithRightIcon: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter username',
    rightIcon: <User className="w-5 h-5" />,
  },
};

export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter password',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'your@email.com',
    type: 'email',
    error: 'Please enter a valid email address',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Username',
    placeholder: 'john_doe',
    helperText: 'Only letters, numbers and underscores',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    placeholder: 'Cannot type',
    disabled: true,
  },
};

export const AllVariations: Story = {
  render: () => (
    <div className="flex flex-col gap-6 max-w-md">
      <TGInput label="Basic Input" placeholder="Enter text" />
      <TGInput
        label="With Icon"
        placeholder="Search..."
        leftIcon={<Search className="w-5 h-5" />}
      />
      <TGInput
        label="Password"
        type="password"
        placeholder="Enter password"
      />
      <TGInput
        label="Error State"
        placeholder="Error input"
        error="This field has an error"
      />
      <TGInput
        label="Disabled"
        placeholder="Disabled state"
        disabled
      />
    </div>
  ),
};
