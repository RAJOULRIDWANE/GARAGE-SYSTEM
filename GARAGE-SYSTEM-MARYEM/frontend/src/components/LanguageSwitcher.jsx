import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('i18nextLng', lng);
    };

    return (
        <div className="language-switcher">
            <select
                value={i18n.language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="lang-select"
            >
                <option value="en">🇺🇸 English</option>
                <option value="fr">🇫🇷 Français</option>
                <option value="ar">🇲🇦 العربية</option>
            </select>
        </div>
    );
};

export default LanguageSwitcher;
