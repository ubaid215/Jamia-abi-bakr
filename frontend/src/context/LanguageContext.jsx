/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

const translations = {
  en: {
    dailyReport: "Daily Report",
    date: "Date",
    sabaq: "Sabaq",
    sabqi: "Sabqi",
    manzil: "Manzil",
    condition: "Condition",
    attendance: "Attendance",
  },
  ur: {
    dailyReport: "روزانہ رپورٹ",
    date: "تاریخ",
    sabaq: "سبق",
    sabqi: "سبقی",
    manzil: "منزل",
    condition: "کیفیت",
    attendance: "حاضری",
  },
};

// Create the context
export const LanguageContext = createContext();

// Create the provider
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");

  const toggleLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === "en" ? "ur" : "en"));
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};