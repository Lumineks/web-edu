# Функції конструктори

Якщо розділити функції на звичайні і стрілочні - всі звичайні функції, в незалежності від того як вони були створені (**function declaration**/**function expression**) - є конструкторами.

**Функція конструктор** - це функція,  яку можна викликати з ключовим словом `new`, і в результаті цього, буде створений новий об’єкт.

    function BaseError(message) {
        this.message = message;
    }
    const error = new BaseError("something went wrong");
    console.log(error); // BaseError { message: 'something went wrong' }

## Особливості роботи функцій конструкторів

- Коли **функція конструктор** викликається з ключовим словом `new` - створюється новий пустий об’єкт, а ключове слово `this` буде посиланням на нього.
- `return` значенням функції автоматично стає новостворений `this`. Однак можна повернути інший об’єкт, але якщо повернути примітивний тип даних - це проігнорується.
  Цю поведінку можна умовно проілюструвати так:

      function BaseError(message) {
           // const this = { };
           this.message = message;
           // return specified object OR this by default;
       }

- Властивість `new.target` всередині функції є індикатором того, чи була вона викликана як конструктор через `new`, чи як звичайна функція. Значенням буде або `undefined`, або ця сама функція. Це можна використовувати наприклад для того, щоб створювати помилку у разі виклику функції без `new`, або для того, щоб в будь-якому випадку повернути новий об’єкт:



    function BaseError(message) {
		console.log(new.target) // if called with new - ƒ BaseError...
        if(!Boolean(new.target)) { // if called without new - undefined
	        return new BaseError(message);
        }
        this.message = message;
    }
    const error = new BaseError("something went wrong");


- **Функції конструктори** загапьно прийнято називати з великої літери, і не викликати їх без ключового слова `new` (на рівні синтаксису це, звичайно, жодним чином не регулюється).

**Ресурси:**
- https://developer.mozilla.org/en-US/docs/Glossary/Constructor
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new
- https://javascript.info/constructor-new


