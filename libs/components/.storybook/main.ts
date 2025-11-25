import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import svgr from 'vite-plugin-svgr';
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
      plugins: [
        svgr({
          svgrOptions: {
            exportType: 'named',
            ref: true,
            svgo: false,
            titleProp: true,
          },
          include: '**/*.svg',
        }),
        nxViteTsPaths(),
      ],
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
