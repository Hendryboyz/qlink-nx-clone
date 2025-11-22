import type { Meta, StoryObj } from '@storybook/react';
import { TextFieldButton } from './text-field-button';

const meta: Meta<typeof TextFieldButton> = {
  title: 'Shadcn/TextFieldButton',
  component: TextFieldButton,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof TextFieldButton>;

export const Default: Story = {
  args: {
    label: 'Label',
  },
};
