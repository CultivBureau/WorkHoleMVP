

export const getFieldLabels = (isRtl) => ({
    personal: {
      firstName: isRtl ? "الاسم الأول" : "First Name",
      lastName: isRtl ? "الاسم الأخير" : "Last Name",
      mobileNumber: isRtl ? "رقم الهاتف المحمول" : "Mobile Number",
      emailAddress: isRtl ? "البريد الإلكتروني" : "Email Address",
      dateOfBirth: isRtl ? "تاريخ الميلاد" : "Date of Birth",
      maritalStatus: isRtl ? "الحالة الاجتماعية" : "Marital Status",
      gender: isRtl ? "الجنس" : "Gender",
      nationality: isRtl ? "الجنسية" : "Nationality",
      address: isRtl ? "العنوان" : "Address",
      city: isRtl ? "المدينة" : "City",
      state: isRtl ? "الولاية" : "State",
      zipCode: isRtl ? "الرمز البريدي" : "Zip Code"
    },
    professional: {
      employeeId: isRtl ? "رقم الموظف" : "Employee ID",
      employeeType: isRtl ? "نوع الموظف" : "Employee Type",
      department: isRtl ? "القسم" : "Department",
      workingDays: isRtl ? "أيام العمل" : "Working Days",
      userName: isRtl ? "اسم المستخدم" : "User Name",
      emailAddress: isRtl ? "البريد الإلكتروني" : "Email Address",
      designation: isRtl ? "المسمى الوظيفي" : "Designation",
      joiningDate: isRtl ? "تاريخ الانضمام" : "Joining Date",
      officeLocation: isRtl ? "موقع المكتب" : "Office Location"
    }
  })
  
  export const getTableConfig = (isRtl) => ({
    attendance: {
      columns: [
        { key: 'date', header: isRtl ? 'التاريخ' : 'Date' },
        { key: 'checkIn', header: isRtl ? 'وقت الحضور' : 'Check In' },
        { key: 'checkOut', header: isRtl ? 'وقت الانصراف' : 'Check Out' },
        { key: 'break', header: isRtl ? 'الاستراحة' : 'Break' },
        { key: 'workingHours', header: isRtl ? 'ساعات العمل' : 'Working Hours' },
        { key: 'status', header: isRtl ? 'الحالة' : 'Status' }
      ],
      title: isRtl ? "سجل الحضور" : "Attendance Records",
      statusConfig: {
        'On Time': { bg: 'bg-green-100', text: 'text-green-800' },
        'Late': { bg: 'bg-red-100', text: 'text-red-800' }
      }
    },
    projects: {
      columns: [
        { key: 'projectName', header: isRtl ? 'اسم المشروع' : 'Project Name' },
        { key: 'startDate', header: isRtl ? 'تاريخ البداية' : 'Start Date' },
        { key: 'finishDate', header: isRtl ? 'تاريخ الانتهاء' : 'Finish Date' },
        { key: 'status', header: isRtl ? 'الحالة' : 'Status' }
      ],
      title: isRtl ? "المشاريع" : "Projects",
      statusConfig: {
        'Completed': { bg: 'bg-green-100', text: 'text-green-800' },
        'In Process': { bg: 'bg-yellow-100', text: 'text-yellow-800' }
      }
    },
    leave: {
      columns: [
        { key: 'date', header: isRtl ? 'التاريخ' : 'Date' },
        { key: 'duration', header: isRtl ? 'المدة' : 'Duration' },
        { key: 'days', header: isRtl ? 'الأيام' : 'Days' },
        { key: 'reportingManager', header: isRtl ? 'المدير المسؤول' : 'Reporting Manager' },
        { key: 'status', header: isRtl ? 'الحالة' : 'Status' }
      ],
      title: isRtl ? "طلبات الإجازة" : "Leave Requests",
      statusConfig: {
        'Approved': { bg: 'bg-green-100', text: 'text-green-800' },
        'Pending': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
        'Reject': { bg: 'bg-red-100', text: 'text-red-800' }
      }
    }
  })