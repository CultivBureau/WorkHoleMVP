import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../services/apis/AuthApi";
import { companyApi } from "../services/apis/CompanyApi";
import { departmentApi } from "../services/apis/DepartmentApi";
import { roleApi } from "../services/apis/RoleApi";
import { teamApi } from "../services/apis/TeamApi";
import { shiftApi } from "../services/apis/ShiftApi";
import { userApi } from "../services/apis/UserApi";
import { leaveApi } from "../services/apis/LeaveApi";
import { permissionApi } from "../services/apis/PermissionApi";
import { breakApi } from "../services/apis/BreakApi";
import { userApi } from "../services/apis/UserApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [companyApi.reducerPath]: companyApi.reducer,
    [departmentApi.reducerPath]: departmentApi.reducer,
    [roleApi.reducerPath]: roleApi.reducer,
    [teamApi.reducerPath]: teamApi.reducer,
    [shiftApi.reducerPath]: shiftApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [leaveApi.reducerPath]: leaveApi.reducer,
    [permissionApi.reducerPath]: permissionApi.reducer,
    [breakApi.reducerPath]: breakApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      authApi.middleware,
      companyApi.middleware,
      departmentApi.middleware,
      roleApi.middleware,
      teamApi.middleware,
      shiftApi.middleware,
      userApi.middleware,
      leaveApi.middleware,
      permissionApi.middleware,
      breakApi.middleware,
      userApi.middleware,
      
    ),
});

export default store;
