import type { Meta, StoryObj } from '@storybook/react';
import { RegisterButton } from './register-button';

const meta: Meta<typeof RegisterButton> = {
  title: 'TailGrids/RegisterButton',
  component: RegisterButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof RegisterButton>;

export const Default: Story = {
  render: () => (
    <div className="p-8">
      <RegisterButton onClick={() => alert('Register button clicked!')} />
    </div>
  ),
};

export const Interactive: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-8 p-8">
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-4">Click and hold to see the pressed state</p>
        <RegisterButton onClick={() => console.log('Clicked!')} />
      </div>
    </div>
  ),
};
