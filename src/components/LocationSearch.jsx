import { useState, useEffect, useRef } from 'react';

function LocationSearch({ onSelect }) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const blurTimeout = useRef(null);
    const [isUserTyping, setIsUserTyping] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (query.length > 2 && isUserTyping) {
                fetchSuggestions(query);
            } else {
                setSuggestions([]);
            }
        }, 400); // debounce

        return () => clearTimeout(timeout);
    }, [query, isUserTyping]);

    const fetchSuggestions = async (input) => {
        setLoading(true);
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${input}&limit=5&addressdetails=1&countrycodes=in`
        );
        const data = await res.json();
        setSuggestions(data);
        setLoading(false);
    };

    const handleChange = (e) => {
        setIsUserTyping(true);
        setQuery(e.target.value);
    };

    const handleSelect = (place) => {
        setIsUserTyping(false);
        setQuery(place.display_name);
        setSuggestions([]);
        onSelect({
            name: place.display_name,
            lat: place.lat,
            lon: place.lon
        });
    };

    const handleBlur = () => {
        blurTimeout.current = setTimeout(() => {
            setSuggestions([]);
        }, 150);
    };

    const handleFocus = () => {
        if (blurTimeout.current) clearTimeout(blurTimeout.current);
    };

    return (
        <div className="relative w-full">
            <input
                type="text"
                className="w-full sm:w-[100%] p-3 border border-green-400 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Search for a location..."
                value={query}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
            />

            {loading && <p className="text-sm mt-1 text-gray-500">Loading...</p>}

            {suggestions.length > 0 && (
                <ul className="absolute bg-white border border-gray-300 w-full mt-1 max-h-60 overflow-y-auto rounded shadow z-10">
                    {suggestions.map((place, index) => (
                        <li
                            key={index}
                            className="p-2 hover:bg-green-100 cursor-pointer"
                            onClick={() => handleSelect(place)}
                        >
                            {place.display_name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default LocationSearch;
