# Контекст this. Методи call, apply, bind.

**this** - ключове слово, що є посиланням на контекст, в якому виконується функція. Значення залежить від того як функція була викликана, не від того як функція була створена. Виключенням буде функція, що була створена використовуючи метод `bind` - в такому випадку прив'язка контексту буде вже незмінною, в незалежності від того як буде викликатися.
- Якщо функція викликається як метод об'єкта - тоді `this` буде вказувати на об'єкт перед точкою (`obj.method()`). 
- Якщо функція викликається окремо, тоді `this` буде вказувати на глобальний об'єкт або undefined, в залежності від того чи виконуєтсья код в `strict mode` чи ні.

Є різниця в роботі контексту `this` між функціями виду `function expression/declaration` та `arrow functions`.  
Значення `this` в рамках **стрілочних функцій** дорівнює значенню `this` батьківської функції. Отже візьметься значення `this` першої не-стрілочної функції, і ця функція може бути на будь-якому рівні вкладенності. Простіше кажучи - шукаємо найближчу батьківську `expression/declaration` функцію - і `this` будь-яких вкладенних стрілочних функцій буде дорівнювати її значенню `this`.
Так як стрілочні функції не мають власного значення `this` - його не можна буде змінити використовуючи методи `call`, `apply`, `bind`.

> контекст this - не обов'язково об'єкт. Ми можемо призначити будь-який примітив чи інший тип данних. Проте це може призвести до помилки, якщо функція очікує що в якості this буде саме об'єкт.

**Втрата контексту**
Якщо є потреба передати метод об'єкту в якості колбеку, при цьому метод залежить на використання контексту this - необхідно прив'язати значення this при передачі. 
Для цього у функцій існує 3 методи: call, apply, bind. Всі методи очікують першим аргументом значення this. Це і буде об'єкт, до якого прив'яжеться контекст функції. Методи сall та apply можна згрупувати - вони викликають функцію на місці, з різницею в тому, що call - приймає аргументи функції як окремі значення, а apply - як массив.

    func.call(context, arg1, arg2, ...argN);
    func.apply(context, args);
`args` у прикладі з методом apply - це [псевдомасив](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Indexed_collections#working_with_array-like_objects)
Робота методу `bind` відрізяється - функція **НЕ** викликається, проте створюється нова, до якої на постійній основі прив'язується вказане значення `this`. Аргументи передаються аналогічно методу `call` окремо:

    const foo = func.bind(context, arg1, arg2, ...argN);
Особливості методу bind:

 - Прив'язка контексту є **постійною**. Якщо новій функції, створеній через `bind`, спробувати знову прив'язати контекст будь-яким методом - буде використанний контекст вказаний при використанні першого `bind` на **цільовій** функції.
 - Аргументи, передані в `bind`, також є постійними. Тобто вони назавжди займають собою відповідні місця параметрів **цільової** функції при наступних викликах. Якщо при виклику передати ще аргументи - вони прокинуться **ЗА** тими, що були вказані при виклику `bind`.
 
 Приклади використання bind:
 ```
function log(...args) {
  console.log(this, ...args);
}
const boundLog = log.bind("this value", 1, 2); // створюємо нову функцію
const boundLog2 = boundLog.bind("new this value", 3, 4);
boundLog2(5, 6); // "this value", 1, 2, 3, 4, 5, 6
```

    

**Ресурси:**
 - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
 - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call
 - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply
 - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
 - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Indexed_collections#working_with_array-like_objects
 - https://uk.javascript.info/object-methods
 - https://uk.javascript.info/call-apply-decorators
 - https://uk.javascript.info/bind

