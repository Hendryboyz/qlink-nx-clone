import type { Meta, StoryObj } from '@storybook/react';

// Color palette display component
const ColorPalette = () => {
  return <div>Design System Colors</div>;
};

const meta: Meta<typeof ColorPalette> = {
  title: 'Design System/Colors & Effects',
  component: ColorPalette,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ColorPalette>;

// Color swatch component for displaying individual colors
const ColorSwatch = ({
  name,
  className,
  hexCode,
  description
}: {
  name: string;
  className: string;
  hexCode: string;
  description?: string;
}) => (
  <div className="flex flex-col gap-2">
    <div className={`w-32 h-32 rounded-lg ${className} shadow-md flex items-end p-3`}>
      <span className={`text-xs font-medium ${
        name.includes('Primary') || name.includes('Tertiary') || name.includes('Error') || name.includes('Success')
          ? 'text-white'
          : 'text-text-str'
      }`}>
        {hexCode}
      </span>
    </div>
    <div>
      <p className="font-semibold text-sm">{name}</p>
      {description && <p className="text-xs text-text-w">{description}</p>}
    </div>
  </div>
);

// Brand Colors Story
export const BrandColors: Story = {
  render: () => (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Brand Colors</h2>
      <div className="flex gap-6 flex-wrap">
        <ColorSwatch
          name="Primary"
          className="bg-primary"
          hexCode="#D70127"
          description="Main brand color"
        />
        <ColorSwatch
          name="Secondary"
          className="bg-secondary"
          hexCode="#F5F5F5"
          description="Light background"
        />
        <ColorSwatch
          name="Tertiary"
          className="bg-tertiary"
          hexCode="#1A1A1A"
          description="Dark text/background"
        />
      </div>
    </div>
  ),
};

// Semantic Colors Story
export const SemanticColors: Story = {
  render: () => (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Semantic Colors</h2>
      <div className="flex gap-6 flex-wrap">
        <ColorSwatch
          name="Error"
          className="bg-error"
          hexCode="#CA0000"
          description="Error states"
        />
        <ColorSwatch
          name="Warning"
          className="bg-warning"
          hexCode="#FFB800"
          description="Warning states"
        />
        <ColorSwatch
          name="Success"
          className="bg-success"
          hexCode="#10B700"
          description="Success states"
        />
      </div>
    </div>
  ),
};

// Grayscale Colors Story
export const GrayscaleColors: Story = {
  render: () => (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Grayscale Colors</h2>
      <div className="flex gap-6 flex-wrap">
        <ColorSwatch
          name="Text Strong"
          className="bg-text-str"
          hexCode="#1A1A1A"
          description="Primary text"
        />
        <ColorSwatch
          name="Text Weak"
          className="bg-text-w"
          hexCode="#343434"
          description="Secondary text"
        />
        <ColorSwatch
          name="Stroke Strong"
          className="bg-stroke-s"
          hexCode="#777777"
          description="Strong borders"
        />
        <ColorSwatch
          name="Stroke Weak"
          className="bg-stroke-w"
          hexCode="#80BDBD"
          description="Weak borders"
        />
        <ColorSwatch
          name="Background"
          className="bg-bg border border-stroke-s"
          hexCode="#F5F5F5"
          description="Page background"
        />
        <ColorSwatch
          name="Fill"
          className="bg-fill border border-stroke-s"
          hexCode="#FFFFFF"
          description="White fill"
        />
      </div>
    </div>
  ),
};


// Shadow Effects Story
export const ShadowEffects: Story = {
  render: () => (
    <div className="p-8 bg-gray-100">
      <h2 className="text-2xl font-bold mb-6">Shadow Effects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold">Card Effect</h3>
          <div className="shadow-effect-card bg-white p-6 rounded-lg">
            <p className="text-sm text-gray-600">box-shadow: 0px 4px 3px 0px rgba(0, 0, 0, 0.25)</p>
            <p className="mt-2 text-xs text-gray-500">Class: .shadow-effect-card</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-semibold">Flag Effect</h3>
          <div className="shadow-effect-flag bg-white p-6 rounded-lg">
            <p className="text-sm text-gray-600">box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.25)</p>
            <p className="mt-2 text-xs text-gray-500">Class: .shadow-effect-flag</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-semibold">Overlay Effect</h3>
          <div className="shadow-effect-overlay bg-white p-6 rounded-lg">
            <p className="text-sm text-gray-600">box-shadow: 0px 4px 15px 0px rgba(0, 0, 0, 0.25)</p>
            <p className="mt-2 text-xs text-gray-500">Class: .shadow-effect-overlay</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-semibold">Overlay Strong Effect</h3>
          <div className="shadow-effect-overlay-strong bg-white p-6 rounded-lg">
            <p className="text-sm text-gray-600">box-shadow: 0px 4px 15px 0px rgba(0, 0, 0, 0.5)</p>
            <p className="mt-2 text-xs text-gray-500">Class: .shadow-effect-overlay-strong</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-semibold">Button Effect</h3>
          <div className="shadow-effect-button bg-white p-6 rounded-lg">
            <p className="text-sm text-gray-600">box-shadow: -2px -4px 4px 0px rgba(0, 0, 0, 0.25) inset</p>
            <p className="mt-2 text-xs text-gray-500">Class: .shadow-effect-button</p>
          </div>
        </div>
      </div>
    </div>
  ),
};

