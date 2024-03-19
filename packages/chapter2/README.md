# 2주차 과제 A

## jsx 함수
JSX 요소를 생성하는 함수 입니다. 
```js
export function jsx(type, props, ...children) {
  return { type, props: props || {}, children };
}
```
jsx 함수는 JSX를 사용하여 생성된 요소를 나타내는 객체를 반환합니다. 주어진 코드에서는 createElement 함수를 사용하여 JSX 요소를 실제 DOM 요소로 변환하는 것을 목표로 하고 있습니다. 따라서 jsx 함수는 JSX로 작성된 요소를 JavaScript 객체로 표현하여 createElement 함수에 전달할 수 있도록 돕는 역할을 수행합니다.

예를 들어, 주어진 코드에서 jsx 함수에 다음과 같은 JSX 코드를 전달할 수 있습니다:

```js
const App = jsx(
  'div',
  { id: 'test-id', class: 'test-class' },
  'Hello, world!'
);
```

이렇게 하면 jsx 함수는 다음과 같은 형태의 객체를 반환하게 됩니다.
```js
{
  type: 'div',
  props: { id: 'test-id', class: 'test-class' },
  children: ['Hello, world!']
}

```

이렇게 생성된 객체를 createElement 함수에 전달하여 해당 객체를 실제 DOM 요소로 변환하고, 이를 화면에 렌더링할 수 있습니다. 따라서 jsx 함수는 JSX 코드를 JavaScript 객체로 변환하여 UI를 다루는 데에 도움을 주는 중간 역할을 수행합니다.


## createElement 함수
createElement 함수의 역할은 JSX 요소를 실제 DOM 요소로 변환하는 것입니다. JSX는 JavaScript의 확장 문법으로, HTML과 유사한 구문을 사용하여 UI를 작성할 수 있습니다. 그러나 브라우저는 JSX를 이해하지 못하므로, JSX를 JavaScript 코드로 변환해야 합니다.

createElement 함수는 JSX로 작성된 요소를 받아서 이를 실제 DOM 요소로 변환하여 반환합니다. 이때, JSX로 작성된 요소는 JavaScript 객체의 형태로 전달됩니다. createElement 함수는 이 객체를 분석하여 해당하는 실제 DOM 요소를 생성하고, 요소의 속성과 자식 요소들을 설정하여 반환합니다.

```js
export function createElement(node) {
  //node 값이 문자일 경우 텍스트 형태로 받아옴
  if (typeof node === 'string') {
    return document.createTextNode(node);
  }

  //요소의 타입(type), 속성(props), 자식 요소(children)를 확인합니다.
  const { type, props, children } = node;

  //해당하는 실제 DOM 요소를 생성합니다 (예: document.createElement('div')).
  const $element = document.createElement(type);

  //속성 추가
  if (props) {
    for (const attr in props) {
      const value = props[attr];
      if (value) {
      //요소의 속성(props)을 실제 DOM 요소에 설정합니다 (예: element.setAttribute('id', 'test-id')).
        $element.setAttribute(attr, value);
      }
    }
  }

  //자식 요소(children)들을 재귀적으로 createElement 함수에 전달하여 이를 실제 DOM 요소로 변환하고, 부모 요소에 추가합니다 
 //(예: parentElement.appendChild(childElement)).
  if (children) {
    children.forEach((child) => {
      $element.appendChild(createElement(child));
    });
  }

//최종적으로 생성된 실제 DOM 요소를 반환합니다.
  return $element;
}
```
이렇게 createElement 함수는 JSX로 작성된 가상 DOM 요소를 실제 DOM 요소로 변환하여 화면에 렌더링할 수 있도록 돕는 역할을 합니다. 이는 React 라이브러리와 유사한 기능을 수행하는 것으로 이해할 수 있습니다.

## updateAttributes 함수
updateAttributes 함수는 DOM 요소의 속성을 업데이트하는 역할을 합니다. 이 함수는 주어진 DOM 요소와 새로운 속성(props) 객체를 비교하여 변경된 속성만을 실제 DOM 요소에 반영합니다.

