import React, { useState } from 'react';
import ExperienceCard from '../components/ExperienceCard';
import FilterChip from '../components/FilterChip'; // Reuse filter chip
import { FiAward, FiPocket, FiHeart, FiCheckCircle, FiStar, FiTrendingUp, FiFilter, FiSliders } from 'react-icons/fi'; // Add FiFilter/Sliders

function ExperienceListView({ experiences, onExperienceSelect, onToggleFavorite, favoriteExperienceIds, listType }) {
    const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');
    const [sortBy, setSortBy] = useState('Popular'); // 'Popular', 'New', 'Rating'

    // Example categories - adjust based on your actual data
    const categories = [
        { id: 'All', label: 'All', icon: null },
        { id: 'Culture', label: 'Culture', icon: FiAward },
        { id: 'Parks', label: 'Parks', icon: FiPocket },
        { id: 'Foodie', label: 'Foodie', icon: FiHeart },
        { id: 'Civic', label: 'Civic', icon: FiCheckCircle },
        // Add more categories as needed
    ];

    // --- Filtering ---
    const filteredExperiences = experiences.filter(exp => {
        if (activeCategoryFilter === 'All') return true;
        return exp.category === activeCategoryFilter;
    });

    // --- Sorting (Basic Example) ---
    const sortedExperiences = [...filteredExperiences].sort((a, b) => {
        if (sortBy === 'New') {
            // Requires a date field, assuming ID roughly represents creation order for mock data
            return (b.id > a.id) ? 1 : -1;
        }
        if (sortBy === 'Rating') {
            return (b.rating ?? 0) - (a.rating ?? 0); // Handle null ratings
        }
        // Default: Popular (requires 'joined' or similar metric - using rating as proxy here)
        return (b.rating ?? 0) - (a.rating ?? 0);
    });

    return (
        <div className="pb-4"> {/* Add padding bottom for scroll */}
            {/* --- Filters & Sorting Header --- */}
            <div className="sticky top-0 bg-white z-10 pt-2 pb-2 border-b border-gray-200">
                {/* Category Filters - Horizontal Scroll */}
                <div className="px-4 mb-2 flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-hide">
                    <span className="text-sm font-medium text-gray-500 flex-shrink-0">Category:</span>
                    {categories.map(filter => (
                        <FilterChip
                            key={filter.id}
                            label={filter.label}
                            icon={filter.icon}
                            isActive={activeCategoryFilter === filter.id}
                            onClick={() => setActiveCategoryFilter(filter.id)}
                        />
                    ))}
                </div>
                {/* Sorting Options */}
                <div className="px-4 flex items-center justify-between gap-x-4">
                    <div className="flex items-center space-x-3">
                        {/* Add more complex filter button if needed */}
                        {/* <button className="text-sm font-medium text-gray-600 hover:text-cyan-600 flex items-center space-x-1">
                                 <FiSliders size={16} /> <span>Filters</span>
                             </button> */}
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className="text-xs font-medium text-gray-500">Sort by:</span>
                        <button className={`text-xs font-medium flex items-center space-x-0.5 ${sortBy === 'Popular' ? 'text-cyan-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setSortBy('Popular')}> <FiStar size={14} /> <span>Popular</span> </button>
                        <button className={`text-xs font-medium flex items-center space-x-0.5 ${sortBy === 'New' ? 'text-cyan-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setSortBy('New')}> <FiTrendingUp size={14} /> <span>New</span> </button>
                        <button className={`text-xs font-medium ${sortBy === 'Rating' ? 'text-cyan-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setSortBy('Rating')}><span>Rating</span> </button>
                    </div>
                </div>
            </div>


            {/* --- Experience Card List --- */}
            <div className="p-4 space-y-3">
                {sortedExperiences.length > 0 ? (
                    sortedExperiences.map((exp) => (
                        <ExperienceCard
                            key={exp.id}
                            experience={exp}
                            onClick={onExperienceSelect}
                            onToggleFavorite={onToggleFavorite}
                            isFavorite={favoriteExperienceIds?.has(exp.id)}
                        />
                    ))
                ) : (
                    <p className="text-center text-gray-500 py-8">No {listType === 'Kunuz' ? 'hunts' : 'experiences'} found matching your filters.</p>
                )}
            </div>
        </div>
    );
}

export default ExperienceListView;