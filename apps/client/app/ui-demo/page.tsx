'use client';

import React, { useState } from 'react';
import { ComponentsDemo } from './components-simple';

export default function UIDemo() {
  const [selectedTab, setSelectedTab] = useState<'colors' | 'fonts' | 'effects' | 'components'>('colors');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-manrope-bold text-text-str mb-2">
            Design System Demo
          </h1>
          <p className="text-lg text-text-w font-manrope">
            Complete showcase of colors, fonts, effects, and components
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 border-b border-stroke-w">
          <nav className="flex gap-8">
            <button
              onClick={() => setSelectedTab('colors')}
              className={`pb-4 px-2 font-manrope-semibold transition-colors ${
                selectedTab === 'colors'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-text-w hover:text-text-str'
              }`}
            >
              Colors
            </button>
            <button
              onClick={() => setSelectedTab('fonts')}
              className={`pb-4 px-2 font-manrope-semibold transition-colors ${
                selectedTab === 'fonts'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-text-w hover:text-text-str'
              }`}
            >
              Typography
            </button>
            <button
              onClick={() => setSelectedTab('effects')}
              className={`pb-4 px-2 font-manrope-semibold transition-colors ${
                selectedTab === 'effects'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-text-w hover:text-text-str'
              }`}
            >
              Effects
            </button>
            <button
              onClick={() => setSelectedTab('components')}
              className={`pb-4 px-2 font-manrope-semibold transition-colors ${
                selectedTab === 'components'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-text-w hover:text-text-str'
              }`}
            >
              Components
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="space-y-12">
          {selectedTab === 'colors' && <ColorsDemo />}
          {selectedTab === 'fonts' && <TypographyDemo />}
          {selectedTab === 'effects' && <EffectsDemo />}
          {selectedTab === 'components' && <ComponentsDemo />}
        </div>
      </div>
    </div>
  );
}

// Color swatch component for displaying individual colors
const ColorSwatch = ({ name, bgClass, textClass = 'text-white', hexCode }: any) => (
  <div className="flex flex-col gap-2">
    <div className={`w-32 h-32 rounded-lg ${bgClass} shadow-effect-card flex items-end p-3`}>
      <span className={`text-xs font-manrope-semibold ${textClass}`}>{hexCode}</span>
    </div>
    <p className="font-manrope-medium text-sm text-text-str">{name}</p>
  </div>
);

// Colors Demo Component
function ColorsDemo() {
  return (
    <div className="space-y-12">
      {/* Brand Colors */}
      <section>
        <h2 className="text-2xl font-poppins-bold text-text-str mb-6">Brand Colors</h2>
        <div className="flex gap-6 flex-wrap">
          <ColorSwatch name="Primary" bgClass="bg-primary" hexCode="#D70127" />
          <ColorSwatch name="Secondary" bgClass="bg-secondary" textClass="text-text-str" hexCode="#F5F5F5" />
          <ColorSwatch name="Tertiary" bgClass="bg-tertiary" hexCode="#1A1A1A" />
        </div>
      </section>

      {/* Semantic Colors */}
      <section>
        <h2 className="text-2xl font-poppins-bold text-text-str mb-6">Semantic Colors</h2>
        <div className="flex gap-6 flex-wrap">
          <ColorSwatch name="Error" bgClass="bg-error" hexCode="#CA0000" />
          <ColorSwatch name="Warning" bgClass="bg-warning" textClass="text-text-str" hexCode="#FFB800" />
          <ColorSwatch name="Success" bgClass="bg-success" hexCode="#10B700" />
        </div>
      </section>

      {/* Grayscale */}
      <section>
        <h2 className="text-2xl font-poppins-bold text-text-str mb-6">Grayscale</h2>
        <div className="flex gap-6 flex-wrap">
          <ColorSwatch name="Text Strong" bgClass="bg-text-str" hexCode="#1A1A1A" />
          <ColorSwatch name="Text Weak" bgClass="bg-text-w" hexCode="#343434" />
          <ColorSwatch name="Stroke Strong" bgClass="bg-stroke-s" hexCode="#777777" />
          <ColorSwatch name="Stroke Weak" bgClass="bg-stroke-w" textClass="text-text-str" hexCode="#80BDBD" />
          <ColorSwatch name="Background" bgClass="bg-bg border border-stroke-s" textClass="text-text-str" hexCode="#F5F5F5" />
          <ColorSwatch name="Fill" bgClass="bg-fill border border-stroke-s" textClass="text-text-str" hexCode="#FFFFFF" />
        </div>
      </section>
    </div>
  );
}

