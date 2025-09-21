import React from 'react'
import { X, Calendar, Briefcase, Mail } from "lucide-react"

const LeavePopUp = ({
  name,
  avatar,
  type,
  from,
  to,
  days,
  status,
  reason,
  approver,
  comment,
  onClose
}) => {
  const getStatusColor = () => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700"
      case "Pending":
        return "bg-yellow-100 text-yellow-700"
      case "Rejected":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  // Example activity log (replace with real data)
  const activityLog = [
    {
      time: "12:30",
      date: "31 Dec 2025",
      actor: "Adam Wael",
      role: "Employee",
      action: "Created",
      actionColor: "bg-blue-100 text-blue-700",
    },
    {
      time: "12:30",
      date: "31 Dec 2025",
      actor: "Shamy Wael",
      role: "Team Lead",
      action: "Viewed",
      actionColor: "bg-gray-100 text-gray-700",
    },
    {
      time: "12:30",
      date: "31 Dec 2025",
      actor: "Shamy Wael",
      role: "Team Lead",
      action: "Approved",
      actionColor: "bg-green-100 text-green-700",
    },
    {
      time: "12:30",
      date: "31 Dec 2025",
      actor: "Omar Wael",
      role: "HR",
      action: "Reject",
      actionColor: "bg-red-100 text-red-700",
    },
  ]

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-2">
      <div className="w-full max-w-2xl bg-[var(--bg-color)] rounded-2xl shadow-2xl border border-[var(--border-color)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div className="flex items-center gap-4">
            <img
              src={avatar}
              alt={name}
              className="w-16 h-16 rounded-full object-cover border border-[--border-color]"
            />
            <div>
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-[var(--text-color)]">{name}</span>
                <span className={`px-4 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
                  {status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[var(--text-color)] mt-1">
                <Briefcase className="w-4 h-4" />
                <span>Project Manager</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--text-color)] mt-1">
                <Mail className="w-4 h-4" />
                <span>brooklyn.s@example.com</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
          >
            <X className="w-6 h-6 text-black" />
          </button>
        </div>
        {/* Leave type and dates */}
        <div className="flex items-center gap-6 px-6 py-2">
          <span className="text-[var(--text-color)] text-base">Leave type <span className="font-bold text-[var(--text-color)]">{type}</span></span>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-500" />
            <span className="text-[var(--text-color)] font-medium">From</span>
            <span className="text-[var(--text-color)]">{from}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-500" />
            <span className="text-[var(--text-color)] font-medium">To</span>
            <span className="text-[var(--text-color)]">{to}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-500" />
            <span className="text-[var(--text-color)] font-medium">Days</span>
            <span className="text-[var(--text-color)]">{days}</span>
          </div>
        </div>
        {/* Reason */}
        <div className="px-6 pt-4">
          <div className="text-[var(--text-color)] font-semibold mb-2">Reason</div>
          <div className="bg-[var(--bg-color)] rounded-xl p-4 text-[var(--text-color)] text-base">
            {reason}
          </div>
        </div>
        {/* Approve/Reject buttons */}
        <div className="flex gap-4 px-6 py-4">
          <button className="flex-1 bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-500 hover:to-cyan-500 text-white font-semibold py-2 rounded-lg transition">
            Approve
          </button>
          <button className="flex-1 bg-red-700 hover:bg-red-800 text-white font-semibold py-2 rounded-lg transition">
            Reject
          </button>
        </div>
        {/* Approved By & Comment */}
        <div className="px-6 pb-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-[var(--text-color)]">Shamy</span>
            <span className="text-[var(--text-color)] text-sm">Team Lead</span>
            <span className="ml-6 text-[var(--text-color)] font-medium">Comment</span>
            <div className="flex-1">
              <div className="bg-[var(--bg-color)] rounded-xl px-4 py-2 text-[var(--text-color)] text-base">
                {comment || "Et aliquid nihil fugit sunt e"}
              </div>
            </div>
          </div>
        </div>
        {/* Activity Log */}
        <div className="bg-[var(--bg-color)] border-t border-[var(--border-color)] px-6 pt-4 pb-6">
          <div className="grid grid-cols-5 gap-4 pb-2 border-b border-[var(--border-color)] text-sm font-semibold text-[var(--text-color)]">
            <div>Time</div>
            <div>Date</div>
            <div>Actor</div>
            <div>Role</div>
            <div>Action</div>
          </div>
          {activityLog.map((entry, idx) => (
            <div key={idx} className="grid grid-cols-5 gap-4 py-3 border-b border-gray-100 last:border-b-0 items-center">
              <div className="text-[var(--text-color)] text-sm">{entry.time}</div>
              <div className="text-[var(--text-color)] text-sm">{entry.date}</div>
              <div className="text-[var(--text-color)] text-sm">{entry.actor}</div>
              <div className="text-[var(--text-color)] text-sm">{entry.role}</div>
              <div>
                <span className={`px-3 py-1 rounded text-xs font-semibold ${entry.actionColor}`}>
                  {entry.action}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LeavePopUp
