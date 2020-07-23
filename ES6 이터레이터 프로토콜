```jsx
//ES5 스러운 interation
  const log = console.log;
  const list = [1,2,3];

  for(var i = 0;i<list.length; ++i) {
      log(list[i]);
  }

  //ES6+
  for(const a of list) {
      log(a);
  }
```

더 선언적이고 간결하게 변경되었다. 

```jsx
const arr = [1, 2, 3];
for(const a of arr) log(a);

// 잘 도는 arr를 아래와 같이 하면 iteration 할 수 없다.
//arr[Symbol.iterator] = null; // arr의 iterator 관련 함수를 없애버림 
//for(const a of arr) log(a);
// -> Symbol.iterator에 담긴 함수와 for of 문 사이에 연관이 있다는 걸 알 수 있다.
// arr[Symbol.iterator] 에 담긴 값은 iterator를 리턴하는 함수.
const set = new Set([1, 2, 3]);
for(const a of set) log(a);

const map = new Map([['a', 1], ['b', 2], ['c', 3]]);
for(const a of map) log(a);
const mapKeys = map.keys(); // 이터레이터를 return, key만 담게 됨
for(const a of mapKeys) log(a);
for(const a of map.keys()) log(a); // key만
for(const a of map.values()) log(a); // 값만
for(const a of map.entries()) log(a); // map과 같음

let iter1 = arr[Symbol.iterator]();
iter1.next();
for(const a of iter1) log(a); // 2, 3
```

이터러블 / 이터레이터 프로토콜

- 이터러블 : 이터레이터를 리턴하는 [Symbol.iterator]() 를 가진 값
- 이터레이터 : {value, done } 객체를 리턴하는 next() 를 가진 값
    - next()는 iterator가 다음 값을 가지게 하도록 하는 method
    - value는 값, done은 끝났는지

    ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/9a532b11-f3b8-4725-916a-863d27afd5f0/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/9a532b11-f3b8-4725-916a-863d27afd5f0/Untitled.png)

    - for ... of 에서 a 에 value의 값을 담는다.
- 이터러블 / 이터레이터 프로토콜 : 이터러블을 for ... of, 전개 연산자 등과 함께 동작하도록 한 규약

### 사용자 정의 이터러블

1단계 ( not well formed iterable )

```jsx
const iterable = {
        // 이 method를 구현하고 있어야
        [Symbol.iterator]() {
            // value를 하나씩 줄여가는 것 구현하기
            let i = 3;
            return {
                next() {
                    return i === 0 ? {  done: true } : { value: i--, done: false };
                },
            }
        }
    };
```

- 이터러블을 구현한다.
- const a of iterable 에서는 잘 돌아간다.
- 하지만 [Symbol.iterator]() 의 return 값으로 저장되는 iter는 const a of iter 에서 돌아가지 않는다.
- 이를 잘 돌아가게 하는 well formed iterator 라고 한다.

2단계 ( well formed iterable )

- return 값에 [Symbol.iterator]()를 추가.

```jsx
return {
    next() {
        return i === 0 ? {  done: true } : { value: i--, done: false };
    },
    [Symbol.iterator]() {return this; }
}
```

### 이터러블에 관한 정보

- 많은 오픈소스, API 의 객체에서 iterable을 구현하려고 노력한다.

```jsx
for(const a of document.querySelectorAll('*')) log(a);
```

## 전개연산자

```jsx
const a = [1, 2];
log([...a, ...[3,4]]); // ... 전개 연산자. 가지고 있는 걸 전개
```

# 추가정보

## Javascript Set

Set → 집합

중복되지 않은 값을 정렬되지 않은 형태로 저장하는 데이터 구조 (javascript the definition guide 6/E)

 let → 동사 let 을 의미

우리 얘라는 변수를 ~로 쓰자 ~!
