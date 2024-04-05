export function createHooks(callback) {
  let frameId = null; // 상태 변경을 위한 requestAnimationFrame의 ID
  const stateContext = {
    current: 0,
    states: [],
    updateQueue: [], // 상태 변경 요청을 저장하는 큐
  };

  const memoContext = {
    current: 0,
    memos: [],
  };

  function processQueue() {
    const { updateQueue, states } = stateContext;
    // 상태 업데이트 큐를 처리합니다.
    updateQueue.forEach(({ index, newState }) => {
      states[index] = newState;
    });
    stateContext.updateQueue = []; // 큐를 비웁니다.

    callback(); // 상태 변경 후 콜백(렌더링)을 호출합니다.
    console.log('렌더링 발생');
    frameId = null; // ID 초기화
  }

  function resetContext() {
    stateContext.current = 0;
    memoContext.current = 0;
    stateContext.updateQueue = [];
    if (frameId !== null) {
      cancelAnimationFrame(frameId);
      frameId = null;
    }
  }

  const useState = (initState) => {
    const { states, updateQueue } = stateContext;
    let index = stateContext.current++; // 현재 상태의 인덱스를 할당하고, 다음 상태를 위해 current를 증가시킵니다.
    states[index] = states[index] ?? initState; // 초기 상태 할당 (이미 존재하는 경우 이전 상태 유지)

    const setState = (newState) => {
      // 새로운 상태 업데이트를 큐에 추가합니다. 동일 인덱스의 이전 업데이트는 제거합니다.
      stateContext.updateQueue = updateQueue.filter(
        (update) => update.index !== index,
      );
      stateContext.updateQueue.push({ index, newState });

      // 이미 예약된 업데이트가 있다면 새로 예약하지 않습니다.
      if (frameId !== null) return;

      // 상태 변경을 위한 requestAnimationFrame을 예약합니다.
      frameId = requestAnimationFrame(processQueue);
    };

    return [states[index], setState];
  };

  const useMemo = (fn, refs) => {
    const { current, memos } = memoContext;
    memoContext.current += 1;

    const memo = memos[current];

    const resetAndReturn = () => {
      const value = fn();
      memos[current] = {
        value,
        refs,
      };
      return value;
    };

    if (!memo) {
      return resetAndReturn();
    }

    if (refs.length > 0 && memo.refs.find((v, k) => v !== refs[k])) {
      return resetAndReturn();
    }
    return memo.value;
  };

  return { useState, useMemo, resetContext };
}
