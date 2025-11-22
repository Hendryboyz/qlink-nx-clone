import type { Meta, StoryObj } from '@storybook/react';
import Footer from './footer';

const meta: Meta<typeof Footer> = {
  title: 'Shadcn/Footer',
  component: Footer,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Guset: Story = {
  render: () => {
    return <Footer />;
  },
};

export const SignedIn: Story = {
  render: () => {
    return <Footer isSignedIn />;
  },
};
