import React, {useState} from "react";
import languageList from "./language.json";
import axios from "axios";

export default function Translator() {
  const [inputFormat, setInputFormat] = useState("en");
  const [outputFormat, setOutputFormat] = useState("hi");
  const [translatedText, setTranslatedText] = useState("");
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const api = import.meta.env.VITE_IMP_KEY;

  const handleReverseLanguage = () => {
    setInputFormat(outputFormat);
    setOutputFormat(inputFormat);
    setInputText("");
  };

  const handleRemoveInputText = () => {
    setInputText("");
    setTranslatedText("Translation");
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setError("Please enter some text to translate.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const options = {
      method: "POST",
      url: "https://openl-translate.p.rapidapi.com/translate",
      headers: {
        "x-rapidapi-key": api,
        "x-rapidapi-host": "openl-translate.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      data: {
        target_lang: outputFormat,
        text: inputText,
      },
    };

    try {
      const response = await axios.request(options);
      setTranslatedText(response.data.translatedText);
    } catch (error) {
      setError("Failed to fetch translation. Please try again.");
      console.error("Translation Error:", error);
    } finally {
      setIsLoading(false);
      setInputText("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#1f1c2c] to-[#928dab] flex items-center justify-center p-4 ">
      <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-xl lg:max-w-3xl space-y-6">
        {/* Header */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 text-center uppercase tracking-wider ">
          Anuvadak
        </h1>

        {/* Language Selection */}
        <div className="flex flex-col md:flex-row items-center gap-4 sm:pl-6">
          <select
            value={inputFormat}
            onChange={(e) => setInputFormat(e.target.value)}
            className="w-full md:w-auto p-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {Object.keys(languageList).map((key) => (
              <option key={key} value={key}>
                {languageList[key].name}
              </option>
            ))}
          </select>

          <button
            onClick={handleReverseLanguage}
            className="p-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full shadow-lg focus:outline-none transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-6 h-6"
            >
              <path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z" />
            </svg>
          </button>

          <select
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
            className="w-full md:w-auto p-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {Object.keys(languageList).map((key) => (
              <option key={key} value={key}>
                {languageList[key].name}
              </option>
            ))}
          </select>
        </div>

        {/* Input Area */}
        <textarea
          value={inputText}
          placeholder="Enter text to translate..."
          onChange={(e) => setInputText(e.target.value)}
          className="w-full h-32 sm:h-40 p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
        />
        {inputText && (
          <button
            onClick={handleRemoveInputText}
            className="text-red-500 text-sm hover:underline"
          >
            Clear Text
          </button>
        )}

        {/* Output Area */}
        <div className="w-full p-4 bg-gray-50 border border-gray-300 rounded-lg text-center text-gray-700 shadow-inner">
          {translatedText || "Translation will appear here..."}
        </div>

        {/* Translate Button */}
        <button
          onClick={handleTranslate}
          disabled={isLoading}
          className={`w-full py-3 px-6 text-white font-semibold rounded-lg shadow-lg transition ${
            isLoading
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-500 hover:bg-indigo-600"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <i className="fa fa-spinner fa-spin"></i>
              <span>Translating...</span>
            </span>
          ) : (
            "Translate"
          )}
        </button>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
}
