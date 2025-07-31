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
      <div 
        className="bg-white rounded-lg flex flex-col justify-between"
        style={{ 
          width: '248px',
          minHeight: '128px',
          padding: '16px'
        }}
      >
        {/* Content Area */}
        <div className="flex-1 flex flex-col justify-center text-center">
          <h2 className="text-sm font-gilroy-medium mb-2">{content.title}</h2>
          {content.content && (content.useDefault === undefined || content.useDefault) && (
            <div className="text-red-500 leading-tight font-[GilroyRegular]" style={{ fontSize: '12px' }}>
              {content.content}
            </div>
          )}
        </div>
        
        {/* Button Area - Always at bottom */}
        {(content.useDefault === undefined || content.useDefault) ? (
          <div className="flex justify-center mt-4">
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white font-[GilroySemiBold] px-6 py-2 rounded-lg h-[30px] text-sm"
              style={{ width: '216px' }}
              onClick={onClose}
            >
              OK
            </Button>
          </div>
        ) : (
          <div className="mt-4 flex justify-center gap-4">
            {content.content}
          </div>
        )}
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
