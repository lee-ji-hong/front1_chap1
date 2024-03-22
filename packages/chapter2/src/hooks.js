export function createHooks(callback) {
  let hooks = [];
  let idx = 0;
  let prevStates = []; // 이전 상태를 저장하는 배열 추가
  const useState = (initState) => {
    const _idx = idx; // useState 호출 시점의 인덱스를 기억하기 위해 클로저를 사용
    const state = hooks[_idx] !== undefined ? hooks[_idx] : initState; // hooks 배열에 상태값이 없으면 초기값 사용
    const setState = (newVal) => {
      // 이전 상태와 새로운 상태를 비교하여 변경되지 않았을 경우 렌더링을 수행하지 않음
      if (prevStates[_idx] !== newVal) {
        hooks[_idx] = newVal; // 상태값 업데이트
        prevStates[_idx] = newVal; // 변경된 상태를 이전 상태에 반영
        callback(); // 변경된 상태가 있을 때만 콜백 함수를 실행하여 렌더링을 다시 수행
      }
    };
    idx++; // 다음 useState 호출 시 사용할 인덱스 증가
    return [state, setState];
  };

  const useMemo = (fn, deps) => {
    // 두 배열이 동일한지 확인하는 함수
    const arraysEqual = (arr1, arr2) => {
      if (arr1.length !== arr2.length) {
        return false;
      }
      for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
          return false;
        }
      }
      return true;
    };

    if (!hooks[idx] || !arraysEqual(deps, hooks[idx][1])) {
      hooks[idx] = [fn(), deps]; // 새로운 값과 의존 배열을 캐시합니다.
    }

    return hooks[idx][0]; // 캐시된 값만 반환합니다.
  };

  const resetContext = () => {
    idx = 0;
  };

  return { useState, useMemo, resetContext };
}
