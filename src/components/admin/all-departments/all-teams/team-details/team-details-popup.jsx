import React from 'react';
import { X, Users, MapPin, Calendar, User } from 'lucide-react';
import TeamDetailsStatusCards from './status-cards';
import CenterContent from './center-content';
import SupervisorOverview from './supervisor';

const TeamDetailsPopup = ({ isOpen, onClose, team }) => {
    if (!isOpen) return null;

    // Use only real team data from API
    const teamData = team;
    
    if (!teamData) {
        return null; // Don't render if no team data
    }

    // Handle close with safety check
    const handleClose = () => {
        if (onClose && typeof onClose === 'function') {
            onClose();
        }
    };

    // Handle escape key
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            handleClose();
        }
    };

    // Add event listener for escape key
    React.useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-lg"
                onClick={handleClose}
            />

            {/* Popup Content */}
            <div
                className="relative bg-[var(--bg-all)] rounded-xl shadow-2xl border border-[var(--border-color)] p-6 m-4 animate-popup-scale"
                style={{ maxWidth: "1200px", width: "100%", maxHeight: "90vh" }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center">
                            <Users className="text-white" size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-[var(--text-color)]">
                                {teamData.name}
                            </h2>
                            <p className="text-[var(--sub-text-color)]">
                                {teamData.description}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 rounded-lg hover:bg-[var(--hover-color)] transition-colors"
                        title="Close"
                        type="button"
                    >
                        <X className="w-6 h-6" style={{ color: "var(--sub-text-color)" }} />
                    </button>
                </div>

                {/* Content */}
                <div className="max-h-[70vh] overflow-auto space-y-6">
                    {/* Status Cards - Only show real data from API */}
                    <TeamDetailsStatusCards teamData={teamData} />

                    {/* Center Content - Main Dashboard */}
                    <CenterContent team={teamData} />

                    {/* Supervisor Overview */}
                    <SupervisorOverview team={teamData} />
                </div>
            </div>
        </div>
    );
};

export default TeamDetailsPopup;
