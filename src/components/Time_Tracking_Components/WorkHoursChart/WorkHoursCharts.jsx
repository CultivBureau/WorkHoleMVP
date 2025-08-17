import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const WorkHoursCharts = () => {
  const { t, i18n } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState('lastWeek');
  
  // Sample data - replace with your actual data
  const workHoursData = {
    lastWeek: [7.2, 7.8, 8.5, 6.9, 6.2],
    thisWeek: [6.5, 8.2, 7.9, 8.1, 7.3],
    lastMonth: [7.0, 7.5, 8.0, 7.2, 6.8]
  };

  const filterOptions = [
    { value: 'lastWeek', label: i18n.language === 'ar' ? 'الأسبوع الماضي' : 'Last Week' },
    { value: 'thisWeek', label: i18n.language === 'ar' ? 'هذا الأسبوع' : 'This Week' },
    { value: 'lastMonth', label: i18n.language === 'ar' ? 'الشهر الماضي' : 'Last Month' }
  ];

  const getDayLabels = () => {
    const days = ['0', '1', '2', '3', '4']; // Sunday to Thursday
    return days.map(day => {
      const dayName = t(`navbar.days.${day}`);
      return dayName.substring(0, 2); // Get first 2 characters
    });
  };

  const maxHours = 8;
  const data = workHoursData[selectedPeriod];
  const dayLabels = getDayLabels();

  return (
    <div className="work-hours-chart" style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '24px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      direction: i18n.language === 'ar' ? 'rtl' : 'ltr'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '400',
          color: 'black',
          margin: 0
        }}>
          {i18n.language === 'ar' ? 'ساعات العمل' : 'Work Hours'}
        </h2>
        
        {/* Filter Dropdown */}
        <div style={{ position: 'relative' }}>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            style={{
              backgroundColor: '#CDFFFCE0',
              border: 'none',
              borderRadius: '20px',
              padding: '8px 16px',
              fontSize: '16px',
              fontWeight: '400',
              color: 'black',
              cursor: 'pointer',
              outline: 'none',
              minWidth: '120px'
            }}
          >
            {filterOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart */}
      <div style={{
        display: 'flex',
        alignItems: 'end',
        justifyContent: 'space-between',
        height: '200px',
        padding: '0 20px',
        position: 'relative'
      }}>
        {/* Y-axis labels */}
        <div style={{
          position: 'absolute',
          left: i18n.language === 'ar' ? 'auto' : '0',
          right: i18n.language === 'ar' ? '0' : 'auto',
          top: '0',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          fontSize: '16px',
          fontWeight: '400',
          color: '#999',
          paddingRight: i18n.language === 'ar' ? '10px' : '0',
          paddingLeft: i18n.language === 'ar' ? '0' : '10px'
        }}>
          <span>8</span>
          <span>6</span>
          <span>4</span>
          <span>2</span>
          <span>0</span>
        </div>

        {/* Grid lines */}
        <div style={{
          position: 'absolute',
          left: i18n.language === 'ar' ? '0' : '40px',
          right: i18n.language === 'ar' ? '40px' : '0',
          top: '0',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} style={{
              height: '1px',
              backgroundColor: '#E5E5E5',
              width: '100%'
            }} />
          ))}
        </div>

        {/* Bars */}
        <div style={{
          display: 'flex',
          alignItems: 'end',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          paddingLeft: i18n.language === 'ar' ? '0' : '40px',
          paddingRight: i18n.language === 'ar' ? '40px' : '0'
        }}>
          {data.map((hours, index) => {
            const height = (hours / maxHours) * 100;
            const isHighest = hours === Math.max(...data);
            
            return (
              <div key={index} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
                maxWidth: '60px'
              }}>
                {/* Bar */}
                <div style={{
                  width: '24px',
                  height: `${height}%`,
                  backgroundColor: isHighest ? '#75C8CF' : '#CDFFFCE0',
                  borderRadius: '12px',
                  marginBottom: '12px',
                  transition: 'all 0.3s ease'
                }} />
                
                {/* Day label */}
                <span style={{
                  fontSize: '16px',
                  fontWeight: '400',
                  color: 'black'
                }}>
                  {dayLabels[index]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WorkHoursCharts;
