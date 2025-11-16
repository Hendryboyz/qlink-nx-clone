import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import * as path from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  staticDirs: [
    {
      from: path.resolve(__dirname, '../../../apps/client/public'),
      to: '/',
    },
  ],
  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [nxViteTsPaths()],
      css: {
        postcss: {
          plugins: [
            require('tailwindcss')({
              config: path.resolve(__dirname, '../tailwind.config.js'),
            }),
            require('autoprefixer'),
          ],
        },
      },
    });
  },
};

export default config;
