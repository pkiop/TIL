## map

```jsx
const products = [
    {name : '반팔티', price: 15000},
    {name : '긴팔티', price: 20000},
    {name : '핸드폰케이스', price: 15000},
    {name : '후드티', price: 30000},
    {name : '바지', price: 25000},
];

// 따로 name 만 담은 배열을 만들거나 price만 담은 배열이 필요할 때

// 이런식으로 짜는게 일반적인 생각.
// map 함수를 통해 쉽게 구현 가능 
// let names = [];
// for (const p of products) {
//     names.push(p.name);
// }
// log(names);
// let prices = [];
// for (const p of products) {
//     prices.push(p.price);
// }
// log(prices);

const map = (f, iter) => {
    let res = [];
    for (const a of iter) {
        res.push(f(a));
    }
    return res;        
};

let names = [];
let prices = [];
names = map(p => p.name, products);
prices = map(p => p.price, products);
log(names);
log(prices);
```

map 활용성이 매우 뛰어남. 사실상 모든 것들을 map을 할 수 있다. 

```jsx
log([1,2,3].map(a => a + 1));
// map method를 가진 객체를 상속받지 않았기 때문에 map method가 없다.
// log(document.querySelectorAll('*').map(el => el.nodeName)); 
log(map(el => el.nodeName, document.querySelectorAll('*')));

function *gen() {
    yield 2;
    yield 3;
    yield 4;
}
log(map(a => a * a, gen()));
```

```jsx
let m = new Map();
m.set('a', 10);
m.set('b', 20);
const it = m[Symbol.iterator]();

// 구조분해를 해서
log(map(([k, a]) => [k, a * 2], m));
let newm = new Map(map(([k, a]) => [k, a * 2], m));
log(newm);
```

### filter

```jsx
// filter가 필요한 경우
let under20000 = [];
for(const p of products) {
    if(p.price < 20000) under20000.push(p);
}
log(under20000);

let over20000 = [];
for(const p of products) {
    if(p.price >= 20000) over20000.push(p);
}
log(over20000);
```

```jsx
const filter = (cmp, iter) => {
    let res = [];
    for(const p of iter) {
        if(cmp(p)) res.push(p);
    }
    return res;
}

let u20000 = [], o20000 = [];
u20000 = filter(a => a.price < 20000, products);
o20000 = filter(a => a.price >= 20000, products);
log(...u20000); log(...o20000);
```

### reduce

여러 이터러블한 값을 축약하는 기능

```jsx
//이런 걸 하고 싶을 때
const nums = [1,2,3,4,5];

let sum = 0;
for(const a of nums) {
    sum += a;
}
log(sum);
```

```jsx
const reduce = (f, acc, iter) => {
    for(const a of iter) {
        acc = f(acc, a);
    }
    return acc;
};

log(reduce(add, 0, [1,2,3,4,5])); // 적용할 function, 초기값, 이터러블
```

실제 Javascript에서는 초기값 입력 없이 iter의 첫번째 값을 가져다 쓴다. 그렇게 구현하면 

```jsx
const reduce = (f, acc, iter) => {
    if(!iter) { // iter가 없으면 (acc 가 생략되어 iter에 들어가야 했던 게 acc로 들어감)
        iter = acc[Symbol.iterator]();
        acc = iter.next().value;
    }

    for(const a of iter) {
        acc = f(acc, a);
    }
    return acc;
};

log(reduce(add, 0, [1,2,3,4,5])); // 적용할 function, 초기값, 이터러블
log(reduce(add, [1,2,3,4,5]));
log(reduce(
    (totalPrice, product) => totalPrice + product.price, 
    0, 
    products)
);
```

### Map, Filter, Reduce 함께 쓰며 함수형 사고로 코딩하기

```jsx
const add = (a, b) => a+b;
    // 가격을 뽑는 map 함수
    log(map(p => p.price, products));
    // 특정 금액 이하만 뽑고 싶을 때
    log(map(p => p.price, filter(p => p.price < 20000, products)));
    // 그 나온 값을 다 더하고 싶을 때

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

## vscode 꿀팁

변수 이름 누르고 commamd + D

누를 때 마다 같은 이름의 변수 반복선택 된다.

```jsx
const log = console.log;

const products = [
  {name : '반팔티', price: 15000},
  {name : '긴팔티', price: 20000},
  {name : '핸드폰케이스', price: 15000},
  {name : '후드티', price: 30000},
  {name : '바지', price: 25000},
];

const filter = (cmp, iter) => {
  let res = [];
  for(const p of iter) {
    if(cmp(p)) res.push(p);
  }
  console.log('filter : ', res);
  return res;
}
const reduce = (f, acc, iter) => {
  console.log(f, acc, iter);
  if(!iter) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  }

  for(const a of iter) {
    acc = f(acc, a);
  }
  return acc;
}

const map = (f, iter) => {
  let res = [];
  for(const a of iter) {
    res.push(f(a));
  }
  return res;
}
const add = (a, b) => a + b;
const cmp = a => a > 15000;
log(reduce(
  add,
  filter(cmp, 
    map(p => p.price, products))));
```