보통 웹 애플리케이션에서는 상태(state)가 변경될 때마다 UI를 업데이트해야 합니다. JSX로 작성된 요소는 JavaScript 객체로 변환되고, 이후에는 해당 요소의 속성이나 자식 요소가 변경될 수 있습니다. 이때 updateAttributes 함수는 변경된 속성만을 찾아서 실제 DOM 요소에 반영하여 UI를 업데이트합니다.

updateAttributes 함수의 주요 역할은 다음과 같습니다:

1. 이전(props)과 새로운(props) 속성 객체를 비교합니다.
2. 속성 객체에서 변경된 속성만을 필터링합니다.
3. 변경된 속성을 실제 DOM 요소에 반영합니다.

```js
function updateAttributes(target, newProps, oldProps) {

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
```
예를 들어, 이전과 새로운 속성 객체가 다음과 같다고 가정해봅시다.

```js
이전(props): { id: 'old-id', class: 'old-class', style: 'color: red;' }
새로운(props): { id: 'new-id', class: 'new-class', style: 'color: blue;' }
```

updateAttributes 함수는 이전과 새로운 속성 객체를 비교하여 변경된 속성만을 찾습니다. 위 예시에서는 id와 class 속성이 변경되었습니다. 이후 setAttribute 함수를 사용하여 변경된 속성을 실제 DOM 요소에 반영합니다. 따라서 UI는 변경된 속성에 맞게 업데이트됩니다.

이처럼 updateAttributes 함수는 UI를 업데이트하는 데 필요한 속성만을 실제 DOM 요소에 반영하여 효율적인 업데이트를 수행합니다.

## render 함수

render 함수의 역할은 가상 DOM 요소를 실제 DOM에 반영하여 화면에 렌더링하는 것입니다. 주어진 코드에서 render 함수는 가상 DOM 요소와 실제 DOM 요소를 비교하여 변경된 부분만을 실제 DOM에 반영하여 UI를 업데이트합니다.

보통 웹 애플리케이션에서는 상태(state)가 변경될 때마다 UI를 업데이트해야 합니다. 이때 render 함수는 상태가 변경될 때 호출되어 가상 DOM 요소와 실제 DOM 요소를 비교하고, 변경된 부분만을 실제 DOM에 반영하여 UI를 업데이트합니다.

render 함수의 주요 역할은 다음과 같습니다.

1. 최초 렌더링시에는 가상 DOM 요소를 실제 DOM에 반영합니다.
2. 리렌더링시에는 이전과 새로운 가상 DOM 요소를 비교하여 변경된 부분만을 실제 DOM에 반영합니다.

주어진 코드에서 render 함수는 다음과 같은 구현을 가지고 있습니다:

- 가상 DOM 요소(newNode)와 이전 가상 DOM 요소(oldNode)를 비교하여 변경된 부분만을 실제 DOM에 반영합니다.
- 변경된 부분만을 실제 DOM에 반영하기 위해 diff 알고리즘을 사용합니다.
- diff 알고리즘을 통해 변경된 요소를 찾고, 변경된 부분을 업데이트합니다.

```js
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
```

따라서 render 함수는 UI를 업데이트하는 핵심적인 역할을 담당하며, 가상 DOM과 실제 DOM 사이의 관계를 관리하여 웹 애플리케이션의 UI를 효율적으로 업데이트합니다.

## 후기
- 브라우저의 렌더링 원리에 대해 이해하는 시간이었음. (파싱 → 스타일 → 레이아웃 → 페인트 → 합성 → 렌더 )의 과정을 따른다.. 등등
- Dom트리는 브라우저상에서 확인할 수 있지만 virtualDom은 완전한 객체형식이라 브라우저상이 아니라도 확인 가능하다. 이로인해 테스트에 용이하다는 것을 학습함. 
