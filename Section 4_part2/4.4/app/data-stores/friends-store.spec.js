import test from 'ava';
import FriendsStore from './friends-store';

let fs;

test.before(t => {
    fs = new FriendsStore();
});

test('loadData', t => {
    const promise = fs.loadData();
    if(promise.then) {
        t.pass();
    }
    else {
        t.fail();
    }
});

test('getAll', t => {
    fs.loadData().then(() => {
        const res = fs.getAll();
        const expected = [ { name: 'John', userid: 'john4', age: 21, location: 'Bengaluru' }, { name: 'Cathy', userid: 'cathy', age: 21, location: 'Bengaluru' }, { name: 'Rama', userid: 'rama3', age: 21, location: 'Bengaluru' } ];
        t.deepEqual(res, expected);
    });
});