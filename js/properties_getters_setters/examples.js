const user = {
  name: "John",
  lastName: "Snow",
  get middleName() {
    return `${this.name} ${this.lastName}`;
  },
};

console.log(user.middleName); // John Snow

Object.defineProperty({}, "getterProp", {
    get() {
        return "dynamicValue";
    },
});


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
console.log(message.text);
console.log(message.data); // { "text": "Hello world!", "changedAt": "2025-03-11T06:19:43.327Z" }


const state = {
    get nodes() {
        delete this.nodes;
        this.nodes = document.querySelectorAll("*");
        return this.nodes;
    }
}


const dbConfig = {
    connectionString: "dbname.user:password"
}

const db = {
    connectionString: dbConfig.connectionString
}

const dbConfig = {
    dbName: "dbname",
    user: "root",
    password: "root",
    get connectionString() {
        return `${this.dbName}.${this.user}:${this.password}`
    },
};

const db = {
    connectionString: dbConfig.connectionString
}


class Product {
    validUntil = "2025-03-15";

    get state() {
        return new Date(this.validUntil) >= new Date() ? "valid" : "invalid";
    }

    updateValidDate(date) {
        this.validUntil = date;
        //
    }
}
