"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import LeavePopUp from "../leavePopUp/LeavePopUp"

// Sample leave request data
const leaveData = [
	{
		id: 1,
		name: "Darlene Robertson",
		avatar: "/assets/AdminDashboard/avatar.svg",
		type: "Annual",
		from: "31 Dec 2024",
		to: "10 Jan 2025",
		days: 1,
		status: "Pending",
		reason: "Travelling to village",
		approver: "--------",
	},
	{
		id: 2,
		name: "Darlene Robertson",
		avatar: "/assets/AdminDashboard/avatar.svg",
		type: "Sick",
		from: "31 Dec 2024",
		to: "31 Dec 2024",
		days: 2,
		status: "Rejected",
		reason: "Sorry.! I can't approve",
		approver: "Avinash",
		comment : "Get well soon!",
	},
	{
		id: 3,
		name: "Darlene Robertson",
		avatar: "/assets/AdminDashboard/avatar.svg",
		type: "Emergency",
		from: "25 Dec 2024",
		to: "25 Dec 2024",
		days: 1,
		status: "Pending",
		reason: "Travelling to village",
		approver: "--------",
	},
	{
		id: 4,
		name: "Darlene Robertson",
		avatar: "/assets/AdminDashboard/avatar.svg",
		type: "Unpaid",
		from: "10 Dec 2024",
		to: "13 Dec 2024",
		days: 3,
		status: "Pending",
		reason: "Travelling to village",
		approver: "--------",
	},
	{
		id: 5,
		name: "Darlene Robertson",
		avatar: "/assets/AdminDashboard/avatar.svg",
		type: "Annual",
		from: "8 Nov 2024",
		to: "13 Nov 2024",
		days: 5,
		status: "Pending",
		reason: "Travelling to village",
		approver: "--------",
		
	},
	{
		id: 6,
		name: "Darlene Robertson",
		avatar: "/assets/AdminDashboard/avatar.svg",
		type: "Annual",
		from: "8 Nov 2024",
		to: "13 Nov 2024",
		days: 5,
		status: "Approved",
		reason: "Travelling to village",
		approver: "Avinash",
		comment : "Enjoy your vacation!",
	},
	{
		id: 7,
		name: "Darlene Robertson",
		avatar: "/assets/AdminDashboard/avatar.svg",
		type: "Annual",
		from: "8 Nov 2024",
		to: "13 Nov 2024",
		days: 5,
		status: "Approved",
		reason: "Travelling to village",
		approver: "Avinash",
		comment : "Enjoy your vacation!",
	},
	{
		id: 8,
		name: "Darlene Robertson",
		avatar: "/assets/AdminDashboard/avatar.svg",
		type: "Annual",
		from: "8 Nov 2024",
		to: "13 Nov 2024",
		days: 5,
		status: "Approved",
		reason: "Travelling to village",
		approver: "Avinash",
		comment : "Enjoy your vacation!",
	},
	{
		id: 9,
		name: "Darlene Robertson",
		avatar: "/assets/AdminDashboard/avatar.svg",
		type: "Annual",
		from: "8 Nov 2024",
		to: "13 Nov 2024",
		days: 5,
		status: "Approved",
		reason: "Travelling to village",
		approver: "Avinash",	
		comment : "Enjoy your vacation!",
	},
	{
		id: 10,
		name: "Darlene Robertson",
		avatar: "/assets/AdminDashboard/avatar.svg",
		type: "Annual",
		from: "8 Nov 2024",
		to: "13 Nov 2024",
		days: 5,
		status: "Approved",
		reason: "Travelling to village",
		approver: "Avinash",
		comment : "Enjoy your vacation!",
	},
]

const getStatusBadge = (status, t) => {
	const baseClasses =
		"px-3 py-1 rounded-full text-xs font-medium inline-block border"
	switch (status) {
		case "Pending":
			return (
				<span
					className={`${baseClasses} bg-[var(--pending-leave-box-bg)] text-[var(--warning-color)] border-[var(--warning-color)]`}
				>
					{t("adminLeaves.status.pending")}
				</span>
			)
		case "Rejected":
			return (
				<span
					className={`${baseClasses} bg-[var(--rejected-leave-box-bg)] text-[var(--error-color)] border-[var(--error-color)]`}
				>
					{t("adminLeaves.status.rejected")}
				</span>
			)
		case "Approved":
			return (
				<span
					className={`${baseClasses} bg-[var(--approved-leave-box-bg)] text-[var(--success-color)] border-[var(--success-color)]`}
				>
					{t("adminLeaves.status.approved")}
				</span>
			)
		default:
			return (
				<span
					className={`${baseClasses} bg-[var(--container-color)] text-[var(--sub-text-color)] border-[var(--border-color)]`}
				>
					{status}
				</span>
			)
	}
}

