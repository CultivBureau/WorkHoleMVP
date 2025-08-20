"use client"

import { useMemo, useState } from "react"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslation } from "react-i18next"

const AttendanceTable = () => {
	const { t, i18n } = useTranslation()
	const isRtl = i18n.dir() === "rtl"

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
					<span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium">
						{t("attendanceTable.status.present")}
					</span>
				)
			case "Absent":
				return (
					<span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-medium">
						{t("attendanceTable.status.absent")}
					</span>
				)
			case "Late arrival":
				return (
					<span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-md text-xs font-medium">
						{t("attendanceTable.status.late")}
					</span>
				)
			default:
				return (
					<span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">{value}</span>
				)
		}
	}

	const getLocationBadge = (loc) => {
		if (loc === "------") {
			return <span className="text-gray-400 text-sm">------</span>
		}
		const label = loc === "Work from office" ? t("attendanceTable.location.office") : t("attendanceTable.location.home")
		return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">{label}</span>
	}

	return (
		<div className="bg-white rounded-lg border border-gray-200">
			{/* Filters */}
			<div className="p-4 border-b border-gray-200">
				<div className="flex flex-wrap items-center gap-4">
					<div className="flex items-center gap-2">
						<span className="text-sm text-gray-600">{t("attendanceTable.sortBy")}</span>
						<select
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value)}
							className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
						>
							<option value="newest">{t("attendanceTable.sort.newestFirst")}</option>
							<option value="oldest">{t("attendanceTable.sort.oldestFirst")}</option>
						</select>
					</div>

					<div className="flex items-center gap-2">
						<span className="text-sm text-gray-600">{t("attendanceTable.location.title")}</span>
						<select
							value={location}
							onChange={(e) => setLocation(e.target.value)}
							className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
						>
							<option value="all">{t("attendanceTable.location.all")}</option>
							<option value="office">{t("attendanceTable.location.office")}</option>
							<option value="home">{t("attendanceTable.location.home")}</option>
							<option value="none">{t("attendanceTable.location.none")}</option>
						</select>
					</div>

					<div className="flex items-center gap-2">
						<span className="text-sm text-gray-600">{t("attendanceTable.status.title")}</span>
						<select
							value={status}
							onChange={(e) => setStatus(e.target.value)}
							className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
						>
							<option value="all">{t("attendanceTable.status.all")}</option>
							<option value="present">{t("attendanceTable.status.present")}</option>
							<option value="absent">{t("attendanceTable.status.absent")}</option>
							<option value="late">{t("attendanceTable.status.late")}</option>
						</select>
					</div>

					<div className="flex items-center gap-2">
						<span className="text-sm text-gray-600">{t("attendanceTable.dateFrom")}</span>
						<input
							type="date"
							value={dateFrom}
							onChange={(e) => setDateFrom(e.target.value)}
							className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
						/>
					</div>

					<div className="flex items-center gap-2">
						<span className="text-sm text-gray-600">{t("attendanceTable.dateTo")}</span>
						<input
							type="date"
							value={dateTo}
							onChange={(e) => setDateTo(e.target.value)}
							className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
						/>
					</div>

					<div className="ml-auto text-sm text-gray-600">
						{t("attendanceTable.showing", { count: pageItems.length, total: totalItems })}
					</div>
				</div>
			</div>

			{/* Table */}
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead className="bg-gray-50">
						<tr>
							<th classNameName="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("attendanceTable.columns.date")}</th>
							<th classNameName="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("attendanceTable.columns.day")}</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								{t("attendanceTable.columns.checkIn")} <ChevronDown className="inline w-3 h-3 ml-1" />
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								{t("attendanceTable.columns.checkOut")} <ChevronDown className="inline w-3 h-3 ml-1" />
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								{t("attendanceTable.columns.workHours")} <ChevronDown className="inline w-3 h-3 ml-1" />
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								{t("attendanceTable.columns.status")} <ChevronDown className="inline w-3 h-3 ml-1" />
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								{t("attendanceTable.columns.location")} <ChevronDown className="inline w-3 h-3 ml-1" />
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{pageItems.map((record, index) => (
							<tr key={index} className="hover:bg-gray-50">
								<td className="px-4 py-3 text-sm text-gray-900">{record.date}</td>
								<td className="px-4 py-3 text-sm text-gray-900">{record.day}</td>
								<td className={`px-4 py-3 text-sm ${record.status === "Absent" ? "text-red-500" : "text-gray-900"}`}>
									{translateTime(record.checkIn)}
								</td>
								<td className={`px-4 py-3 text-sm ${record.status === "Absent" ? "text-red-500" : "text-gray-900"}`}>
									{translateTime(record.checkOut)}
								</td>
								<td className="px-4 py-3 text-sm text-gray-900">{translateDuration(record.workHours)}</td>
								<td className="px-4 py-3">{getStatusBadge(record.status)}</td>
								<td className="px-4 py-3">{getLocationBadge(record.location)}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			<div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
				<div className="text-sm text-gray-600">{t("attendanceTable.pageOf", { page: safePage, total: totalPages })}</div>
				<div className="flex items-center gap-2">
					<button className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50" onClick={goPrev} disabled={safePage === 1}>
						{isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
					</button>
					<button className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50" onClick={goNext} disabled={safePage === totalPages}>
						{isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
					</button>
				</div>
			</div>
		</div>
	)
}

export default AttendanceTable
