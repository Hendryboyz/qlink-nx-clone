import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import BottomNav from './bottom-nav';

const meta: Meta<typeof BottomNav> = {
  title: 'Shadcn/BottomNav',
  component: BottomNav,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BottomNav>;

export const Default: Story = {
  render: () => {
    const [activeItem, setActiveItem] = useState<string>();
    return (
      <BottomNav
        activeItem={activeItem}
        onItemClick={(str) => setActiveItem(str)}
      />
    );
  },
};
