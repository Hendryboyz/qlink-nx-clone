import type { Meta, StoryObj } from '@storybook/react';
import { TGDropdown } from './dropdown';
import { useState } from 'react';
import { Globe, User, Settings, Shield, Mail } from 'lucide-react';

const meta: Meta<typeof TGDropdown> = {
  title: 'TailGrids/Dropdown',
  component: TGDropdown,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TGDropdown>;

const simpleOptions = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
];

const countryOptions = [
  { label: 'Taiwan', value: 'tw', icon: <Globe className="w-4 h-4" /> },
  { label: 'Japan', value: 'jp', icon: <Globe className="w-4 h-4" /> },
  { label: 'United States', value: 'us', icon: <Globe className="w-4 h-4" /> },
  { label: 'United Kingdom', value: 'uk', icon: <Globe className="w-4 h-4" /> },
];

export const Default: Story = {
  args: {
    options: simpleOptions,
    placeholder: 'Select an option',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Select Country',
    options: countryOptions,
    placeholder: 'Select country',
  },
};

export const WithIcons: Story = {
  args: {
    label: 'Select Setting',
    options: [
      { label: 'Profile', value: 'profile', icon: <User className="w-4 h-4" /> },
      { label: 'Account Settings', value: 'settings', icon: <Settings className="w-4 h-4" /> },
      { label: 'Privacy & Security', value: 'privacy', icon: <Shield className="w-4 h-4" /> },
      { label: 'Notifications', value: 'notifications', icon: <Mail className="w-4 h-4" /> },
    ],
  },
};

export const WithError: Story = {
  args: {
    label: 'Select Option',
    options: simpleOptions,
    error: 'This field is required',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Dropdown',
    options: simpleOptions,
    disabled: true,
    value: '1',
  },
};

export const WithDisabledOptions: Story = {
  args: {
    label: 'Select Plan',
    options: [
      { label: 'Free Plan', value: 'free' },
      { label: 'Basic Plan - $9.99/mo', value: 'basic' },
      { label: 'Pro Plan - $29.99/mo', value: 'pro' },
      { label: 'Enterprise Plan (Coming Soon)', value: 'enterprise', disabled: true },
    ],
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('');

    return (
      <div className="space-y-4">
        <TGDropdown
          label="Select Country"
          options={countryOptions}
          value={value}
          onChange={setValue}
          placeholder="Select country"
        />
        <div className="text-sm text-gray-600">
          Selected value: <span className="font-mono font-bold">{value || '(None)'}</span>
        </div>
      </div>
    );
  },
};

export const MultipleDropdowns: Story = {
  render: () => {
    const [country, setCountry] = useState('');
    const [language, setLanguage] = useState('');
    const [timezone, setTimezone] = useState('');

    return (
      <div className="max-w-md space-y-4">
        <TGDropdown
          label="Country/Region"
          options={countryOptions}
          value={country}
          onChange={setCountry}
        />
        <TGDropdown
          label="Language"
          options={[
            { label: '繁體中文', value: 'zh-TW' },
            { label: '简体中文', value: 'zh-CN' },
            { label: 'English', value: 'en' },
            { label: '日本語', value: 'ja' },
          ]}
          value={language}
          onChange={setLanguage}
        />
        <TGDropdown
          label="Timezone"
          options={[
            { label: 'GMT+8 Taipei', value: 'Asia/Taipei' },
            { label: 'GMT+9 Tokyo', value: 'Asia/Tokyo' },
            { label: 'GMT-8 Los Angeles', value: 'America/Los_Angeles' },
            { label: 'GMT+0 London', value: 'Europe/London' },
          ]}
          value={timezone}
          onChange={setTimezone}
        />
        <div className="p-4 bg-gray-50 rounded-lg text-sm space-y-1">
          <p><strong>Selected values:</strong></p>
          <p>Country: {country || 'Not selected'}</p>
          <p>Language: {language || 'Not selected'}</p>
          <p>Timezone: {timezone || 'Not selected'}</p>
        </div>
      </div>
    );
  },
};

export const LongList: Story = {
  args: {
    label: 'Select City',
    options: [
      'Taipei', 'New Taipei', 'Taoyuan', 'Taichung', 'Tainan', 'Kaohsiung',
      'Keelung', 'Hsinchu City', 'Chiayi City', 'Hsinchu County', 'Miaoli', 'Changhua',
      'Nantou', 'Yunlin', 'Chiayi County', 'Pingtung', 'Yilan', 'Hualien',
      'Taitung', 'Penghu', 'Kinmen', 'Lienchiang'
    ].map((city) => ({
      label: city,
      value: city.toLowerCase().replace(/\s/g, '-'),
    })),
  },
};

export const WithValidation: Story = {
  render: () => {
    const [value, setValue] = useState('');
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
      if (!value) {
        setError('Please select an option');
      } else {
        setError('');
        setSubmitted(true);
        alert(`Selected: ${countryOptions.find(opt => opt.value === value)?.label}`);
      }
    };

    return (
      <div className="max-w-md space-y-4">
        <TGDropdown
          label="Select Country *"
          options={countryOptions}
          value={value}
          onChange={(val) => {
            setValue(val);
            setError('');
            setSubmitted(false);
          }}
          error={error}
          placeholder="Select country"
        />
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-500 transition-colors"
        >
          Submit
        </button>
        {submitted && !error && (
          <p className="text-sm text-green-600">✓ Submitted successfully!</p>
        )}
      </div>
    );
  },
};
