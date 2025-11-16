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
  Button,
  DatePickerWithInput,
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
        <div className="bg-white p-8 rounded-lg shadow-effect-card">
          <div className="flex flex-wrap gap-4">
            <TGButton variant="primary">Primary Button</TGButton>
            <TGButton variant="secondary">Secondary Button</TGButton>
            <TGButton variant="outline">Outline Button</TGButton>
            <TGButton variant="ghost">Ghost Button</TGButton>
            <TGButton variant="primary" size="sm">Small</TGButton>
            <TGButton variant="primary" size="lg">Large</TGButton>
            <TGButton variant="primary" loading>Loading</TGButton>
            <TGButton variant="primary" disabled>Disabled</TGButton>
          </div>
        </div>
      </section>

      {/* Shadcn UI Buttons */}
      <section>
        <h2 className="text-2xl font-poppins-bold text-text-str mb-6">Shadcn UI Buttons</h2>
        <div className="bg-white p-8 rounded-lg shadow-effect-card">
          <div className="flex flex-wrap gap-4">
            <Button variant="default">Default</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">🔍</Button>
          </div>
        </div>
      </section>

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
          <div className="max-w-md">
            <label className="block font-manrope-semibold text-text-str mb-4">
              Enter OTP Code
            </label>
            <TGOTPInput length={6} onComplete={(otp) => alert(`OTP: ${otp}`)} />
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
