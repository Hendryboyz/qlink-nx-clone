'use client';
import React, { useState } from 'react';
import {
  TGButton,
  TGInput,
  TGCheckbox,
  TGModal,
  TGToast,
  TGOTPInput,
  TGDropdown,
  DatePickerWithInput,
  RegisterButton,
} from '@org/components';

export function ComponentsDemo() {
  const [modalOpen, setModalOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [date, setDate] = useState<Date>();

  return (
    <div className="space-y-12">
      {/* TailGrids Buttons */}
      <section>
        <h2 className="text-2xl font-poppins-bold text-text-str mb-6">TailGrids Buttons</h2>

        {/* Variants */}
        <div className="bg-white p-8 rounded-lg shadow-effect-card mb-6">
          <h3 className="text-lg font-manrope-semibold text-text-str mb-4">Variants</h3>
          <div className="flex flex-wrap gap-4">
            <TGButton variant="primary" size="lg">Primary</TGButton>
            <TGButton variant="secondary" size="lg">Secondary</TGButton>
            <TGButton variant="outline" size="lg">Outline</TGButton>
            <TGButton variant="ghost" size="lg">Ghost</TGButton>
            <TGButton variant="white" size="lg">White</TGButton>
          </div>
        </div>

        {/* Sizes */}
        <div className="bg-white p-8 rounded-lg shadow-effect-card mb-6">
          <h3 className="text-lg font-manrope-semibold text-text-str mb-4">Sizes (Responsive)</h3>
          <div className="flex flex-wrap gap-4 items-center">
            <TGButton variant="primary" size="xl">XL (354px)</TGButton>
            <TGButton variant="primary" size="lg">LG (252px)</TGButton>
            <TGButton variant="primary" size="md">MD (91px)</TGButton>
            <TGButton variant="primary" size="sm">SM</TGButton>
          </div>
          <p className="text-sm text-text-w font-manrope mt-4">
            Note: XL and LG sizes are responsive - they will shrink to fit smaller containers
          </p>
        </div>

        {/* States */}
        <div className="bg-white p-8 rounded-lg shadow-effect-card mb-6">
          <h3 className="text-lg font-manrope-semibold text-text-str mb-4">States</h3>
          <div className="flex flex-wrap gap-4">
            <TGButton variant="primary" size="lg" loading>Loading</TGButton>
            <TGButton variant="primary" size="lg" disabled>Disabled</TGButton>
            <TGButton variant="outline" size="lg" disabled>Disabled Outline</TGButton>
          </div>
        </div>

        {/* With Icons */}
        <div className="bg-white p-8 rounded-lg shadow-effect-card">
          <h3 className="text-lg font-manrope-semibold text-text-str mb-4">With Icons</h3>
          <div className="flex flex-wrap gap-4">
            <TGButton
              variant="primary"
              size="lg"
              icon={
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                  <path d="M1.91668 10.0004V7.33337C1.91668 6.91916 2.25246 6.58337 2.66668 6.58337C3.08089 6.58337 3.41668 6.91916 3.41668 7.33337V10.0004C3.41668 11.1213 3.41864 11.8866 3.49578 12.4603C3.57 13.0124 3.70149 13.2734 3.88054 13.4525C4.05965 13.6316 4.32063 13.764 4.87273 13.8383C5.44654 13.9154 6.21252 13.9164 7.33367 13.9164H8.66668C9.78754 13.9164 10.5529 13.9153 11.1266 13.8383C11.6789 13.764 11.9406 13.6317 12.1198 13.4525C12.2988 13.2734 12.4304 13.0122 12.5046 12.4603C12.5817 11.8866 12.5837 11.1213 12.5837 10.0004V7.33337C12.5837 6.91916 12.9195 6.58337 13.3337 6.58337C13.7477 6.58355 14.0837 6.91927 14.0837 7.33337V10.0004C14.0837 11.079 14.0846 11.9636 13.9909 12.6605C13.8943 13.379 13.6845 14.0098 13.1803 14.514C12.6761 15.0182 12.0453 15.228 11.3268 15.3246C10.6299 15.4183 9.74538 15.4164 8.66668 15.4164H7.33367C6.25513 15.4164 5.37044 15.4182 4.67351 15.3246C3.9551 15.228 3.32423 15.0181 2.82 14.514C2.31578 14.0098 2.1051 13.379 2.00847 12.6605C1.91477 11.9636 1.91668 11.0789 1.91668 10.0004Z" fill="currentColor"/>
                  <path d="M13.25 5.99972C13.25 5.7337 13.2491 5.59651 13.2383 5.50069C13.2376 5.49491 13.236 5.48966 13.2354 5.48507C13.224 5.47627 13.2081 5.46521 13.1856 5.45479L13.1846 5.45382C13.1837 5.45349 13.1819 5.45357 13.1797 5.45284C13.175 5.45133 13.1665 5.44879 13.1533 5.446C13.1252 5.44008 13.08 5.43359 13.0088 5.42843C12.8575 5.41747 12.6554 5.41671 12.333 5.41671H3.667C3.34457 5.41671 3.14252 5.41747 2.99122 5.42843C2.91999 5.43359 2.8748 5.44008 2.84669 5.446C2.83354 5.44879 2.82501 5.45134 2.82032 5.45284C2.81808 5.45356 2.81629 5.45349 2.81544 5.45382L2.81446 5.45479C2.79154 5.46538 2.77513 5.47617 2.76368 5.48507C2.76306 5.48963 2.76238 5.49497 2.76173 5.50069C2.75089 5.59652 2.75001 5.73372 2.75001 5.99972C2.75001 6.26614 2.75087 6.40384 2.76173 6.49972C2.76234 6.50513 2.76309 6.50999 2.76368 6.51436C2.77514 6.52331 2.79135 6.53494 2.81446 6.54561C2.81532 6.54595 2.81805 6.54683 2.82032 6.54757C2.82501 6.54907 2.83352 6.55162 2.84669 6.5544C2.8748 6.56032 2.92 6.56682 2.99122 6.57198C3.14251 6.58294 3.34458 6.5837 3.667 6.5837H12.333C12.6554 6.5837 12.8575 6.58294 13.0088 6.57198C13.08 6.56682 13.1252 6.56032 13.1533 6.5544C13.1665 6.55162 13.175 6.54907 13.1797 6.54757C13.182 6.54683 13.1837 6.54595 13.1846 6.54561C13.2073 6.53511 13.2239 6.52321 13.2354 6.51436C13.236 6.50996 13.2377 6.50518 13.2383 6.49972C13.2492 6.40385 13.25 6.26614 13.25 5.99972ZM14.75 5.99972C14.75 6.23175 14.7512 6.46889 14.7285 6.66866C14.7038 6.88685 14.6448 7.13696 14.4746 7.37276L14.4736 7.37179C14.3019 7.6098 14.0696 7.78912 13.8145 7.90694C13.5801 8.01522 13.3408 8.05186 13.1172 8.06808C12.899 8.08387 12.6333 8.0837 12.333 8.0837H3.667C3.3667 8.0837 3.10098 8.08387 2.88282 8.06808C2.71492 8.0559 2.53809 8.03212 2.36134 7.9753L2.18556 7.90694C1.93039 7.7891 1.69708 7.61059 1.5254 7.37276C1.35552 7.13711 1.29621 6.88668 1.27149 6.66866C1.24886 6.4689 1.25001 6.23175 1.25001 5.99972C1.25001 5.76782 1.24889 5.53139 1.27149 5.33175C1.29621 5.11357 1.35522 4.86351 1.5254 4.62765L1.59278 4.54171C1.75588 4.34632 1.96222 4.19664 2.18556 4.09347C2.41995 3.9852 2.65918 3.94855 2.88282 3.93233C3.10098 3.91653 3.36668 3.91671 3.667 3.91671H12.333C12.6333 3.91671 12.899 3.91653 13.1172 3.93233C13.3408 3.94855 13.5801 3.98521 13.8145 4.09347C14.0695 4.21129 14.3029 4.38961 14.4746 4.62765C14.6448 4.86349 14.7038 5.11357 14.7285 5.33175C14.7511 5.5314 14.75 5.76783 14.75 5.99972Z" fill="currentColor"/>
                  <path d="M3.25001 2.5238C3.25003 1.45214 4.11878 0.583398 5.19044 0.583374H5.42872C7.26299 0.583448 8.74994 2.0704 8.75001 3.90466V4.66638C8.75001 5.0806 8.41422 5.41638 8.00001 5.41638H6.14259C4.54503 5.41623 3.25001 4.12139 3.25001 2.5238ZM4.75001 2.5238C4.75001 3.29296 5.37346 3.91623 6.14259 3.91638H7.25001V3.90466C7.24994 2.89883 6.43456 2.08345 5.42872 2.08337H5.19044C4.94721 2.0834 4.75003 2.28057 4.75001 2.5238Z" fill="currentColor"/>
                  <path d="M11.25 2.5238C11.25 2.28057 11.0528 2.08339 10.8096 2.08337H10.5713C9.56548 2.08343 8.75008 2.89881 8.75001 3.90466L8.75001 3.91638H9.85743C10.6266 3.91623 11.25 3.29296 11.25 2.5238ZM12.75 2.5238C12.75 4.12139 11.455 5.41623 9.85743 5.41638H8.00001C7.5858 5.41638 7.25001 5.0806 7.25001 4.66638L7.25001 3.90466C7.25008 2.07039 8.73704 0.583434 10.5713 0.583374H10.8096C11.8812 0.583394 12.75 1.45214 12.75 2.5238Z" fill="currentColor"/>
                  <path d="M7.25001 14.6664V7.33337C7.25001 6.91916 7.5858 6.58337 8.00001 6.58337C8.41422 6.58337 8.75001 6.91916 8.75001 7.33337V14.6664C8.75001 15.0806 8.41422 15.4164 8.00001 15.4164C7.5858 15.4164 7.25001 15.0806 7.25001 14.6664Z" fill="currentColor"/>
                </svg>
              }
              iconPosition="left"
            >
              With Icon
            </TGButton>
            <TGButton
              variant="outline"
              size="lg"
              icon={
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                  <path d="M1.91668 10.0004V7.33337C1.91668 6.91916 2.25246 6.58337 2.66668 6.58337C3.08089 6.58337 3.41668 6.91916 3.41668 7.33337V10.0004C3.41668 11.1213 3.41864 11.8866 3.49578 12.4603C3.57 13.0124 3.70149 13.2734 3.88054 13.4525C4.05965 13.6316 4.32063 13.764 4.87273 13.8383C5.44654 13.9154 6.21252 13.9164 7.33367 13.9164H8.66668C9.78754 13.9164 10.5529 13.9153 11.1266 13.8383C11.6789 13.764 11.9406 13.6317 12.1198 13.4525C12.2988 13.2734 12.4304 13.0122 12.5046 12.4603C12.5817 11.8866 12.5837 11.1213 12.5837 10.0004V7.33337C12.5837 6.91916 12.9195 6.58337 13.3337 6.58337C13.7477 6.58355 14.0837 6.91927 14.0837 7.33337V10.0004C14.0837 11.079 14.0846 11.9636 13.9909 12.6605C13.8943 13.379 13.6845 14.0098 13.1803 14.514C12.6761 15.0182 12.0453 15.228 11.3268 15.3246C10.6299 15.4183 9.74538 15.4164 8.66668 15.4164H7.33367C6.25513 15.4164 5.37044 15.4182 4.67351 15.3246C3.9551 15.228 3.32423 15.0181 2.82 14.514C2.31578 14.0098 2.1051 13.379 2.00847 12.6605C1.91477 11.9636 1.91668 11.0789 1.91668 10.0004Z" fill="currentColor"/>
                  <path d="M13.25 5.99972C13.25 5.7337 13.2491 5.59651 13.2383 5.50069C13.2376 5.49491 13.236 5.48966 13.2354 5.48507C13.224 5.47627 13.2081 5.46521 13.1856 5.45479L13.1846 5.45382C13.1837 5.45349 13.1819 5.45357 13.1797 5.45284C13.175 5.45133 13.1665 5.44879 13.1533 5.446C13.1252 5.44008 13.08 5.43359 13.0088 5.42843C12.8575 5.41747 12.6554 5.41671 12.333 5.41671H3.667C3.34457 5.41671 3.14252 5.41747 2.99122 5.42843C2.91999 5.43359 2.8748 5.44008 2.84669 5.446C2.83354 5.44879 2.82501 5.45134 2.82032 5.45284C2.81808 5.45356 2.81629 5.45349 2.81544 5.45382L2.81446 5.45479C2.79154 5.46538 2.77513 5.47617 2.76368 5.48507C2.76306 5.48963 2.76238 5.49497 2.76173 5.50069C2.75089 5.59652 2.75001 5.73372 2.75001 5.99972C2.75001 6.26614 2.75087 6.40384 2.76173 6.49972C2.76234 6.50513 2.76309 6.50999 2.76368 6.51436C2.77514 6.52331 2.79135 6.53494 2.81446 6.54561C2.81532 6.54595 2.81805 6.54683 2.82032 6.54757C2.82501 6.54907 2.83352 6.55162 2.84669 6.5544C2.8748 6.56032 2.92 6.56682 2.99122 6.57198C3.14251 6.58294 3.34458 6.5837 3.667 6.5837H12.333C12.6554 6.5837 12.8575 6.58294 13.0088 6.57198C13.08 6.56682 13.1252 6.56032 13.1533 6.5544C13.1665 6.55162 13.175 6.54907 13.1797 6.54757C13.182 6.54683 13.1837 6.54595 13.1846 6.54561C13.2073 6.53511 13.2239 6.52321 13.2354 6.51436C13.236 6.50996 13.2377 6.50518 13.2383 6.49972C13.2492 6.40385 13.25 6.26614 13.25 5.99972ZM14.75 5.99972C14.75 6.23175 14.7512 6.46889 14.7285 6.66866C14.7038 6.88685 14.6448 7.13696 14.4746 7.37276L14.4736 7.37179C14.3019 7.6098 14.0696 7.78912 13.8145 7.90694C13.5801 8.01522 13.3408 8.05186 13.1172 8.06808C12.899 8.08387 12.6333 8.0837 12.333 8.0837H3.667C3.3667 8.0837 3.10098 8.08387 2.88282 8.06808C2.71492 8.0559 2.53809 8.03212 2.36134 7.9753L2.18556 7.90694C1.93039 7.7891 1.69708 7.61059 1.5254 7.37276C1.35552 7.13711 1.29621 6.88668 1.27149 6.66866C1.24886 6.4689 1.25001 6.23175 1.25001 5.99972C1.25001 5.76782 1.24889 5.53139 1.27149 5.33175C1.29621 5.11357 1.35522 4.86351 1.5254 4.62765L1.59278 4.54171C1.75588 4.34632 1.96222 4.19664 2.18556 4.09347C2.41995 3.9852 2.65918 3.94855 2.88282 3.93233C3.10098 3.91653 3.36668 3.91671 3.667 3.91671H12.333C12.6333 3.91671 12.899 3.91653 13.1172 3.93233C13.3408 3.94855 13.5801 3.98521 13.8145 4.09347C14.0695 4.21129 14.3029 4.38961 14.4746 4.62765C14.6448 4.86349 14.7038 5.11357 14.7285 5.33175C14.7511 5.5314 14.75 5.76783 14.75 5.99972Z" fill="currentColor"/>
                  <path d="M3.25001 2.5238C3.25003 1.45214 4.11878 0.583398 5.19044 0.583374H5.42872C7.26299 0.583448 8.74994 2.0704 8.75001 3.90466V4.66638C8.75001 5.0806 8.41422 5.41638 8.00001 5.41638H6.14259C4.54503 5.41623 3.25001 4.12139 3.25001 2.5238ZM4.75001 2.5238C4.75001 3.29296 5.37346 3.91623 6.14259 3.91638H7.25001V3.90466C7.24994 2.89883 6.43456 2.08345 5.42872 2.08337H5.19044C4.94721 2.0834 4.75003 2.28057 4.75001 2.5238Z" fill="currentColor"/>
                  <path d="M11.25 2.5238C11.25 2.28057 11.0528 2.08339 10.8096 2.08337H10.5713C9.56548 2.08343 8.75008 2.89881 8.75001 3.90466L8.75001 3.91638H9.85743C10.6266 3.91623 11.25 3.29296 11.25 2.5238ZM12.75 2.5238C12.75 4.12139 11.455 5.41623 9.85743 5.41638H8.00001C7.5858 5.41638 7.25001 5.0806 7.25001 4.66638L7.25001 3.90466C7.25008 2.07039 8.73704 0.583434 10.5713 0.583374H10.8096C11.8812 0.583394 12.75 1.45214 12.75 2.5238Z" fill="currentColor"/>
                  <path d="M7.25001 14.6664V7.33337C7.25001 6.91916 7.5858 6.58337 8.00001 6.58337C8.41422 6.58337 8.75001 6.91916 8.75001 7.33337V14.6664C8.75001 15.0806 8.41422 15.4164 8.00001 15.4164C7.5858 15.4164 7.25001 15.0806 7.25001 14.6664Z" fill="currentColor"/>
                </svg>
              }
              iconPosition="left"
            >
              Outline with Icon
            </TGButton>
          </div>
        </div>
      </section>

      {/* Register Button */}
      <section>
        <h2 className="text-2xl font-poppins-bold text-text-str mb-6">Register Button</h2>
        <div className="bg-white p-8 rounded-lg shadow-effect-card">
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-text-w font-manrope">Click and hold to see the pressed state</p>
            <RegisterButton onClick={() => alert('Register clicked!')} />
            <p className="text-xs text-text-w font-manrope">
              Interactive circular button with default and pressed states
            </p>
          </div>
        </div>
      </section>

      {/* Shadcn UI Buttons - Removed (Button component is now internal to DatePicker) */}

      {/* TailGrids Input */}
      <section>
        <h2 className="text-2xl font-poppins-bold text-text-str mb-6">TailGrids Input</h2>
        <div className="bg-white p-8 rounded-lg shadow-effect-card max-w-md">
          <div className="space-y-4">
            <TGInput
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <TGInput
              label="Password"
              type="password"
              placeholder="Enter your password"
            />
            <TGInput
              label="Disabled Input"
              placeholder="Disabled"
              disabled
            />
            <TGInput
              label="Input with Error"
              placeholder="Invalid input"
              error="This field is required"
            />
          </div>
        </div>
      </section>

      {/* TailGrids Checkbox */}
      <section>
        <h2 className="text-2xl font-poppins-bold text-text-str mb-6">TailGrids Checkbox</h2>
        <div className="bg-white p-8 rounded-lg shadow-effect-card">
          <div className="space-y-4">
            <TGCheckbox
              label="Accept terms and conditions"
              checked={checkboxChecked}
              onChange={(e) => setCheckboxChecked(e.target.checked)}
            />
            <TGCheckbox label="Subscribe to newsletter" />
            <TGCheckbox label="Disabled checkbox" disabled />
            <TGCheckbox label="Checked disabled" checked disabled />
          </div>
        </div>
      </section>

      {/* TailGrids Dropdown */}
      <section>
        <h2 className="text-2xl font-poppins-bold text-text-str mb-6">TailGrids Dropdown</h2>
        <div className="bg-white p-8 rounded-lg shadow-effect-card max-w-md">
          <div className="space-y-4">
            <TGDropdown
              label="Select an option"
              placeholder="Choose..."
              options={[
                { label: 'Profile', value: 'profile' },
                { label: 'Settings', value: 'settings' },
                { label: 'Logout', value: 'logout' },
              ]}
              onChange={(value) => alert(`Selected: ${value}`)}
            />
            <TGDropdown
              label="With selected value"
              options={[
                { label: 'Option 1', value: '1' },
                { label: 'Option 2', value: '2' },
                { label: 'Option 3', value: '3' },
              ]}
              value="2"
            />
            <TGDropdown
              label="Disabled dropdown"
              placeholder="Disabled"
              options={[
                { label: 'Option 1', value: '1' },
              ]}
              disabled
            />
          </div>
        </div>
      </section>

      {/* TailGrids Modal */}
      <section>
        <h2 className="text-2xl font-poppins-bold text-text-str mb-6">TailGrids Modal</h2>
        <div className="bg-white p-8 rounded-lg shadow-effect-card">
          <TGButton variant="primary" onClick={() => setModalOpen(true)}>
            Open Modal
          </TGButton>
          <TGModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Example Modal"
          >
            <div className="space-y-4">
              <p className="font-manrope text-text-str">
                This is a modal dialog built with TailGrids components.
              </p>
              <p className="font-manrope text-text-w text-sm">
                You can put any content here, including forms, images, or other components.
              </p>
              <div className="flex justify-end gap-3 mt-6">
                <TGButton variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </TGButton>
                <TGButton variant="primary" onClick={() => setModalOpen(false)}>
                  Confirm
                </TGButton>
              </div>
            </div>
          </TGModal>
        </div>
      </section>

      {/* TailGrids Toast */}
      <section>
        <h2 className="text-2xl font-poppins-bold text-text-str mb-6">TailGrids Toast</h2>
        <div className="bg-white p-8 rounded-lg shadow-effect-card">
          <div className="flex gap-4 flex-wrap">
            <TGButton variant="primary" onClick={() => setToastVisible(true)}>
              Show Toast
            </TGButton>
          </div>
          <TGToast
            isVisible={toastVisible}
            message="This is a toast notification!"
            type="success"
            onClose={() => setToastVisible(false)}
          />
        </div>
      </section>

      {/* TailGrids OTP Input */}
      <section>
        <h2 className="text-2xl font-poppins-bold text-text-str mb-6">TailGrids OTP Input</h2>
        <div className="bg-white p-8 rounded-lg shadow-effect-card">
          <div className="max-w-md space-y-8">
            <div>
              <label className="block font-manrope-semibold text-text-str mb-4">
                Enter OTP Code (Default)
              </label>
              <TGOTPInput length={6} onComplete={(otp) => alert(`OTP: ${otp}`)} />
            </div>
            <div>
              <label className="block font-manrope-semibold text-text-str mb-4">
                Enter OTP Code (With Error)
              </label>
              <TGOTPInput
                length={6}
                error={true}
                errorMessage="Error msg"
                onComplete={(otp) => alert(`OTP: ${otp}`)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Shadcn UI Date Picker */}
      <section>
        <h2 className="text-2xl font-poppins-bold text-text-str mb-6">Shadcn UI Date Picker</h2>
        <div className="bg-white p-8 rounded-lg shadow-effect-card">
          <div className="max-w-md">
            <DatePickerWithInput
              label="Select Date"
              value={date}
              onChange={setDate}
            />
            {date && (
              <p className="mt-4 font-manrope text-text-w">
                Selected: {date.toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Combined Example */}
      <section>
        <h2 className="text-2xl font-poppins-bold text-text-str mb-6">Combined Form Example</h2>
        <div className="bg-white p-8 rounded-lg shadow-effect-card max-w-2xl">
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Form submitted!'); }}>
            <TGInput
              label="Full Name"
              type="text"
              placeholder="John Doe"
              required
            />
            <TGInput
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              required
            />
            <DatePickerWithInput
              label="Birth Date"
              value={date}
              onChange={setDate}
            />
            <TGCheckbox
              label="I agree to the terms and conditions"
              required
            />
            <div className="flex gap-3">
              <TGButton type="submit" variant="primary">
                Submit
              </TGButton>
              <TGButton type="button" variant="outline">
                Cancel
              </TGButton>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
