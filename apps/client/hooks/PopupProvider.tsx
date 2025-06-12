import Button from '$/components/Button';
import React, {
  useState,
  useCallback,
  createContext,
  useContext,
  ReactNode,
} from 'react';

// 定義 Pop-up 的內容類型
interface PopupContent {
  title: string;
  content?: ReactNode;
  useDefault?: boolean;
}

// 創建 Context
const PopupContext = createContext<{
  showPopup: (content: PopupContent) => void;
  hidePopup: () => void;
} | null>(null);

// Pop-up 組件
const Popup: React.FC<{ content: PopupContent; onClose: () => void }> = ({
  content,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md min-w-96 m-4 text-center">
        <div className="px-6 py-6">
          <h2 className="text-sm font-gilroy-medium">{content.title}</h2>
        </div>
        {content.content && content.content}
        {(content.useDefault === undefined || content.useDefault) && <div className='flex justify-center'>
          <Button theme='dark' className='text-sm h-8 w-full py-3 rounded-lg' onClick={onClose}>OK</Button>
          </div>}
      </div>
    </div>
  );
};

// Provider 組件
export const PopupProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [popupContent, setPopupContent] = useState<PopupContent | null>(null);

  const showPopup = useCallback((content: PopupContent) => {
    setPopupContent(content);
  }, []);

  const hidePopup = useCallback(() => {
    setPopupContent(null);
  }, []);

  return (
    <PopupContext.Provider value={{ showPopup, hidePopup }}>
      {children}
      {popupContent && <Popup content={popupContent} onClose={hidePopup} />}
    </PopupContext.Provider>
  );
};

export const usePopup = () => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error('usePopup must be used within a PopupProvider');
  }
  return context;
};
