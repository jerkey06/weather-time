import { useState, useEffect, useRef } from 'react';

const SearchBar = ({ onSearch, theme }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) && 
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchSuggestions = async (input) => {
    if (!input) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=5&appid=f9983b23412d9b6c7ed6d21c4ba563c0`
      );
      const data = await response.json();
      
      const formattedSuggestions = data.map(city => ({
        name: city.name,
        country: city.country,
        fullName: `${city.name}, ${city.country}`
      }));
      
      setSuggestions(formattedSuggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    if (!value) {
      setSuggestions([]);
      setShowSuggestions(true);
      return;
    }
    
    fetchSuggestions(value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.fullName);
    setShowSuggestions(false);
    
    if (!searchHistory.some(item => item.fullName === suggestion.fullName)) {
      setSearchHistory(prevHistory => {
        const newHistory = [suggestion, ...prevHistory.slice(0, 4)];
        return newHistory;
      });
    } else {
      setSearchHistory(prevHistory => {
        const filteredHistory = prevHistory.filter(item => item.fullName !== suggestion.fullName);
        return [suggestion, ...filteredHistory];
      });
    }
    
    onSearch(suggestion.fullName);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setShowSuggestions(false);
      
      const newItem = { fullName: query, name: query.split(',')[0], country: query.split(',')[1]?.trim() || '' };
      
      if (!searchHistory.some(item => item.fullName === query)) {
        setSearchHistory(prevHistory => [newItem, ...prevHistory.slice(0, 4)]);
      }
      
      onSearch(query);
    }
  };

  const removeFromHistory = (e, item) => {
    e.stopPropagation();
    setSearchHistory(prevHistory => 
      prevHistory.filter(historyItem => historyItem.fullName !== item.fullName)
    );
  };

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        className={`py-3 px-6 w-full text-lg rounded-3xl border-gray-200 placeholder:text-gray-400 focus:outline-none shadow-md ${
          theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        }`}
        placeholder="Buscar ciudad..."
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowSuggestions(true)}
      />
      
      {showSuggestions && (
        <div 
          ref={suggestionsRef}
          className={`absolute mt-1 w-full rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto ${
            theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}
        >
          {loading && (
            <div className="p-3 text-center">
              <div className="animate-pulse">Buscando...</div>
            </div>
          )}
          
          {!loading && suggestions.length > 0 && (
            <div className="p-2">
              <div className="text-sm font-semibold px-3 py-1 text-gray-500">Sugerencias</div>
              {suggestions.map((suggestion, index) => (
                <div
                  key={`suggestion-${index}`}
                  className={`p-2 hover:bg-gray-100 rounded cursor-pointer flex items-center ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="mr-2">🔍</div>
                  <div>{suggestion.fullName}</div>
                </div>
              ))}
            </div>
          )}
          
          {!loading && searchHistory.length > 0 && (
            <div className="p-2 border-t">
              <div className="text-sm font-semibold px-3 py-1 text-gray-500">Búsquedas recientes</div>
              {searchHistory.map((item, index) => (
                <div
                  key={`history-${index}`}
                  className={`p-2 hover:bg-gray-100 rounded cursor-pointer flex items-center justify-between ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => handleSuggestionClick(item)}
                >
                  <div className="flex items-center">
                    <div className="mr-2">⏱️</div>
                    <div>{item.fullName}</div>
                  </div>
                  <button
                    className={`text-xs px-2 rounded-full ${
                      theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                    }`}
                    onClick={(e) => removeFromHistory(e, item)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {!loading && suggestions.length === 0 && searchHistory.length === 0 && (
            <div className="p-3 text-center text-gray-500">
              No hay sugerencias disponibles
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;