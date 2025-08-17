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
  hasDetailText?: boolean; // 新增：是否有詳細說明文字
  detailText?: string; // 新增：詳細說明文字
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
        className="bg-white rounded-2xl flex flex-col justify-between"
        style={{
          width: '248px',
          minHeight: content.hasDetailText ? '168px' : '128px',
          padding: '16px'
        }}
      >
        {/* Content Area */}
        <div className="flex-1 flex flex-col text-center">
          {/* Dynamic title positioning based on content type */}
          <h2 className={`text-sm font-gilroy-medium ${
            content.hasDetailText
              ? 'mb-1 -mt-1' // Detailed layout: space for content
              : 'pt-5 mb-2' // Simple layout: 20px + 16px container padding = 36px total
          }`} style={content.hasDetailText ? { paddingTop: '9px' } : {}}>
            {content.title}
          </h2>

          {/* Detail text section for hasDetailText popups */}
          {content.hasDetailText && content.detailText && (
            <div className="flex-1 flex items-start justify-center mt-1">
              <p
                className="text-[#D70127] text-[12px] font-[GilroyRegular]"
                style={{ lineHeight: '14px', margin: '-2px 0' }}
              >
                {content.detailText}
              </p>
            </div>
          )}

          {/* Original content for useDefault popups */}
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
