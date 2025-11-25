import type { Meta, StoryObj } from '@storybook/react';
import { Toast } from './toast';

const meta: Meta<typeof Toast> = {
  component: Toast,
  title: 'Shadcn/Toast',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Coupon: Story = {
  args: {
    variant: 'default',
    icon: 'TICKET',
    children: 'You just receive a coupon!',
    onViewClick: () => console.log('View clicked'),
  },
};

export const WelcomeGift: Story = {
  args: {
    variant: 'default',
    icon: 'GIFT',
    children: 'Welcome gift redeemed!',
    onViewClick: () => console.log('View clicked'),
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    icon: 'SUCCESS',
    children: 'Product register successful',
    onClose: () => console.log('closed'),
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    icon: 'ERROR',
    children: 'Product register failed',
    onClose: () => console.log('closed'),
  },
};
