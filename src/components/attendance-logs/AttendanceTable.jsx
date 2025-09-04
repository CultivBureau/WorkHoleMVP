"use client"

import { useState, useMemo, useEffect } from "react"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useGetStatsQuery, useClockInMutation, useClockOutMutation } from "../../services/apis/AtteandanceApi"
import { useAttendanceUpdate } from "../../contexts/AttendanceUpdateContext"

const AttendanceTable = () => {
	const { t, i18n } = useTranslation()
	const isArabic = i18n.language === "ar"

	const { lastUpdate } = useAttendanceUpdate()

	const [sortBy, setSortBy] = useState("newest")
	const [location, setLocation] = useState("all")
	const [status, setStatus] = useState("all")
	const [dateFrom, setDateFrom] = useState("")
	const [dateTo, setDateTo] = useState("")
	const [currentPage, setCurrentPage] = useState(1)
	const pageSize = 8

	// Fetch attendance logs from API (pagination is backend)
	const { data, isLoading, refetch } = useGetStatsQuery(
  { page: currentPage, limit: pageSize }
)
	const attendanceLogs = data?.attendanceLogs || []
	const pagination = data?.pagination || { page: 1, limit: pageSize, total: 0, totalPages: 1 }

	// Client-side filters (on current page only)
	const filtered = useMemo(() => {
		let result = [...attendanceLogs]

		if (location !== "all") {
			if (location === "office") result = result.filter((r) => r.location === "office")
			if (location === "home") result = result.filter((r) => r.location === "home")
		}
		if (status !== "all") {
			result = result.filter((r) => r.status === status)
		}
		if (dateFrom) {
			const from = new Date(dateFrom)
			result = result.filter((r) => new Date(r.date) >= from)
		}
		if (dateTo) {
			const to = new Date(dateTo)
			result = result.filter((r) => new Date(r.date) <= to)
		}
		// Sort
		result.sort((a, b) =>
			sortBy === "newest"
				? new Date(b.date) - new Date(a.date)
				: new Date(a.date) - new Date(b.date)
		)
		return result
	}, [attendanceLogs, location, status, dateFrom, dateTo, sortBy])

	const getStatusBadge = (value) => {
		switch (value) {
			case "present":
				return (
					<span className="px-3 py-1 rounded-full text-xs font-medium inline-block min-w-[80px] text-center"
						style={{ backgroundColor: 'var(--tag-bg)', color: 'var(--tag-text)' }}>
						{t("attendanceTable.status.present")}
					</span>
				)
			case "absent":
				return (
					<span className="px-3 py-1 rounded-full text-xs font-medium inline-block min-w-[80px] text-center bg-red-100 text-red-700">
						{t("attendanceTable.status.absent")}
					</span>
				)
			case "late":
				return (
					<span className="px-3 py-1 rounded-full text-xs font-medium inline-block min-w-[80px] text-center bg-yellow-100 text-yellow-700">
						{t("attendanceTable.status.late")}
					</span>
				)
			default:
				return (
					<span className="px-3 py-1 rounded-full text-xs font-medium inline-block min-w-[80px] text-center"
						style={{ backgroundColor: 'var(--tag-bg)', color: 'var(--tag-text)' }}>
						{value}
					</span>
				)
		}
	}

	const getLocationBadge = (loc) => {
		if (loc === "office")
			return <span className="px-3 py-1 rounded-full text-xs font-medium inline-block min-w-[80px] text-center bg-blue-100 text-blue-700">{t("attendanceTable.location.office")}</span>
		if (loc === "home")
			return <span className="px-3 py-1 rounded-full text-xs font-medium inline-block min-w-[80px] text-center bg-blue-100 text-blue-700">{t("attendanceTable.location.home")}</span>
		return <span style={{ color: 'var(--sub-text-color)' }} className="text-sm">------</span>
	}

	const SelectField = ({ value, onChange, options, label }) => (
		<div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
			<span className="text-xs font-medium whitespace-nowrap" style={{ color: 'var(--sub-text-color)' }}>
				{label}
			</span>
			<div className="relative">
				<select
					value={value}
					onChange={onChange}
					className="border rounded-full px-3 py-1.5 text-xs appearance-none focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 min-w-[100px] font-medium"
					style={{
						borderColor: 'var(--border-color)',
						backgroundColor: 'var(--bg-color)',
						color: 'var(--text-color)',
						focusRingColor: 'var(--accent-color)',
						paddingRight: isArabic ? '12px' : '28px',
						paddingLeft: isArabic ? '28px' : '12px',
						direction: isArabic ? 'rtl' : 'ltr',
						boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
						height: '32px'
					}}
				>
					{options.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
				<ChevronDown
					className={`absolute top-1/2 transform -translate-y-1/2 w-3 h-3 pointer-events-none ${isArabic ? 'left-2' : 'right-2'
						}`}
					style={{ color: 'var(--sub-text-color)' }}
				/>
			</div>
		</div>
	)

	const DateField = ({ value, onChange, label }) => (
		<div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
			<span className="text-xs font-medium whitespace-nowrap" style={{ color: 'var(--sub-text-color)' }}>
				{label}
			</span>
			<input
				type="date"
				value={value}
				onChange={onChange}
				className="border rounded-full px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 min-w-[100px] font-medium date-input"
				style={{
					borderColor: 'var(--border-color)',
					backgroundColor: 'var(--bg-color)',
					color: 'var(--text-color)',
					focusRingColor: 'var(--accent-color)',
					direction: isArabic ? 'rtl' : 'ltr',
					boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
					height: '32px'
				}}
			/>
		</div>
	)

	// دالة لتحويل الوقت من "HH:mm" لـ "h:mm AM/PM"
	const formatTo12Hour = (timeStr) => {
		if (!timeStr || typeof timeStr !== "string") return "—";
		const [hour, minute] = timeStr.split(":");
		const date = new Date();
		date.setHours(Number(hour));
		date.setMinutes(Number(minute));
		return date.toLocaleTimeString(i18n.language === "ar" ? "ar-EG" : "en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		});
	}

	const [clockIn] = useClockInMutation()
	const [clockOut] = useClockOutMutation()

	const handleClockIn = async (body) => {
		await clockIn(body)
		refetch() // يعيد جلب البيانات تلقائي بعد clock in
	}

	const handleClockOut = async (body) => {
		await clockOut(body)
		refetch() // يعيد جلب البيانات تلقائي بعد clock out
	}

	useEffect(() => {
		refetch()
	}, [lastUpdate])

	return (
		<div
			className="rounded-xl border shadow-sm"
			style={{
				backgroundColor: 'var(--bg-color)',
				borderColor: 'var(--border-color)'
			}}
			dir={isArabic ? "rtl" : "ltr"}
		>
			{/* Filters */}
			<div
				className="p-6 border-b"
				style={{ borderColor: 'var(--divider-color)' }}
			>
				<div className="flex flex-wrap items-center justify-between gap-3">
					<div className="flex flex-wrap items-center gap-3">
						<SelectField
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value)}
							options={[
								{ value: "newest", label: t("attendanceTable.sort.newestFirst") },
								{ value: "oldest", label: t("attendanceTable.sort.oldestFirst") }
							]}
							label={t("attendanceTable.sortBy")}
						/>

						<SelectField
							value={location}
							onChange={(e) => setLocation(e.target.value)}
							options={[
								{ value: "all", label: t("attendanceTable.location.all") },
								{ value: "office", label: t("attendanceTable.location.office") },
								{ value: "home", label: t("attendanceTable.location.home") }
							]}
							label={t("attendanceTable.location.title")}
						/>

						<SelectField
							value={status}
							onChange={(e) => setStatus(e.target.value)}
							options={[
								{ value: "all", label: t("attendanceTable.status.all") },
								{ value: "present", label: t("attendanceTable.status.present") },
								{ value: "absent", label: t("attendanceTable.status.absent") },
								{ value: "late", label: t("attendanceTable.status.late") }
							]}
							label={t("attendanceTable.status.title")}
						/>

						<DateField
							value={dateFrom}
							onChange={(e) => setDateFrom(e.target.value)}
							label={t("attendanceTable.dateFrom")}
						/>

						<DateField
							value={dateTo}
							onChange={(e) => setDateTo(e.target.value)}
							label={t("attendanceTable.dateTo")}
						/>
					</div>

					<div className={`text-sm font-medium ${isArabic ? 'text-right' : 'text-left'}`} style={{ color: 'var(--sub-text-color)' }}>
						{t("attendanceTable.showing", { count: filtered.length, total: pagination.total })}
					</div>
				</div>
			</div>

			{/* Table */}
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead style={{ backgroundColor: 'var(--table-header-bg)' }}>
						<tr>
							<th className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isArabic ? 'text-right' : 'text-left'}`}
								style={{ color: 'var(--table-header-text)' }}>
								{t("attendanceTable.columns.date")}
							</th>
							<th className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isArabic ? 'text-right' : 'text-left'}`}
								style={{ color: 'var(--table-header-text)' }}>
								{t("attendanceTable.columns.day")}
							</th>
							<th className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isArabic ? 'text-right' : 'text-left'}`}
								style={{ color: 'var(--table-header-text)' }}>
								{t("attendanceTable.columns.checkIn")}
							</th>
							<th className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isArabic ? 'text-right' : 'text-left'}`}
								style={{ color: 'var(--table-header-text)' }}>
								{t("attendanceTable.columns.checkOut")}
							</th>
							<th className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isArabic ? 'text-right' : 'text-left'}`}
								style={{ color: 'var(--table-header-text)' }}>
								{t("attendanceTable.columns.workHours")}
							</th>
							<th className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isArabic ? 'text-right' : 'text-left'}`}
								style={{ color: 'var(--table-header-text)' }}>
								{t("attendanceTable.columns.status")}
							</th>
							<th className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isArabic ? 'text-right' : 'text-left'}`}
								style={{ color: 'var(--table-header-text)' }}>
								{t("attendanceTable.columns.location")}
							</th>
						</tr>
					</thead>
					<tbody>
						{isLoading ? (
							<tr>
								<td colSpan={7} className="text-center py-8">{t("attendanceTable.loading")}</td>
							</tr>
						) : filtered.length === 0 ? (
							<tr>
								<td colSpan={7} className="text-center py-8">{t("attendanceTable.noData")}</td>
							</tr>
						) : (
							filtered.map((record, index) => (
								<tr
									key={index}
									className="transition-colors duration-200 cursor-pointer hover:shadow-sm"
									style={{
										borderBottom: '1px solid var(--table-border)',
										backgroundColor: index % 2 === 0 ? 'var(--table-row-bg)' : 'var(--table-row-alt-bg)'
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.backgroundColor = 'var(--table-header-bg)';
										e.currentTarget.style.transform = 'translateY(-1px)';
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.backgroundColor =
											index % 2 === 0 ? 'var(--table-row-bg)' : 'var(--table-row-alt-bg)';
										e.currentTarget.style.transform = 'translateY(0)';
									}}
								>
									<td className={`px-6 py-4 text-sm font-medium ${isArabic ? 'text-right' : 'text-left'}`}
										style={{ color: 'var(--table-text)' }}>
										{record.date}
									</td>
									<td className={`px-6 py-4 text-sm ${isArabic ? 'text-right' : 'text-left'}`}
										style={{ color: 'var(--table-text)' }}>
										{record.day}
									</td>
									<td className={`px-6 py-4 text-sm ${isArabic ? 'text-right' : 'text-left'}`}
										style={{ color: 'var(--table-text)' }}>
										{formatTo12Hour(record.checkInTime)}
									</td>
									<td className={`px-6 py-4 text-sm ${isArabic ? 'text-right' : 'text-left'}`}
										style={{ color: 'var(--table-text)' }}>
										{formatTo12Hour(record.checkOutTime)}
									</td>
									<td className={`px-6 py-4 text-sm ${isArabic ? 'text-right' : 'text-left'}`}
										style={{ color: 'var(--table-text)' }}>
										{record.workHours}
									</td>
									<td className={`px-6 py-4 ${isArabic ? 'text-right' : 'text-left'}`}>
										{getStatusBadge(record.status)}
									</td>
									<td className={`px-6 py-4 ${isArabic ? 'text-right' : 'text-left'}`}>
										{getLocationBadge(record.location)}
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			<div
				className={`px-6 py-4 border-t flex items-center justify-between ${isArabic ? 'flex-row-reverse' : ''}`}
				style={{ borderColor: 'var(--divider-color)' }}
			>
				<div className="text-sm font-medium" style={{ color: 'var(--sub-text-color)' }}>
					{t("attendanceTable.pageOf", { page: pagination.page, total: pagination.totalPages })}
				</div>
				<div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
					<button
						className="p-2 rounded-lg border transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
						onClick={() => setCurrentPage(Math.max(1, pagination.page - 1))}
						disabled={pagination.page === 1}
						style={{
							borderColor: 'var(--border-color)',
							backgroundColor: 'var(--bg-color)',
							color: 'var(--text-color)'
						}}
					>
						{isArabic ? <ChevronLeft className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
					</button>
					<button
						className="p-2 rounded-lg border transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
						onClick={() => setCurrentPage(Math.min(pagination.totalPages, pagination.page + 1))}
						disabled={pagination.page === pagination.totalPages}
						style={{
							borderColor: 'var(--border-color)',
							backgroundColor: 'var(--bg-color)',
							color: 'var(--text-color)'
						}}
					>
						{isArabic ? <ChevronRight className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
					</button>
				</div>
			</div>
		</div>
	)
}

export default AttendanceTable
