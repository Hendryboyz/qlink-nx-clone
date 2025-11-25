import type { Meta, StoryObj } from '@storybook/react';
import Status from './status';

const meta: Meta<typeof Status> = {
  title: 'Shadcn/Status',
  component: Status,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Status>;

export const Default: Story = {
  render: () => {
    return <Status />;
  },
};

export const Peding: Story = {
  render: () => {
    return <Status variant="PENDING" />;
  },
};

export const FAILED: Story = {
  render: () => {
    return <Status variant="FAILED" />;
  },
};