// Typography Demo Component
function TypographyDemo() {
  return (
    <div className="space-y-12">
      {/* Manrope */}
      <section>
        <h2 className="text-2xl font-poppins-bold text-text-str mb-6">Manrope (UI Font)</h2>
        <div className="space-y-4 bg-white p-6 rounded-lg shadow-effect-card">
          <div>
            <p className="text-xs text-text-w mb-2">Regular (400)</p>
            <p className="font-manrope text-3xl text-text-str">
              The quick brown fox jumps over the lazy dog
            </p>
          </div>
          <div>
            <p className="text-xs text-text-w mb-2">Medium (500)</p>
            <p className="font-manrope-medium text-3xl text-text-str">
              The quick brown fox jumps over the lazy dog
            </p>
          </div>
          <div>
            <p className="text-xs text-text-w mb-2">SemiBold (600)</p>
            <p className="font-manrope-semibold text-3xl text-text-str">
              The quick brown fox jumps over the lazy dog
            </p>
          </div>
          <div>
            <p className="text-xs text-text-w mb-2">Bold (700)</p>
            <p className="font-manrope-bold text-3xl text-text-str">
              The quick brown fox jumps over the lazy dog
            </p>
          </div>
        </div>
      </section>

      {/* Poppins */}
      <section>
        <h2 className="text-2xl font-poppins-bold text-text-str mb-6">Poppins (Campaign Font)</h2>
        <div className="space-y-4 bg-white p-6 rounded-lg shadow-effect-card">
          <div>
            <p className="text-xs text-text-w mb-2">Regular (400)</p>
            <p className="font-poppins text-3xl text-text-str">
              The quick brown fox jumps over the lazy dog
            </p>
          </div>
          <div>
            <p className="text-xs text-text-w mb-2">Medium (500)</p>
            <p className="font-poppins-medium text-3xl text-text-str">
              The quick brown fox jumps over the lazy dog
            </p>
          </div>
          <div>
            <p className="text-xs text-text-w mb-2">SemiBold (600)</p>
            <p className="font-poppins-semibold text-3xl text-text-str">
              The quick brown fox jumps over the lazy dog
            </p>
          </div>
          <div>
            <p className="text-xs text-text-w mb-2">Bold (700)</p>
            <p className="font-poppins-bold text-3xl text-text-str">
              The quick brown fox jumps over the lazy dog
            </p>
          </div>
        </div>
      </section>

      {/* Typography Scale */}
      <section>
        <h2 className="text-2xl font-poppins-bold text-text-str mb-6">Typography Scale</h2>
        <div className="bg-white p-6 rounded-lg shadow-effect-card space-y-3">
          <h1 className="text-6xl font-poppins-bold text-text-str">Heading 1</h1>
          <h2 className="text-5xl font-poppins-bold text-text-str">Heading 2</h2>
          <h3 className="text-4xl font-poppins-semibold text-text-str">Heading 3</h3>
          <h4 className="text-3xl font-poppins-semibold text-text-str">Heading 4</h4>
          <p className="text-xl font-manrope text-text-str">Title - Large body text</p>
          <p className="text-lg font-manrope text-text-str">Subtitle - Medium body text</p>
          <p className="text-base font-manrope text-text-str">Body - Regular body text for content</p>
          <p className="text-sm font-manrope text-text-w">Caption - Small supporting text</p>
        </div>
      </section>
    </div>
  );
}

// Effects Demo Component
function EffectsDemo() {
  return (
    <div className="space-y-12">
      {/* Shadow Effects */}
      <section>
        <h2 className="text-2xl font-poppins-bold text-text-str mb-6">Shadow Effects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-3">
            <h3 className="font-manrope-semibold text-text-str">Card Effect</h3>
            <div className="shadow-effect-card bg-white p-8 rounded-lg">
              <p className="text-sm text-text-w font-manrope">
                box-shadow: 0px 4px 3px 0px rgba(0, 0, 0, 0.25)
              </p>
              <p className="mt-2 text-xs text-text-w font-manrope-medium">
                .shadow-effect-card
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-manrope-semibold text-text-str">Flag Effect</h3>
            <div className="shadow-effect-flag bg-white p-8 rounded-lg">
              <p className="text-sm text-text-w font-manrope">
                box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.25)
              </p>
              <p className="mt-2 text-xs text-text-w font-manrope-medium">
                .shadow-effect-flag
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-manrope-semibold text-text-str">Overlay Effect</h3>
            <div className="shadow-effect-overlay bg-white p-8 rounded-lg">
              <p className="text-sm text-text-w font-manrope">
                box-shadow: 0px 4px 15px 0px rgba(0, 0, 0, 0.25)
              </p>
              <p className="mt-2 text-xs text-text-w font-manrope-medium">
                .shadow-effect-overlay
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-manrope-semibold text-text-str">Overlay Strong</h3>
            <div className="shadow-effect-overlay-strong bg-white p-8 rounded-lg">
              <p className="text-sm text-text-w font-manrope">
                box-shadow: 0px 4px 15px 0px rgba(0, 0, 0, 0.5)
              </p>
              <p className="mt-2 text-xs text-text-w font-manrope-medium">
                .shadow-effect-overlay-strong
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-manrope-semibold text-text-str">Button Effect</h3>
            <div className="shadow-effect-button bg-white p-8 rounded-lg">
              <p className="text-sm text-text-w font-manrope">
                box-shadow: -2px -4px 4px 0px rgba(0, 0, 0, 0.25) inset
              </p>
              <p className="mt-2 text-xs text-text-w font-manrope-medium">
                .shadow-effect-button
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Combined Effects */}
      <section>
        <h2 className="text-2xl font-poppins-bold text-text-str mb-6">Combined Examples</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="shadow-effect-card bg-white p-6 rounded-xl">
            <h3 className="font-poppins-bold text-xl text-primary mb-2">Card with Primary Color</h3>
            <p className="font-manrope text-text-str">
              This card combines shadow-effect-card with primary color accent.
            </p>
          </div>

          <div className="shadow-effect-overlay bg-gradient-to-br from-primary to-error p-6 rounded-xl">
            <h3 className="font-poppins-bold text-xl text-white mb-2">Overlay with Gradient</h3>
            <p className="font-manrope text-white">
              Strong shadow effect with gradient background.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
