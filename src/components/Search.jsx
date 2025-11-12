import { useAutocomplete } from '../hook.js';

export function SearchResults({ query, onSelect }) {
    const { suggestions, error } = useAutocomplete(query);
    
    if (error) return <div className='search-error'>No suggestions found.</div>;
    if (!suggestions.length) return <div className='search-no-results'>No suggestions found.</div>;

    console.log(suggestions)

    return (
        <ul className='search-results'>
            {suggestions.slice(0,5).map((item) => (
                <li key={item.id} 
                    className='search-result-item'
                    onMouseDown={() => onSelect({ lat: item.lat, lon: item.lon })}
                >
                    {item.name}, {item.region}, {item.country}
                </li>
            ))}
        </ul>
    );
}