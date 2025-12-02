import type { Meta, StoryObj } from '@storybook/react';
import TopNav from './top-nav';

const meta: Meta<typeof TopNav> = {
  title: 'Shadcn/TopNav',
  component: TopNav,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TopNav>;

export const Default: Story = {
  render: () => {
    return <TopNav imgSrc='' />;
  },
};

export const SignedIn: Story = {
  render: () => {
    return <TopNav imgSrc='' isSignedIn={true} />;
  },
};
