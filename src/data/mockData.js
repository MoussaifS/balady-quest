import { FiAward, FiBox, FiCamera, FiHelpCircle, FiMapPin, FiSmile } from 'react-icons/fi';

export const mockExperiences = [
    // --- Kunuz (Scavenger Hunts) ---
    {
        id: 'k1',
        type: 'Kunuz',
        title: 'Historic Jeddah Treasure Trail',
        description: "Uncover the hidden gems of Al-Balad! Solve clues, scan markers, and race against time to find the final treasure. A fun challenge for history buffs.",
        imageUrl: '/images/placeholder-jeddah.png', // Use relative paths or import images
        creator: 'Balady Official',
        category: 'Culture',
        rating: 4.8,
        difficulty: 'Medium',
        prize: { icon: FiAward, text: 'Exclusive Balady Explorer Badge & Cafe Voucher' },
        timeLimit: '2h 0m', // Or represent in seconds if needed for calculation
        status: 'active', // 'active', 'upcoming', 'finished'
        points: 150,
        steps: [
            { id: 'k1s1', type: 'location', hint: 'Start at the historic Naseef House. Find the oldest door.', location: [21.4858, 39.1864], points: 20 },
            { id: 'k1s2', type: 'qa', hint: 'Near Baeshen House, what year is inscribed above the main entrance?', location: [21.4865, 39.1859], question: 'What year is inscribed above the main entrance?', answer: '1325', points: 30 },
            { id: 'k1s3', type: 'qr', hint: 'Find the QR code hidden near the Matbouli House Museum entrance.', location: [21.4870, 39.1868], qrValue: 'BALADYJEDDAHSECRET1', points: 40 },
            { id: 'k1s4', type: 'photo', hint: 'Take a picture of the most colorful Roshan (wooden lattice window) you can find in the Souq Al Alawi area.', location: [21.4850, 39.1875], photoPrompt: 'Capture a vibrant Roshan', points: 30 },
            { id: 'k1s5', type: 'location', hint: 'The final clue awaits at the Bab Makkah gate. Reach it to claim your prize!', location: [21.4833, 39.1911], points: 30 },
        ],
        leaderboard: [
            { rank: 1, name: 'Speedy Explorers', score: 150, time: '1h 15m' },
            { rank: 2, name: 'Team Al-Balad', score: 150, time: '1h 28m' },
            { rank: 3, name: 'Desert Nomads', score: 120, time: '1h 45m' },
        ]
    },
    {
        id: 'k2',
        type: 'Kunuz',
        title: 'Riyadh Park Runner Challenge',
        description: "Test your speed and observation skills in Riyadh Park. Complete quick tasks at different landmarks. Fastest times win!",
        imageUrl: '/images/placeholder-riyadh.png',
        creator: 'Riyadh Municipality',
        category: 'Sports',
        rating: 4.5,
        difficulty: 'Easy',
        prize: { icon: FiBox, text: 'Sports Store Discount Coupon' },
        timeLimit: '1h 0m',
        status: 'upcoming',
        points: 100,
        steps: [
            { id: 'k2s1', type: 'location', hint: 'Start at the main fountain.', location: [24.7500, 46.6900], points: 25 }, // Placeholder coords
            { id: 'k2s2', type: 'photo', hint: 'Take a selfie with the giant flower sculpture.', location: [24.7510, 46.6910], photoPrompt: 'Selfie with flower sculpture', points: 35 },
            { id: 'k2s3', type: 'location', hint: 'Reach the boating lake viewpoint.', location: [24.7490, 46.6920], points: 40 },
        ],
        leaderboard: []
    },

    // --- Masarat (Experiences) ---
    {
        id: 'm1',
        type: 'Masarat',
        title: 'Al Khobar Corniche Art Walk',
        description: "Enjoy a relaxing stroll along the Khobar Corniche, discovering beautiful sculptures and viewpoints. Learn about each piece as you go.",
        imageUrl: '/images/placeholder-khobar.png',
        creator: 'Eastern Province Tourism',
        category: 'Art & Culture',
        rating: 4.6,
        difficulty: 'Easy',
        estimatedDuration: '1h 30m',
        path: [
            { id: 'm1p1', title: 'The Pearl Monument', description: 'Iconic landmark representing the region\'s heritage.', location: [26.2917, 50.2187], imageUrl: '/images/placeholder-pearl.png' },
            { id: 'm1p2', title: 'Kinetic Wind Sculpture', description: 'A mesmerizing piece that moves with the sea breeze.', location: [26.2930, 50.2195], imageUrl: '/images/placeholder-wind.png' },
            { id: 'm1p3', title: 'Calligraphy Bench', description: 'Rest on this unique bench featuring Arabic calligraphy.', location: [26.2945, 50.2205], imageUrl: '/images/placeholder-bench.png' },
            { id: 'm1p4', title: 'Seagull Flock Installation', description: 'A dynamic representation of coastal life.', location: [26.2960, 50.2215], imageUrl: '/images/placeholder-seagulls.png' },
        ],
    },
    {
        id: 'm2',
        type: 'Masarat',
        title: 'Dammam Heritage Trail',
        description: "Explore the historical roots of Dammam, visiting key sites that tell the story of the city's past.",
        imageUrl: '/images/placeholder-dammam.png',
        creator: 'Balady Official',
        category: 'History',
        rating: 4.3,
        difficulty: 'Medium',
        estimatedDuration: '2h 0m',
        path: [
            { id: 'm2p1', title: 'Old Dammam Port Area', description: 'Witness the remnants of the original fishing port.', location: [26.4333, 50.1167], imageUrl: '/images/placeholder-port.png' },
            { id: 'm2p2', title: 'Heritage Village (Replica)', description: 'Experience traditional architecture and crafts.', location: [26.4300, 50.1100], imageUrl: '/images/placeholder-village.png' }, // Example location
            { id: 'm2p3', title: 'King Fahd Park Mosque', description: 'Notable architectural landmark in the area.', location: [26.4250, 50.1050], imageUrl: '/images/placeholder-mosque.png' },
        ],
    }
];

export const mockUserProfile = {
    name: 'Abdullah Alghamdi',
    avatarUrl: '/images/user-avatar.png', // Placeholder
    points: 1850,
    badges: [
        { id: 'b1', name: 'Jeddah Explorer', icon: FiAward, date: '2024-03-15' },
        { id: 'b2', name: 'Riyadh Runner Bronze', icon: FiBox, date: '2024-02-10' },
        { id: 'b3', name: 'First Discovery', icon: FiSmile, date: '2024-01-20' },
    ],
    completedExperiences: [
        { id: 'k1', title: 'Historic Jeddah Treasure Trail', date: '2024-03-15', type: 'Kunuz' },
        { id: 'm2', title: 'Dammam Heritage Trail', date: '2024-02-28', type: 'Masarat' },
    ],
    ongoingExperiences: [
        // { id: 'k2', title: 'Riyadh Park Runner Challenge', progress: 33, type: 'Kunuz' } // Example
    ],
    savedExperiences: ['m1'] // IDs of saved experiences
};