export default function DataReview({ data, fieldLabels }) {
  const fields = Object.keys(data).map((key) => ({
    label: fieldLabels[key] || key,
    value: data[key],
  }))

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-6 md:gap-x-8 lg:gap-x-12 gap-y-4 sm:gap-y-6 md:gap-y-7 lg:gap-y-8">
      {fields.map((field, index) => (
        <div 
          key={index} 
          className="space-y-2 sm:space-y-3 group cursor-pointer p-2 sm:p-3 -m-2 sm:-m-3 rounded-lg transition-all duration-300 hover:bg-[var(--hover-color)]"
        >
          <label 
            className="text-xs sm:text-sm font-medium block transition-colors duration-300"
            style={{ color: 'var(--sub-text-color)' }}
          >
            {field.label}
          </label>
          <p 
            className="text-sm sm:text-base font-normal leading-relaxed relative transition-all duration-300 break-words"
            style={{ color: 'var(--text-color)' }}
          >
            {field.value}
            {/* Hover underline */}
            <span 
              className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-300 ease-out"
              style={{ backgroundColor: 'var(--accent-color)' }}
            />
          </p>
        </div>
      ))}
    </div>
  )
}
