import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../services/apis/AuthApi";
import { dashboardApi } from "../services/apis/DashboardApi";
import { breakApi } from "../services/apis/BreakApi";
import { attendanceApi } from "../services/apis/AtteandanceApi";
import { timerApi } from "../services/apis/TimerApi";
import { leavesApi } from "../services/apis/LeavesApi";
import { usersApi } from "../services/apis/UsersApi";
import { companyApi } from "../services/apis/CompanyApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [breakApi.reducerPath]: breakApi.reducer,
    [attendanceApi.reducerPath]: attendanceApi.reducer,
    [timerApi.reducerPath]: timerApi.reducer,
    [leavesApi.reducerPath]: leavesApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [companyApi.reducerPath]: companyApi.reducer,
  
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      authApi.middleware,
      dashboardApi.middleware,
      breakApi.middleware,
      attendanceApi.middleware,
      timerApi.middleware,
      leavesApi.middleware,
      usersApi.middleware,
      companyApi.middleware,
      
    ),
});

export default store;
