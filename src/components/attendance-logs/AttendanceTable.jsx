"use client"

import { useMemo, useState } from "react"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslation } from "react-i18next"

const AttendanceTable = () => {
	const { t, i18n } = useTranslation()
	const isArabic = i18n.language === "ar"

	// Raw data stays in a consistent internal format (English keys)
	const attendanceData = [
		{
			date: "29 July 2023",
			day: "Monday",
			checkIn: "09:00 AM",
			checkOut: "05:00 PM",
			workHours: "10h 2m",
			status: "Present",
			location: "Work from office",
		},
		{
			date: "29 July 2023",
			day: "Saturday",
			checkIn: "00:00 AM",
			checkOut: "00:00 PM",
			workHours: "0m",
			status: "Absent",
			location: "------",
		},
		{
			date: "29 July 2023",
			day: "Saturday",
			checkIn: "09:00 AM",
			checkOut: "05:00 PM",
			workHours: "8h 30m",
			status: "Late arrival",
			location: "Work from office",
		},
		{
			date: "29 July 2023",
			day: "Thursday",
			checkIn: "09:00 AM",
			checkOut: "05:00 PM",
			workHours: "10h 5m",
			status: "Present",
			location: "Work from home",
		},
		{
			date: "29 July 2023",
			day: "Saturday",
			checkIn: "09:00 AM",
			checkOut: "05:00 PM",
			workHours: "10h 2m",
			status: "Late arrival",
			location: "Work from office",
		},
		{
			date: "29 July 2023",
			day: "Saturday",
			checkIn: "00:00 AM",
			checkOut: "00:00 PM",
			workHours: "0m",
			status: "Absent",
			location: "------",
		},
		{
			date: "29 July 2023",
			day: "Saturday",
			checkIn: "09:00 AM",
			checkOut: "05:00 PM",
			workHours: "10h 2m",
			status: "Present",
			location: "Work from home",
		},
		{
			date: "29 July 2023",
			day: "Saturday",
			checkIn: "09:00 AM",
			checkOut: "05:00 PM",
			workHours: "10h 2m",
			status: "Present",
			location: "Work from office",
		},
	]

	// Helpers
	const parseDate = (value) => new Date(value)
	const toISODate = (date) => {
		if (!date) return ""
		const d = new Date(date)
		const m = `${d.getMonth() + 1}`.padStart(2, "0")
		const day = `${d.getDate()}`.padStart(2, "0")
		return `${d.getFullYear()}-${m}-${day}`
	}

	const translateTime = (timeStr) => {
		if (!timeStr) return timeStr
		return timeStr
			.replace(/\bAM\b/g, t("timeUnits.am"))
			.replace(/\bPM\b/g, t("timeUnits.pm"))
	}

	const translateDuration = (durationStr) => {
		if (!durationStr) return durationStr
		return durationStr
			.replace(/(\d+)\s*h/g, `$1${t("timeUnits.hours")}`)
			.replace(/(\d+)\s*m/g, `$1${t("timeUnits.minutes")}`)
			.replace(/(\d+)\s*s/g, `$1${t("timeUnits.seconds")}`)
	}

	// Filter state (use stable internal values)
	const [sortBy, setSortBy] = useState("newest") // "newest" | "oldest"
	const [location, setLocation] = useState("all") // "all" | office | home | none
	const [status, setStatus] = useState("all") // "all" | present | absent | late
	const [dateFrom, setDateFrom] = useState("") // YYYY-MM-DD
	const [dateTo, setDateTo] = useState("") // YYYY-MM-DD
	const [currentPage, setCurrentPage] = useState(1)
	const pageSize = 6

	// Derived filtered and sorted data
	const normalized = useMemo(() => {
		return attendanceData.map((r) => ({
			...r,
			parsedDate: parseDate(r.date),
		}))
	}, [attendanceData])

	const filtered = useMemo(() => {
		let result = [...normalized]

		// Filter by location
		if (location !== "all") {
			if (location === "office") result = result.filter((r) => r.location === "Work from office")
			if (location === "home") result = result.filter((r) => r.location === "Work from home")
			if (location === "none") result = result.filter((r) => r.location === "------")
		}

		// Filter by status
		if (status !== "all") {
			if (status === "present") result = result.filter((r) => r.status === "Present")
			if (status === "absent") result = result.filter((r) => r.status === "Absent")
			if (status === "late") result = result.filter((r) => r.status === "Late arrival")
		}

		// Date range filter
		if (dateFrom) {
			const from = new Date(dateFrom)
			result = result.filter((r) => r.parsedDate >= from)
		}
		if (dateTo) {
			const to = new Date(dateTo)
			// include the end day by adding one day and checking < next day
			const nextDay = new Date(to)
			nextDay.setDate(nextDay.getDate() + 1)
			result = result.filter((r) => r.parsedDate < nextDay)
		}

		// Sort
		result.sort((a, b) => (sortBy === "newest" ? b.parsedDate - a.parsedDate : a.parsedDate - b.parsedDate))

		return result
	}, [normalized, location, status, dateFrom, dateTo, sortBy])

	// Pagination
	const totalItems = filtered.length
	const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
	const safePage = Math.min(currentPage, totalPages)
	const pageStart = (safePage - 1) * pageSize
	const pageEnd = pageStart + pageSize
	const pageItems = filtered.slice(pageStart, pageEnd)

	const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1))
	const goNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1))

	// Reset to page 1 when filters change
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useMemo(() => setCurrentPage(1), [location, status, dateFrom, dateTo, sortBy])

	const getStatusBadge = (value) => {
		switch (value) {
			case "Present":
				return (
					<span className="px-3 py-1 rounded-full text-xs font-medium inline-block min-w-[80px] text-center"
						style={{ backgroundColor: 'var(--tag-bg)', color: 'var(--tag-text)' }}>
						{t("attendanceTable.status.present")}
					</span>
				)
			case "Absent":
				return (
					<span className="px-3 py-1 rounded-full text-xs font-medium inline-block min-w-[80px] text-center bg-red-100 text-red-700">
						{t("attendanceTable.status.absent")}
					</span>
				)
			case "Late arrival":
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
		if (loc === "------") {
			return <span style={{ color: 'var(--sub-text-color)' }} className="text-sm">------</span>
		}
		const label = loc === "Work from office" ? t("attendanceTable.location.office") : t("attendanceTable.location.home")
		return (
			<span className="px-3 py-1 rounded-full text-xs font-medium inline-block min-w-[80px] text-center bg-blue-100 text-blue-700">
				{label}
			</span>
		)
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
					className="border rounded-xl px-3 py-1.5 text-xs appearance-none focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 min-w-[100px] font-medium"
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
				className="border rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 min-w-[100px] font-medium date-input"
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

	return (
		<div
			className="rounded-xl border shadow-sm"
			style={{
				backgroundColor: 'var(--bg-color)',
				borderColor: 'var(--border-color)'
			}}
			dir={isArabic ? "rtl" : "ltr"}
		>
			{/* Add global styles for date picker to match dropdown arrows */}
			<style jsx global>{`
                .date-input::-webkit-calendar-picker-indicator {
                    cursor: pointer;
                    opacity: 0.7;
                    transition: opacity 0.2s;
                }
                
                .date-input::-webkit-calendar-picker-indicator:hover {
                    opacity: 1;
                }

                [data-theme="dark"] .date-input::-webkit-calendar-picker-indicator {
                    filter: brightness(0) saturate(100%) invert(71%) sepia(6%) saturate(373%) hue-rotate(195deg) brightness(95%) contrast(87%);
                }
                
                [data-theme="light"] .date-input::-webkit-calendar-picker-indicator {
                    filter: brightness(0) saturate(100%) invert(46%) sepia(11%) saturate(200%) hue-rotate(212deg) brightness(97%) contrast(86%);
                }
            `}</style>

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
								{ value: "home", label: t("attendanceTable.location.home") },
								{ value: "none", label: t("attendanceTable.location.none") }
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
						{t("attendanceTable.showing", { count: pageItems.length, total: totalItems })}
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
						{pageItems.map((record, index) => (
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
								<td className={`px-6 py-4 text-sm ${isArabic ? 'text-right' : 'text-left'} ${record.status === "Absent" ? "text-red-500" : ""}`}
									style={{ color: record.status === "Absent" ? '#ef4444' : 'var(--table-text)' }}>
									{translateTime(record.checkIn)}
								</td>
								<td className={`px-6 py-4 text-sm ${isArabic ? 'text-right' : 'text-left'} ${record.status === "Absent" ? "text-red-500" : ""}`}
									style={{ color: record.status === "Absent" ? '#ef4444' : 'var(--table-text)' }}>
									{translateTime(record.checkOut)}
								</td>
								<td className={`px-6 py-4 text-sm ${isArabic ? 'text-right' : 'text-left'}`}
									style={{ color: 'var(--table-text)' }}>
									{translateDuration(record.workHours)}
								</td>
								<td className={`px-6 py-4 ${isArabic ? 'text-right' : 'text-left'}`}>
									{getStatusBadge(record.status)}
								</td>
								<td className={`px-6 py-4 ${isArabic ? 'text-right' : 'text-left'}`}>
									{getLocationBadge(record.location)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			<div
				className={`px-6 py-4 border-t flex items-center justify-between ${isArabic ? 'flex-row-reverse' : ''}`}
				style={{ borderColor: 'var(--divider-color)' }}
			>
				<div className="text-sm font-medium" style={{ color: 'var(--sub-text-color)' }}>
					{t("attendanceTable.pageOf", { page: safePage, total: totalPages })}
				</div>
				<div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
					<button
						className="p-2 rounded-lg border transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
						onClick={goPrev}
						disabled={safePage === 1}
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
						onClick={goNext}
						disabled={safePage === totalPages}
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
