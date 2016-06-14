var Rx = require('rx'),
    Observable = Rx.Observable,
    EventEmitter = require('events').EventEmitter;

QUnit.module('Querying');

var __ = 'Fill in the blank';

test('Basic querying', function () {
  var strings = [];
  var numbers = Observable.range(1, 100);

  numbers
    .filter(function (x) { return x % 11 === 0 })
    .map(function (x) { return x.toString() })
    .toArray()
    .subscribe(strings.push.bind(strings));

  equal('11,22,33,44,55,66,77,88,99', strings.toString());
});

test('querying over events', function () {
  var results = 0;

  var e = new EventEmitter();
  Observable.fromEvent(e, 'click')
    .filter(function (click) { return click.x === click.y })
    .map(function (click) { return click.x + click.y; })
    .subscribe(function (x) { results = x; });

  e.emit('click', {x: 100, y: 50});
  e.emit('click', {x: 75,  y: 75});
  e.emit('click', {x: 40,  y: 80});

  equal(results, 150);
});

test('buffering with count and skip', function () {
  var results = [];
  Observable.range(1, 10)
    .bufferWithCount(5, 5)
    .subscribe(results.push.bind(results));

  equal('12345',  results[0].join(''));
  equal('678910', results[1].join(''));
});
