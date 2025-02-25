// Examples of 'this' value loss
const consoleLogger = {
    context: "Database",
    log(message) {
        console.log("this", this);
        console.log(`[${this.context}]: ${message}`);
    },
};

consoleLogger.log("Hello world"); // logs '[Database]: Hello world'

const logConsoleMessage = consoleLogger.log;
logConsoleMessage("Hello world"); // logs '[undefined]: Hello world' -> 'this' does not reference 'consoleLogger' object in that case

// in case JS runs in a strict mode
"use strict";
logConsoleMessage("Hello world"); // Uncaught TypeError: Cannot read properties of undefined (reading 'context')

// ---------------------------------------------------------------------------------------------------------------------------------------

// Function declaration/expressions and 'this' object
const queryBuilder = {
    query: "select * from users",
    execute: () => {
        console.log(`Executing query: "${this.query}"`);
    },
    addSelect() {
        (() => {
            (() => {
                (() => {
                    console.log(`Adding select: "${this.query}"`);
                })();
            })();
        })();
    },
};

queryBuilder.execute(); // arrow functions inherits 'this' from first parent 'normal' function. So in the current example we get error or 'this' equals to undefined
queryBuilder.addSelect(); // correctly logs 'this' value

// ---------------------------------------------------------------------------------------------------------------------------------------

// Finding lost 'this'
const counter = {
    count: 0,
    click(name) {
        this.count += 1;
        console.log(`[${name} counter]: ${this.count}`);
    },
};

const click = counter.click;

click.call({count: 10}, "mouse click"); // func.call(context, arg1, arg2, ...argN);
click.apply(counter, ["left mouse button click"]); // func.apply(context, [arg1, arg2, ...argN]);

const boundClick = click.bind({count: 100});
boundClick("right mouse button click");

const boundClickWithPredefinedArguments = click.bind(
    {count: 100},
    "middle mouse button click",
);
boundClickWithPredefinedArguments();
boundClickWithPredefinedArguments("header click"); // logs "middle mouse button click" anyway

boundClickWithPredefinedArguments
    .bind({count: 0})
    .apply({count: 999}, ["ads click"]); // logs "middle mouse button click" anyway. So changing context of bound fn is not possible
