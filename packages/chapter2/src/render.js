export function jsx(type, props, ...children) {
  return { type, props: props || {}, children };
}

// jsx를 dom으로 변환
export function createElement(node) {
  //node 값이 문자일 경우 텍스트 형태로 받아옴
  if (typeof node === 'string') {
    return document.createTextNode(node);
  }

  //구조 분해 할당
  const { type, props, children } = node;

  //tag 요소 생성
  const $element = document.createElement(type);

  //속성 추가
  if (props) {
    for (const attr in props) {
      const value = props[attr];
      if (value) {
        $element.setAttribute(attr, value);
      }
    }
  }

  //자식 요소 처리
  if (children) {
    children.forEach((child) => {
      $element.appendChild(createElement(child));
    });
  }

  return $element;
}

function updateAttributes(target, newProps, oldProps) {
  // newProps들을 반복하여 각 속성과 값을 확인
  //   만약 oldProps에 같은 속성이 있고 값이 동일하다면
  //     다음 속성으로 넘어감 (변경 불필요)
  //   만약 위 조건에 해당하지 않는다면 (속성값이 다르거나 구속성에 없음)
  //     target에 해당 속성을 새 값으로 설정
  // oldProps을 반복하여 각 속성 확인
  //   만약 newProps들에 해당 속성이 존재한다면
  //     다음 속성으로 넘어감 (속성 유지 필요)
  //   만약 newProps들에 해당 속성이 존재하지 않는다면

  if (!newProps) return;

  Object.keys(newProps).forEach((propName) => {
    const newValue = newProps[propName];
    const oldValue = oldProps ? oldProps[propName] : undefined;

    if (newValue !== oldValue) {
      target[propName] = newValue;
    }
  });

  if (oldProps) {
    Object.keys(oldProps).forEach((propName) => {
      if (!(propName in newProps)) {
        target.removeAttribute(propName);
      }
    });
  }
}

export function render(parent, newNode, oldNode, index = 0) {
  // 1. 만약 newNode가 없고 oldNode만 있다면
  //   parent에서 oldNode를 제거
  //   종료
  if (!newNode && oldNode) {
    parent.removeChild(parent.childNodes[index]);
    return;
  }
  // 2. 만약 newNode가 있고 oldNode가 없다면
  //   newNode를 생성하여 parent에 추가
  //   종료
  if (newNode && !oldNode) {
    parent.appendChild(createElement(newNode));
    return;
  }
  // 3. 만약 newNode와 oldNode 둘 다 문자열이고 서로 다르다면
  //   oldNode를 newNode로 교체
  //   종료
  if (
    typeof newNode === 'string' &&
    typeof oldNode === 'string' &&
    newNode !== oldNode
  ) {
    parent.replaceChild(createElement(newNode), parent.childNodes[index]);
    return;
  }
  // 4. 만약 newNode와 oldNode의 타입이 다르다면
  //   oldNode를 newNode로 교체
  //   종료
  if (newNode.type !== oldNode.type) {
    parent.replaceChild(createElement(newNode), parent.childNodes[index]);
    return;
  }
  // 5. newNode와 oldNode에 대해 updateAttributes 실행
  if (newNode.type) {
    updateAttributes(parent.childNodes[index], newNode.props, oldNode.props);
  }
  // 6. newNode와 oldNode 자식노드들 중 더 긴 길이를 가진 것을 기준으로 반복
  //   각 자식노드에 대해 재귀적으로 render 함수 호출
  const newLength = newNode.children?.length;
  const oldLength = oldNode.children?.length;
  const maxLength = Math.max(newLength, oldLength);

  for (let i = 0; i < maxLength; i++) {
    render(
      parent.childNodes[index],
      newNode.children[i],
      oldNode.children[i],
      i,
    );
  }
}