const LeavesTable = () => {
	const { t } = useTranslation()
	const [sortBy, setSortBy] = useState(t("adminLeaves.table.sort.newest"))
	const [leaveType, setLeaveType] = useState(t("adminLeaves.table.leaveType.all"))
	const [status, setStatus] = useState(t("adminLeaves.table.status.all"))
	const [dateFrom, setDateFrom] = useState("00/00/2025")
	const [dateTo, setDateTo] = useState("00/00/2025")
	const [selectedLeave, setSelectedLeave] = useState(null)

	return (
		<>
			{selectedLeave && (
				<LeavePopUp
					name={selectedLeave.name}
					avatar={selectedLeave.avatar}
					type={selectedLeave.type}
					from={selectedLeave.from}
					to={selectedLeave.to}
					days={selectedLeave.days}
					status={selectedLeave.status}
					reason={selectedLeave.reason}
					approver={{
						name: selectedLeave.approver,
						role: selectedLeave.status === "Approved" ? "Team Lead" : "",
						avatar: selectedLeave.approverAvatar,
					}}
					comment={selectedLeave.comment}
					onClose={() => setSelectedLeave(null)}
				/>
			)}
			<div className="bg-[var(--bg-color)] rounded-lg border border-[var(--border-color)]">
				{/* Header with filters */}
				<div className="px-6 py-4 border-b flex justify-center items-center bg-[var(--bg-color)]">
					<div className="flex bg-[var(--bg-color)] p-4 w-[98%] h-max shadow-xl rounded-3xl border border-[var(--border-color)] flex-wrap items-center gap-4 justify-between">
						<div className="flex flex-wrap items-center gap-4">
							<div className="flex items-center gap-2">
								<span className="text-[10px] font-medium text-[var(--sub-text-color)]">
									{t("adminLeaves.table.sortBy")}
								</span>
								<select
									value={sortBy}
									onChange={(e) => setSortBy(e.target.value)}
									className="h-8 px-3 border border-[var(--border-color)] rounded-md text-[10px] bg-[var(--bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)]"
								>
									<option value={t("adminLeaves.table.sort.newest")}>{t("adminLeaves.table.sort.newest")}</option>
									<option value={t("adminLeaves.table.sort.oldest")}>{t("adminLeaves.table.sort.oldest")}</option>
								</select>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-[10px] font-medium text-[var(--sub-text-color)]">
									{t("adminLeaves.table.leaveType.label")}
								</span>
								<select
									value={leaveType}
									onChange={(e) => setLeaveType(e.target.value)}
									className="h-8 px-3 border border-[var(--border-color)] rounded-md text-[10px] bg-[var(--bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)]"
								>
									<option value={t("adminLeaves.table.leaveType.all")}>{t("adminLeaves.table.leaveType.all")}</option>
									<option value={t("adminLeaves.table.leaveType.annual")}>{t("adminLeaves.table.leaveType.annual")}</option>
									<option value={t("adminLeaves.table.leaveType.sick")}>{t("adminLeaves.table.leaveType.sick")}</option>
									<option value={t("adminLeaves.table.leaveType.emergency")}>{t("adminLeaves.table.leaveType.emergency")}</option>
									<option value={t("adminLeaves.table.leaveType.unpaid")}>{t("adminLeaves.table.leaveType.unpaid")}</option>
								</select>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-[10px] font-medium text-[var(--sub-text-color)]">
									{t("adminLeaves.table.status.label")}
								</span>
								<select
									value={status}
									onChange={(e) => setStatus(e.target.value)}
									className="h-8 px-3 border border-[var(--border-color)] rounded-md text-[10px] bg-[var(--bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)]"
								>
									<option value={t("adminLeaves.table.status.all")}>{t("adminLeaves.table.status.all")}</option>
									<option value={t("adminLeaves.table.status.pending")}>{t("adminLeaves.table.status.pending")}</option>
									<option value={t("adminLeaves.table.status.rejected")}>{t("adminLeaves.table.status.rejected")}</option>
									<option value={t("adminLeaves.table.status.approved")}>{t("adminLeaves.table.status.approved")}</option>
								</select>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-[10px] font-medium text-[var(--sub-text-color)]">
									{t("adminLeaves.table.dateFrom")}
								</span>
								<select
									value={dateFrom}
									onChange={(e) => setDateFrom(e.target.value)}
									className="h-8 px-3 border border-[var(--border-color)] rounded-md text-[10px] bg-[var(--bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)]"
								>
									<option value="00/00/2025">00/00/2025</option>
								</select>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-[10px] font-medium text-[var(--sub-text-color)]">
									{t("adminLeaves.table.dateTo")}
								</span>
								<select
									value={dateTo}
									onChange={(e) => setDateTo(e.target.value)}
									className="h-8 px-3 border border-[var(--border-color)] rounded-md text-[10px] bg-[var(--bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)]"
								>
									<option value="00/00/2025">00/00/2025</option>
								</select>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<span className="text-[10px] text-[var(--sub-text-color)]">
								{t("adminLeaves.table.pageOf", { page: 5, total: 18 })}
							</span>
							<div className="flex items-center gap-1">
								<button className="h-8 w-8 border border-[var(--border-color)] rounded-md bg-[var(--bg-color)] hover:bg-[var(--hover-color)] flex items-center justify-center transition-colors">
									<svg
										className="h-4 w-4 text-[var(--sub-text-color)]"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M15 19l-7-7 7-7"
										/>
									</svg>
								</button>
								<button className="h-8 w-8 border border-[var(--border-color)] rounded-md bg-[var(--bg-color)] hover:bg-[var(--hover-color)] flex items-center justify-center transition-colors">
									<svg
										className="h-4 w-4 text-[var(--sub-text-color)]"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 5l7 7-7 7"
										/>
									</svg>
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Table */}
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-[var(--table-header-bg)]">
							<tr>
								<th className="text-left py-3 px-6 text-sm font-medium text-[var(--sub-text-color)] border-b border-[var(--border-color)]">
									{t("adminLeaves.table.columns.name")}
								</th>
								<th className="text-left py-3 px-6 text-sm font-medium text-[var(--sub-text-color)] border-b border-[var(--border-color)]">
									{t("adminLeaves.table.columns.leaveType")}
								</th>
								<th className="text-left py-3 px-6 text-sm font-medium text-[var(--sub-text-color)] border-b border-[var(--border-color)]">
									{t("adminLeaves.table.columns.from")}
								</th>
								<th className="text-left py-3 px-6 text-sm font-medium text-[var(--sub-text-color)] border-b border-[var(--border-color)]">
									<div className="flex items-center gap-1 cursor-pointer">
										{t("adminLeaves.table.columns.to")}
										<svg
											className="h-3 w-3 text-gray-400"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M19 9l-7 7-7-7"
											/>
										</svg>
									</div>
								</th>
								<th className="text-left py-3 px-6 text-sm font-medium text-[var(--sub-text-color)] border-b border-[var(--border-color)]">
									{t("adminLeaves.table.columns.days")}
								</th>
								<th className="text-left py-3 px-6 text-sm font-medium text-[var(--sub-text-color)] border-b border-[var(--border-color)]">
									{t("adminLeaves.table.columns.status")}
								</th>
								<th className="text-left py-3 px-6 text-sm font-medium text-[var(--sub-text-color)] border-b border-[var(--border-color)]">
									{t("adminLeaves.table.columns.reason")}
								</th>
								<th className="text-left py-3 px-6 text-sm font-medium text-[var(--sub-text-color)] border-b border-[var(--border-color)]">
									{t("adminLeaves.table.columns.approver")}
								</th>
								<th className="text-left py-3 px-6 text-sm font-medium text-[var(--sub-text-color)] border-b border-[var(--border-color)]">
									{t("adminLeaves.table.columns.action")}
								</th>
							</tr>
						</thead>
						<tbody className="bg-[var(--table-bg)]">
							{leaveData.map((leave, index) => (
								<tr
									key={leave.id}
									className="border-b border-[var(--border-color)] hover:bg-[var(--hover-color)] transition-colors"
								>
									<td className="py-4 px-6">
										<div className="flex items-center gap-3">
											<div className="h-10 w-10 rounded-full bg-[var(--container-color)] flex items-center justify-center overflow-hidden flex-shrink-0 border border-[var(--border-color)]">
												{leave.avatar ? (
													<img
														src={leave.avatar}
														alt={leave.name}
														className="h-full w-full object-cover"
													/>
												) : (
													<span className="text-sm font-medium text-[var(--sub-text-color)]">
														{leave.name.split(" ").map((n) => n[0]).join("")}
													</span>
												)}
											</div>
											<span className="font-medium text-[var(--text-color)] text-sm">
												{leave.name}
											</span>
										</div>
									</td>
									<td className="py-4 px-6 text-[var(--text-color)] text-sm">
										{leave.type}
									</td>
									<td className="py-4 px-6 text-[var(--text-color)] text-sm">
										{leave.from}
									</td>
									<td className="py-4 px-6 text-[var(--text-color)] text-sm">
										{leave.to}
									</td>
									<td className="py-4 px-6 text-[var(--text-color)] text-sm">
										{leave.days}
									</td>
									<td className="py-4 px-6">
										{getStatusBadge(leave.status, t)}
									</td>
									<td className="py-4 px-6 text-[var(--text-color)] text-sm">
										{leave.reason}
									</td>
									<td className="py-4 px-6 text-[var(--text-color)] text-sm">
										{leave.approver}
									</td>
									<td className="py-4 px-6">
										<button
											className="h-8 w-8 flex items-center justify-center rounded-full bg-[var(--container-color)] border border-[var(--border-color)] hover:bg-[var(--hover-color)] transition-colors"
											onClick={() => setSelectedLeave(leave)}
										>
											<svg
												className="h-5 w-5 text-[var(--accent-color)]"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
												/>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
												/>
											</svg>
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</>
	)
}

export default LeavesTable
