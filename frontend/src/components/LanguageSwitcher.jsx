// src/components/LanguageSwitcher.js
import  { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";

const LanguageSwitcher = () => {
  const { language, toggleLanguage } = useContext(LanguageContext);

  return (
    <button
      onClick={toggleLanguage}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
    >
      {language === "en" ? "اردو" : "English"}
    </button>
  );
};

export default LanguageSwitcher;