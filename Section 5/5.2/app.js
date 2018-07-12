const num = [1,2,3,4,5,6,7,8,9];

function multiplyBy2(numbers) {
    return numbers.map(n => n*2);
}

function multiplesOf2(numbers) {
    return numbers.filter(n => n%2 === 0);
}

function sum(numbers) {
    return numbers.reduce((t, n) => t + n, 0);
}

console.log(
    sum(
        multiplyBy2(
            multiplesOf2(num)
        )
    )
);

console.log(num);