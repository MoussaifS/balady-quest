import React from 'react';
import { FiUser, FiAward, FiCheckSquare, FiActivity, FiBookmark, FiGift, FiLogOut } from 'react-icons/fi';
import PlaceholderIcon from '../components/ui/PlaceholderIcon';

function UserProfileView({ user, experiences, onSelectExperience }) {
    if (!user) return <div className="p-4 text-center">Loading profile...</div>;

    const findExperience = (id) => experiences.find(exp => exp.id === id);
    const favoriteExperiences = experiences.filter(exp => user.savedExperiences?.includes(exp.id));

    return (
        <div className="p-4 pb-10">
            {/* User Header */}
            <div className="flex items-center space-x-4 mb-6 pb-4 border-b">
                {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-16 h-16 rounded-full object-cover border-2 border-cyan-500" />
                ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border-2 border-cyan-500">
                        <FiUser size={32} />
                    </div>
                )}
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
                    <p className="text-sm text-cyan-600 font-medium">{user.points?.toLocaleString() ?? 0} Points</p>
                </div>
            </div>

            {/* Badges/Awards */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center"><FiAward className="mr-2 text-amber-500" /> Badges</h3>
                {user.badges && user.badges.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {user.badges.map(badge => (
                            <div key={badge.id} className="flex flex-col items-center p-2 border rounded-lg bg-yellow-50 w-20 text-center" title={`${badge.name} (${badge.date})`}>
                                {badge.icon ? <badge.icon size={24} className="text-yellow-600 mb-1" /> : <FiAward size={24} className="text-yellow-600 mb-1" />}
                                <span className="text-xs text-yellow-800 font-medium line-clamp-2">{badge.name}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 italic">No badges earned yet.</p>
                )}
            </div>

            {/* Prizes (Placeholder) */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center"><FiGift className="mr-2 text-purple-500" /> My Prizes</h3>
                {/* Logic to display claimed prizes */}
                <p className="text-sm text-gray-500 italic">You haven't claimed any prizes yet.</p>
                {/* Example:
                     <div className="border rounded p-2 bg-purple-50 text-sm">Cafe Voucher - Valid until ...</div>
                 */}
            </div>

            {/* Completed Experiences */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center"><FiCheckSquare className="mr-2 text-green-500" /> Completed</h3>
                {user.completedExperiences && user.completedExperiences.length > 0 ? (
                    <div className="space-y-2">
                        {user.completedExperiences.map(comp => {
                            const exp = findExperience(comp.id);
                            return (
                                <div key={comp.id} onClick={() => exp && onSelectExperience(exp)} className={`flex items-center justify-between p-2 border rounded-lg cursor-pointer ${exp ? 'hover:bg-gray-100' : ''}`}>
                                    <div>
                                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded mr-2 ${comp.type === 'Kunuz' ? 'bg-cyan-100 text-cyan-700' : 'bg-teal-100 text-teal-700'}`}>{comp.type}</span>
                                        <span className="text-sm font-medium text-gray-800">{comp.title}</span>
                                    </div>
                                    <span className="text-xs text-gray-500">{comp.date}</span>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 italic">No experiences completed yet.</p>
                )}
            </div>

            {/* Ongoing Experiences */}
            {user.ongoingExperiences && user.ongoingExperiences.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center"><FiActivity className="mr-2 text-blue-500" /> Ongoing</h3>
                    <div className="space-y-2">
                        {user.ongoingExperiences.map(ongoing => {
                            const exp = findExperience(ongoing.id);
                            return (
                                <div key={ongoing.id} onClick={() => exp && onSelectExperience(exp)} className={`flex items-center justify-between p-2 border rounded-lg cursor-pointer ${exp ? 'hover:bg-gray-100' : ''}`}>
                                    <div>
                                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded mr-2 ${ongoing.type === 'Kunuz' ? 'bg-cyan-100 text-cyan-700' : 'bg-teal-100 text-teal-700'}`}>{ongoing.type}</span>
                                        <span className="text-sm font-medium text-gray-800">{ongoing.title}</span>
                                    </div>
                                    {ongoing.progress !== undefined && <span className="text-xs text-blue-600">{ongoing.progress}% Complete</span>}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Saved/Favorite Experiences */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center"><FiBookmark className="mr-2 text-red-500" /> Saved Experiences</h3>
                {favoriteExperiences.length > 0 ? (
                    <div className="space-y-2">
                        {favoriteExperiences.map(exp => (
                            <div key={exp.id} onClick={() => onSelectExperience(exp)} className="flex items-center p-2 border rounded-lg cursor-pointer hover:bg-gray-100">
                                {exp.imageUrl ? <img src={exp.imageUrl} alt="" className="w-10 h-10 rounded mr-3 object-cover"/> : <PlaceholderIcon className="w-10 h-10 rounded mr-3 flex-shrink-0"/>}
                                <div>
                                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded mr-2 ${exp.type === 'Kunuz' ? 'bg-cyan-100 text-cyan-700' : 'bg-teal-100 text-teal-700'}`}>{exp.type}</span>
                                    <span className="text-sm font-medium text-gray-800">{exp.title}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 italic">You haven't saved any experiences yet.</p>
                )}
            </div>

            {/* Settings/Logout */}
            <div className="mt-8">
                <button className="w-full text-left p-2 text-gray-600 hover:bg-gray-100 rounded flex items-center space-x-2">
                    {/* <FiSettings size={18}/> <span>Settings</span> */}
                </button>
                <button className="w-full text-left p-2 text-red-600 hover:bg-red-50 rounded flex items-center space-x-2">
                    <FiLogOut size={18}/> <span>Logout</span>
                </button>
            </div>

        </div>
    );
}

export default UserProfileView;