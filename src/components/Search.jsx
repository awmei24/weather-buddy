import React from 'react';
import { SearchResultList, SearchResultItem, ResultName, ResultDetail, SearchStatus } from '../styles.js';

// listId is the listbox's id; each option's id is `${listId}-${index}`
export function SearchResults({ listId, query, suggestions, loading, error, activeIndex, onSelect, onHover }) {
    if (error) {
        return <SearchStatus role='status'>Couldn’t search right now.</SearchStatus>;
    }
    if (!suggestions.length) {
        return (
            <SearchStatus role='status'>
                {loading ? 'Searching...' : `No places match “${query}”. Try a city name or ZIP code.`}
            </SearchStatus>
        );
    }

    return (
        <SearchResultList id={listId} role='listbox'>
            {suggestions.map((item, index) => {
                // Skip parts that are empty or repeat the place name
                const detail = [item.region, item.country]
                    .filter((part) => part && part !== item.name)
                    .join(', ');

                return (
                    <SearchResultItem
                        key={item.id}
                        id={`${listId}-${index}`}
                        role='option'
                        aria-selected={index === activeIndex}
                        $active={index === activeIndex}
                        onMouseEnter={() => onHover(index)}
                        onMouseDown={(e) => {
                            // Keep focus in the input so the box doesn't close first
                            e.preventDefault();
                            onSelect(item);
                        }}
                    >
                        <ResultName>{item.name}</ResultName>
                        {detail && <ResultDetail>{detail}</ResultDetail>}
                    </SearchResultItem>
                );
            })}
        </SearchResultList>
    );
}
