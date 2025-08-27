import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../services/apis/AuthApi";
import { dashboardApi } from "../services/apis/DashboardApi";
import { breakApi } from "../services/apis/BreakApi";
import  {attendanceApi} from "../services/apis/AtteandanceApi"

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [breakApi.reducerPath]: breakApi.reducer,
    [attendanceApi.reducerPath]: attendanceApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(authApi.middleware, dashboardApi.middleware, breakApi.middleware, attendanceApi.middleware),
});

export default store;
