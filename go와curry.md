```jsx
// 보통 이런식으로 정리
log(reduce(
    add, 
    map(p => p.price, 
        filter(p => p.price < 20000, products))));

//이렇게도 가능
log(reduce(
    add, 
    filter(n => n >= 20000,
        map(p => p.price, products))));
```

- 코드가 중첩이 되어있어 읽기 불편하다.
- 읽기 좋게 해보자.

go 와 pipe

- go : 곧바로 값으로  evaluation
- pipe : function을 return

### go function

```jsx
// ... 은 list가 아닌게 나열에서 오는데 전개 연산자로 list 로 만듬 
const go = (...args) => {
    reduce((a, f) => f(a), args); 
};
// args의 첫번 째 값은 reduce함수 init 값 없을 때의 정의에 따라 
// 0 이 첫 a 로 들어가고, f에 차례대로 정의한 function이 들어가는 구조
// a 는 계속 누적 값이 되고 f는 2번째 인자로 아래의 =>로 정의한 function이 차례로

go(
    0,
    a => a + 1,
    a => a + 10,
    a => a + 100,
    log);
// 111 출력을 기대.
```

### Pipe function

```jsx
// ... 은 list가 아닌게 나열에서 오는데 전개 연산자로 list 로 만듬 
const go = (...args) => reduce((a, f) => f(a), args); 
const pipe = (...fs) => (a) => go(a, ...fs);

// args의 첫번 째 값은 reduce함수 init 값 없을 때의 정의에 따라 
// 0 이 첫 a 로 들어가고, f에 차례대로 정의한 function이 들어가는 구조

go(
    0,
    a => a + 1,
    a => a + 10,
    a => a + 100,
    log);
// 111 출력을 기대.

// 3개의 함수를 하나의 함수로 축약해서 만드는 것
const f = pipe(
    a => a + 1,
    a => a + 10,
    a => a + 100);
```

인자 2개일 때에 깔끔하게 처리방법

```jsx
const pipe = (f, ...fs) => (...as) => go(f(...as), ...fs); // 첫번째 함수 꺼내서 한번 적용하고 처리 하도록
```

```jsx
const pipe = (f, ...fs) => (...as) => go(f(...as), ...fs); 
const newf = pipe(
  (a,b) => a + b,
  a => a + 10, // 두번째 함수까지 인자 2개받으면 NaN 리턴..
  a => a + 10,
  log
)
```

만든 go 로 읽기 좋은 코드 만들기

```jsx
// 위에서부터 아래로 의미대로 읽을 수 있다. 
go(
    products,
    products => filter(p=>p.price < 20000, products),
    products => map(p=>p.price, products),
    prices => reduce(add, prices),
    log);
```

### Curry

```jsx
// 함수를 받아서 함수를 리턴, 리턴된 함수가 실행되었을 때 인자가 2개 이상이면 즉시 실행, 그것보다 작다면 함수를 다시 실행, 그 이후에 받은 인자들로 다시 실행
const curry = f => (a, ..._) => _.length ? f(a, ..._) : (..._) => f(a, ..._);
const mult = curry((a, b) => a * b);
log(mult(1)); // 이 땐 안나옴
log(mult(1)(2));

//응용 
const mult3 = mult(3);
log(mult3(10));
log(mult3(5));
log(mult3(3));
```

### Curry 적용해서 다시 만든 map, filter, reduce

```jsx
const curry = f =>
    (a, ..._) => _.length ? f(a, ..._) : (..._) => f(a, ..._);

const map = curry((f, iter) => {
    let res = [];
    for(const a of iter) {
        res.push(f(a));
    }
    return res;
});

const filter = curry((cmp, iter) => {
    let res = [];
    for(const a of iter) {
        if(cmp(a)) res.push(a);
    }
    return res;
});

const reduce = curry((f, acc, iter) => {
    if(!iter) {
        iter = acc[Symbol.iterator]();
        acc = iter.next().value;
    }

    for(const a of iter) {
        acc = f(acc, a);
    }
    return acc;
});
```

바꿨으면 실제 적용

```jsx
go(
  products,
  products => filter(p=>p.price < 20000)(products),
  products => map(p=>p.price)(products),
  prices => reduce(add)(prices),
  log);

// 이게 가능하니깐

go(
  products,
  filter(p => p.price < 20000),
  map(p => p.price),
  reduce(add),
  log);
```

### 코드 중복 제거에 활용

```jsx
go(
    products,
    filter(p => p.price < 20000),
    map(p => p.price),
    reduce(add),
    log);

go(
    products,
    filter(p => p.price >= 20000),
    map(p => p.price),
    reduce(add),
    log);

중복은 빼서

const total_price = pipe(
    map(p => p.price),
    reduce(add));

go(
    products,
    filter(p => p.price < 20000),
    total_price,
    log);

go(
    products,
    filter(p => p.price >= 20000),
    total_price,
    log);

// 이렇게 더 줄이기도 가능

const total_price = pipe(
        map(p => p.price),
        reduce(add));
    
    const base_total_price = predi => pipe(
        filter(predi),
        total_price);

    go(
        products,
        base_total_price(p => p.price < 20000),
        log);

    go(
        products,
        base_total_price(p => p.price >= 20000),
        log);
```

### 요약

함수 실행 순서를 조작하는 go와 

함수를 부분적으로 다루는 curry를 이용해 

표현력이 높고 깔끔한 코드를 만들었다.

### 배운 것

Arrow function  : => { return expression; }

```jsx
const go = (...args) => {reduce((a, f) => f(a), args)}; // 중괄호로 안에 내용 명시하려 했는데 이렇게 하면 안되었다. 할꺼면 return 써줘야??
const go = (...args) => reduce((a, f) => f(a), args);
```
