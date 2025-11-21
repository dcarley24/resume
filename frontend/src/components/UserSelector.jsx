import React from 'react';

const UserSelector = ({ currentUser, onUserChange }) => {
    return (
        <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">Active User:</span>
            <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                {['User 1', 'User 2'].map((user) => (
                    <button
                        key={user}
                        onClick={() => onUserChange(user)}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${currentUser === user
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'text-gray-400 hover:text-white'
                            }`}
                        style={{
                            backgroundColor: currentUser === user ? 'var(--accent-primary)' : 'transparent',
                            color: currentUser === user ? 'white' : 'var(--text-secondary)'
                        }}
                    >
                        {user}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default UserSelector;
