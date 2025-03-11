Геттери і сеттери (далі **ГіС**) дозволяють зробити звичайну властивість об'єкта динамічною. Не дивлячись на те, що замість **ГіС**, в більшості випадків, розробники використовують звичайні методи, вони мають певні переваги в деяких сценаріях, завдяки чому їх варто розглянути.

По своїй суті **ГіС** є функціями, які викликаються в момент взаємодії з властивістю об'єкта.

```
const user = {
  name: "John",
  lastName: "Snow",
  get middleName() {
    return `${this.name} ${this.lastName}`;
  },
};

console.log(user.middleName); // John Snow
```

**ГіС** мають певні особливості та обмеження:

- **Геттер** не може мати аргументів.
- **Сеттер** має тільки 1 аргумент.
- Не підтримують синтаксис з ключовим словом `async`, проте можуть повертати проміси. Варто зазначити, що це не є рекомендованою практикою і цього варто уникати. Для асинхронних операцій краще використовувати звичайні методи.

---

Альтернативний спосіб створення **геттера** використовуючи синтаксис `Object.defineProperty`:

```
Object.defineProperty({}, "getterProp", {
    get() {
        return "dynamicValue";
    },
});
```
Створення динамічних властивостей через `Object.defineProperty` має свої нюанси:

- Дескриптор складається з `get`, `set`, `enumerable`, `configurable`. Спроба встановити водночас і `get`, і `value` призведе до помилки.
- При роботі з об'єктами, властивість завжди буде додана до самого об'єкта. На відміну від створення **геттера** на рівні класу, у випадку чого властивість додається до прототипу інстансів і має флаг `enumerable: false`.

Приклад **геттера** на рівні класу:

```
class Product {
    validUntil = "2025-03-15";

    get state() {
        return new Date(this.validUntil) >= new Date() ? "valid" : "invalid";
    }
}

const product = new Product();
console.log(product.state);
// "valid"

console.log(Object.getOwnPropertyDescriptor(product, "state"));
// undefined

console.log(
    Object.getOwnPropertyDescriptor(Object.getPrototypeOf(product), "state"),
);
// { configurable: true, enumerable: false, get: function get hello() { return 'world'; }, set: undefined }

```
---

**Сеттери** створюються через ключове слово `set`, це має бути функція з 1 аргументом, механізм роботи дуже схожий:

```
const message = {
    data: {
        changedAt: null,
        text: "",
    },
    get text() {
      return this.data.text;  
    },
    set text(text) {
        this.data = {
            text,
            changedAt: new Date(),
        };
    },
};

message.text = "Hello world!";
console.log(message.text); // "Hello world!"
console.log(message.data); // { "text": "Hello world!", "changedAt": "2025-03-11T06:19:43.327Z" }

```


### Коли все це може знадобитися

- Оптимізація розрахунку значення властивості завдяки `get`. Значення, що поверне **геттер**, обчислюється тільки в момент його використання. Тобто це можна використати для збереження використання ресурсів до моменту потреби. А якщо дані не будуть використані - важкий розрахунок ніколи і не відбудеться.
- Додатково можна реалізувати механізм кешування результата значення. Для простих сценаріїв може підійти перезаписування **геттера**:

```
const state = {
    get nodes() {
        delete this.nodes;
        this.nodes = document.querySelectorAll("*");
        return this.nodes;
    }
}
// state.nodes геттер видаляється з об'єкта, замість нього створюється звичайна властивість. 
// В результаті чого розрахунок значення відбувається лише 1 раз
```
- Сумісність і модифікація існуючих властивостей. Може бути ситуація, коли впродовж розробки проєкту змінюється формат тих, чи інших об'єктів, з-за чого може виникнути необхідність оновити раніше написаний код, що залежав від попереднього формату об'єкта. Іноді **геттери** можуть допомогти залишити сумісність зі старим кодом, якщо є можливим реалізувати **геттер** на старі назви властивостей, тим самим зберігаючи їх минулі значення або логіку розрахунку.
  Приклад збереження сумісності:

```
const dbConfig = {
    connectionString: "dbname.user:password"
};

const db = {
    connectionString: dbConfig.connectionString
};

// Уявімо що в процесі розробки ми змінюємо тип об'єкта dbConfig на: dbName, user, password замість однієї властивості 'connectionString'
const dbConfig = {
    dbName: "dbname",
    user: "root",
    password: "root",
};
// Тепер необхідно оновити 'db' object через те, що він використовує попередню версію об'єкта з властивістю 'connectionString'
// Але замість цього ми можемо просто додати геттер 'connectionString'

const dbConfig = {
    dbName: "dbname",
    user: "root",
    password: "root",
    get connectionString() {
        return `${this.dbName}.${this.user}:${this.password}`
    },
};
// В результаті нам тепер не потрібно оновлювати існуючу кодову базу, що була залежна від властивості connectionString
```

- Динамічне значення, що залежить від інших властивостей об'єкта. Логіку розрахунку значення можна винести в **геттер**, замість того, щоби вручну змінювати значення властивості при обробці якихось івентів або залежних бізнес сценаріїв.

```
class Product {
    validUntil = "2025-03-15";

    get state() {
        return new Date(this.validUntil) >= new Date() ? "valid" : "invalid";
    }
    
    updateValidDate(date) {
        this.validUntil = date;
        // Завдяки використанню геттера для state нам немає потреби розраховувати значення state в методі updateValidDate
    }
}
```
---

Резюмуючи, загалом з використанням **ГіС** стикаються доволі рідко. Також їх практично завжди можна замінити методами, що може бути більш універсальним рішенням. Проте потенціал використання все ж таки є. Це сценарії, коли треба розрахувати якесь значення на основі інших властивостей об'єкта, або просто коли семантика "властивості" підходить краще ніж повноцінний метод.

---
- [Телеграм](https://t.me/mn_it_blog)
- Ресурси:
    - [get](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get)
    - [set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set)
    - [property accessors](https://javascript.info/property-accessors)


