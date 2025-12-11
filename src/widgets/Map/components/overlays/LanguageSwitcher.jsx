import { useState, useEffect, useRef } from "react";
import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import GBFlag from "../../../../assets/flags/gbFlag.svg?react";
import PLFlag from "../../../../assets/flags/plFlag.svg?react";

const expandedStyles = `
  @keyframes slideDown {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      transform: translateY(0);
      opacity: 1;
    }
    to {
      transform: translateY(-100%);
      opacity: 0;
    }
  }

  .language-expanded-content {
    animation: slideDown 0.3s ease-out forwards;
  }

  .language-closing {
    animation: slideUp 0.3s ease-out forwards;
  }
`;

const LANGUAGES = [
  { code: "en", label: "English", Flag: GBFlag },
  { code: "pl", label: "Polski", Flag: PLFlag },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation("common");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const buttonRef = useRef(null);

  const [expandedTop, setExpandedTop] = useState(0);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsExpanded(false);
      setIsClosing(false);
    }, 300);
  };

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    handleClose();
  };

  useEffect(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setExpandedTop(rect.bottom + 5);
    }
  }, [isExpanded]);

  return (
    <>
      <style>{expandedStyles}</style>
      <div className="z-10">
        <button
          ref={buttonRef}
          onClick={() => {
            if (isExpanded) {
              handleClose();
            } else {
              setIsExpanded(true);
            }
          }}
          className={`z-10 w-8.5 h-8.5 flex items-center justify-center rounded-sm bg-clip-padding shadow-sm border-2 cursor-pointer border-[rgba(0,0,0,0.2)] hover:bg-gray-100 dark:hover:bg-gray-600 ${
            isExpanded ? 'bg-gray-200 dark:bg-gray-500' : 'bg-white dark:bg-gray-700'
          }`}
          aria-label="Change language"
        >
          <Languages className="w-5 h-5 text-gray-900 dark:text-gray-100" strokeWidth={1.5} />
        </button>

        {(isExpanded || isClosing) && (
          <div
            className={`fixed bg-white dark:bg-gray-700 rounded-sm border-2 border-[rgba(0,0,0,0.2)] bg-clip-padding shadow-sm flex flex-col gap-1 p-1.5 ${
              isClosing ? 'language-closing' : 'language-expanded-content'
            }`}
            style={{
              top: `${expandedTop}px`,
              right: `10px`,
            }}
          >
            {LANGUAGES.map((lang) => {
              const FlagComponent = lang.Flag;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`px-3 py-2 rounded transition-colors text-sm flex items-center gap-2 cursor-pointer ${
                    i18n.language === lang.code
                      ? 'bg-gray-200 dark:bg-gray-600 font-semibold'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <FlagComponent className="w-5 h-4 shrink-0" />
                  <span className="text-gray-900 dark:text-gray-100">{lang.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default LanguageSwitcher;
