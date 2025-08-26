import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../services/apis/AuthApi";
import { dashboardApi } from "../services/apis/DashboardApi";
import { breakApi } from "../services/apis/BreakApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [breakApi.reducerPath]: breakApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(authApi.middleware, dashboardApi.middleware, breakApi.middleware),
});

export default store;
