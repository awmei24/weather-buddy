import React, { useEffect } from 'react';
import { SearchResultList, SearchResultItem } from '../styles.js';
import { useAutocomplete } from '../hook.js';

export function SearchResults({ query, onSelect, onTopResult }) {
    const { suggestions, error } = useAutocomplete(query);
    
    useEffect(() => {
      if (suggestions.length > 0 && onTopResult) {
        onTopResult(suggestions[0]);
      }
    }, [suggestions]);

    if (error) return <div className='search-error'>No suggestions found.</div>;
    if (!suggestions.length) return <div className='search-no-results' style={{ fontSize: "18px" }}>No suggestions found.</div>;

    console.log(suggestions)

    return (
        <SearchResultList>
            {suggestions.slice(0,5).map((item) => (
                <SearchResultItem key={item.id} 
                    onMouseDown={() => onSelect({ lat: item.lat, lon: item.lon })}
                >
                    {item.name}, {item.region}, {item.country}
                </SearchResultItem>
            ))}
        </SearchResultList>
    );
}