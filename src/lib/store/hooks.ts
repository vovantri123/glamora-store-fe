import { useDispatch, useSelector, useStore } from 'react-redux';
import type { AppDispatch, AppStore, RootState } from './index';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
// Hook just used in components to access the typed store
/**
 * Typed hook để dispatch actions trong Redux store.
 *
 * @description
 * Thay thế cho useDispatch thông thường, với type safety cho AppDispatch.
 *
 * @input
 * - action: Action object hoặc thunk function để dispatch.
 *
 * @output
 * Trả về dispatch function đã được type.
 *
 * @usage
 * ```typescript
 * const dispatch = useAppDispatch();
 * dispatch(loginUser({ email, password }));
 * ```
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

/**
 * Typed hook để select state từ Redux store.
 *
 * @description
 * Thay thế cho useSelector thông thường, với type safety cho RootState.
 *
 * @input
 * - selector: Function nhận RootState và trả về phần state cần thiết.
 *
 * @output
 * Trả về giá trị state đã select, với type inference.
 *
 * @usage
 * ```typescript
 * const user = useAppSelector((state) => state.auth.user);
 * const isLoading = useAppSelector((state) => state.auth.isLoading);
 * ```
 */
export const useAppSelector = useSelector.withTypes<RootState>();

/**
 * Typed hook để access Redux store instance.
 *
 * @description
 * Thay thế cho useStore thông thường, với type safety cho AppStore.
 *
 * @input
 * Không có input parameters.
 *
 * @output
 * Trả về store instance với type AppStore.
 *
 * @usage
 * ```typescript
 * const store = useAppStore();
 * const state = store.getState(); // Lấy toàn bộ state hiện tại
 * const user = state.auth.user; // Access state properties
 * store.dispatch(loginUser({ email, password })); // Dispatch action
 * store.subscribe(() => console.log('State changed')); // Subscribe changes (ít dùng trong React)
 * ```
 */
export const useAppStore = useStore.withTypes<AppStore>();

/*
useAppStore không thường dùng lắm trong React components thông thường. Thay vào đó:

Thường dùng: useAppSelector để lấy state và useAppDispatch để dispatch actions – đủ cho hầu
hết trường hợp.

Khi nào dùng useAppStore:

+ Testing hoặc debugging (access store trực tiếp).
+ Custom middleware hoặc logic cần store instance.
+ Subscribe manual changes (ít phổ biến, vì React re-renders tự động với hooks).
*/
