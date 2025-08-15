import { Field } from 'formik';
import ReCAPTCHA from 'react-google-recaptcha';
import { FormikErrors } from 'formik/dist/types';
import { useRef, useEffect, useState } from 'react';

type RecaptchaProps = {
  recaptchaToken: string;
  recaptchaError?: string;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => Promise<void | FormikErrors<any>>;
  targetElementId?: string; // 目標文字框的 ID
}

const Recaptcha = (props: RecaptchaProps) => {
  const recaptchaSitekey = process.env.NEXT_PUBLIC_RECAPTHCA_SITEKEY || '';
  const [scale, setScale] = useState(1);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  useEffect(() => {
    const calculateScale = () => {
      // 尋找目標文字框元素
      const targetElement = props.targetElementId
        ? document.getElementById(props.targetElementId)
        : document.querySelector('input[name="email"]'); // 預設尋找 email 輸入框

      if (targetElement) {
        const targetWidth = (targetElement as HTMLElement).offsetWidth;
        const recaptchaDefaultWidth = 304; // Google reCAPTCHA 預設寬度
        const calculatedScale = targetWidth / recaptchaDefaultWidth;

        // 限制 scale 範圍，避免過度縮放
        const finalScale = Math.min(Math.max(calculatedScale, 0.5), 2);
        setScale(finalScale);
      }
    };

    // 初始計算
    calculateScale();

    // 監聽視窗大小變化
    window.addEventListener('resize', calculateScale);

    // 延遲計算，確保 DOM 完全載入
    const timer = setTimeout(calculateScale, 100);

    return () => {
      window.removeEventListener('resize', calculateScale);
      clearTimeout(timer);
    };
  }, [props.targetElementId]);

  return (
    <>
      <Field
        type="hidden"
        id="recaptchaToken"
        name="recaptchaToken"
        value={props.recaptchaToken}
      />
             <div className="w-full">
         <div style={{
           transform: `scale(${scale})`,
           transformOrigin: 'left top',
           width: 'fit-content',
         }}>
           <ReCAPTCHA
             ref={recaptchaRef}
             sitekey={recaptchaSitekey}
             onChange={async (token) => {
               await props.setFieldValue("recaptchaToken", token, true);
             }}
           />
         </div>
       </div>
      { props.recaptchaError ? (<span className="text-red-500">
        {props.recaptchaError}
      </span>) : null}
    </>
  )
}

export default Recaptcha;
