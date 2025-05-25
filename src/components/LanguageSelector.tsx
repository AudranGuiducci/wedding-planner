import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <div className="flex items-center">
      <label htmlFor="language-select" className="mr-2 text-gray-700">
        {t('header.languageSelector')}:
      </label>
      <select
        id="language-select"
        value={i18n.language}
        onChange={changeLanguage}
        className="bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-gray-50"
        style={{ 
          fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif"
        }}
      >
        <option value="en">🇬🇧 English</option>
        <option value="fr">🇫🇷 Français</option>
        <option value="ja">🇯🇵 日本語</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