// Typography Story
export const Typography: Story = {
  render: () => (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Typography</h2>

      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Manrope (UI Font)</h3>
          <div className="space-y-3">
            <p className="font-manrope text-2xl">Manrope Regular - The quick brown fox jumps over the lazy dog</p>
            <p className="font-manrope-medium text-2xl">Manrope Medium - The quick brown fox jumps over the lazy dog</p>
            <p className="font-manrope-semibold text-2xl">Manrope SemiBold - The quick brown fox jumps over the lazy dog</p>
            <p className="font-manrope-bold text-2xl">Manrope Bold - The quick brown fox jumps over the lazy dog</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Poppins (Campaign Font)</h3>
          <div className="space-y-3">
            <p className="font-poppins text-2xl">Poppins Regular - The quick brown fox jumps over the lazy dog</p>
            <p className="font-poppins-medium text-2xl">Poppins Medium - The quick brown fox jumps over the lazy dog</p>
            <p className="font-poppins-semibold text-2xl">Poppins SemiBold - The quick brown fox jumps over the lazy dog</p>
            <p className="font-poppins-bold text-2xl">Poppins Bold - The quick brown fox jumps over the lazy dog</p>
          </div>
        </div>

      </div>
    </div>
  ),
};

// All Colors Overview
export const AllColors: Story = {
  render: () => (
    <div className="p-8 space-y-12">
      <div>
        <h2 className="text-3xl font-bold mb-6">Design System - Complete Color Palette</h2>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Brand Colors</h3>
        <div className="flex gap-6 flex-wrap">
          <ColorSwatch name="Primary" className="bg-primary" hexCode="#D70127" />
          <ColorSwatch name="Secondary" className="bg-secondary" hexCode="#F5F5F5" />
          <ColorSwatch name="Tertiary" className="bg-tertiary" hexCode="#1A1A1A" />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Semantic Colors</h3>
        <div className="flex gap-6 flex-wrap">
          <ColorSwatch name="Error" className="bg-error" hexCode="#CA0000" />
          <ColorSwatch name="Warning" className="bg-warning" hexCode="#FFB800" />
          <ColorSwatch name="Success" className="bg-success" hexCode="#10B700" />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Grayscale</h3>
        <div className="flex gap-6 flex-wrap">
          <ColorSwatch name="Text Strong" className="bg-text-str" hexCode="#1A1A1A" />
          <ColorSwatch name="Text Weak" className="bg-text-w" hexCode="#343434" />
          <ColorSwatch name="Stroke Strong" className="bg-stroke-s" hexCode="#777777" />
          <ColorSwatch name="Stroke Weak" className="bg-stroke-w" hexCode="#80BDBD" />
          <ColorSwatch name="Background" className="bg-bg border" hexCode="#F5F5F5" />
          <ColorSwatch name="Fill" className="bg-fill border" hexCode="#FFFFFF" />
        </div>
      </div>
    </div>
  ),
};
