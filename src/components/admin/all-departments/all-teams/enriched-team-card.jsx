import React from "react";
import TeamCard from "./team-card";
import { useTeamDetails } from "./useTeamDetails";

/**
 * Wrapper component that enriches team data with members and leader details
 * then renders TeamCard
 */
export default function EnrichedTeamCard({ team, onEdit, onDelete }) {
    const enrichedTeam = useTeamDetails(team);
    
    return <TeamCard team={enrichedTeam} onEdit={onEdit} onDelete={onDelete} />;
}

