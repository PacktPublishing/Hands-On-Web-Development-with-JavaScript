/** Run these in developer console */

/** Variables */

//variable declaration
var a;

//assigning value
a = 5;


/** es6 declarations */

let b;
b = 2;

/** let has a block level scope whereas
 *  var is hoisted and can be accesed anywhere in the function */

const d = 10; // declares a constant with value 10
d = 12; //can't overwrite because it is constant




/** Datatypes */

let a = 1; //number
a = "Hello"; //string

//Javascript is a dynamically typed language 


a = [1, "Hello", {"name":"World"}]; //heterogeneous array
a[0]; // -> 1


a = {fname: "Hello", lname: "World"}; //object -> key value pairs
a.fname; // -> "Hello" //using dot notation

a['lname']; // -> "World" //using square brackets


//special datatypes
let b;
typeof(b); // -> undefined
a = undefined; // undefined is a value as well

typeof(null); // -> object




/** Functions */

function sum(a, b) { // return type is not defined
    return a + b; // by default the function returns undefined
}

sum(2, 4); // -> 6


// function expression
let f;
f = function(a) {
    return a + 2;
};

f(2); // -> 4

typeof(f); // -> function




/** Control structures */
let a = "10";
a == 10; // -> true since datatypes are not compared
a === 10; // -> false


if(a === 10) {
    console.log("Yay!");
}
else if(a === 5) {
    console.log("Ok!");
}
else {
    console.log("Nay!");
}
// -> Nay!



for(let i = 0; i < 5; i++) {
    console.log(i);
}
/** Outputs
 * 0
 * 1
 * 2
 * 3
 * 4
 */
