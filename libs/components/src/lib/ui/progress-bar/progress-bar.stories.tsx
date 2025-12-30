import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from './progress-bar';

const meta: Meta<typeof ProgressBar> = {
  title: 'Shadcn/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {
  render: () => {
    return (
      <div className="w-[350px]">
        <ProgressBar list={['1', '2', '3']} />
      </div>
    );
  },
};

export const Default1: Story = {
  render: () => {
    return (
      <div className="w-[350px]">
        <ProgressBar list={['1', '2', '3']} runningIndex={1} />
      </div>
    );
  },
};

export const Default2: Story = {
  render: () => {
    return (
      <div className="w-[350px]">
        <ProgressBar list={['1', '2', '3']} runningIndex={2} />
      </div>
    );
  },
};
