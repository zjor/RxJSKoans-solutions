var Rx = require('rx'),
    Observable = Rx.Observable,
    Subject = Rx.Subject,
    Scheduler = Rx.Scheduler;

QUnit.module('Time');

var __ = 'Fill in the blank';

asyncTest('launching an event via a scheduler', function () {
  var state = null;
  var received = '';
  var delay = 0; // Fix this value
  Scheduler.default.scheduleFuture(state, delay, function (scheduler, state) {
    received = 'Finished';
  });

  setTimeout(function () {
    start();
    equal('Finished', received);
  }, 100);
});

asyncTest('launching an event in the future', function () {
  var received = null;
  var time = 0;

  var people = new Subject();
  people.delay(time).subscribe(function (x) { received = x; });
  people.onNext('Godot');

  setTimeout(function () {
    equal('Godot', received);
    start();
  }, 100)
});

asyncTest('a watched pot', function () {
  var received = '';
  var delay = 100;
  var timeout = 200;
  var timeoutEvent = Observable.just('Tepid');

  Observable
    .just('Boiling')
    .delay(delay)
    .timeout(timeout, timeoutEvent)
    .subscribe(function(x) { received = x; });

  setTimeout(function() {
    equal(received, 'Boiling');
    start();
  }, 100);
});

asyncTest('you can place a time limit on how long an event should take', function () {
  var received = [];
  var timeout = 2000;
  var timeoutEvent = Observable.just('Tepid');
  var temperatures = new Subject();

  temperatures.timeout(timeout, timeoutEvent).subscribe(received.push.bind(received));

  temperatures.onNext('Started');

  setTimeout(function () {
    temperatures.onNext('Boiling');
  }, 100);

  setTimeout(function () {
    equal('Started, Boiling', received.join(', '));
    start();
  }, 200);
});

asyncTest('debouncing', function () {
  expect(1);

  var received = [];
  var events = new Subject();
  events.debounce(100).subscribe(received.push.bind(received));

  events.onNext('f');
  events.onNext('fr');
  events.onNext('fro');
  events.onNext('from');

  setTimeout(function () {
    events.onNext('r');
    events.onNext('rx');
    events.onNext('rxj');
    events.onNext('rxjs');

    setTimeout(function () {
      equal('from rxjs', received.join(' '));
      start();
    }, 120);
  }, 120);
});

asyncTest('buffering', function () {
  var received = [];
  var events = new Subject();
  events.bufferWithTime(100)
    .map(function (c) { return c.join(''); })
    .subscribe(received.push.bind(received));

  events.onNext('R');
  events.onNext('x');
  events.onNext('J');
  events.onNext('S');

  setTimeout(function () {
    events.onNext('R');
    events.onNext('o');
    events.onNext('c');
    events.onNext('k');
    events.onNext('s');

    setTimeout(function () {
      equal('RxJS Rocks', received.join(' '));
      start();
    }, 120);
  }, 120);
});

asyncTest('time between calls', function () {
  var received = [];
  var events = new Subject();

  events.timeInterval()
    .filter(function (t) { return t.interval > 100; })
    .subscribe(function (t) { received.push(t.value); });

  events.onNext('too');
  events.onNext('fast');

  setTimeout(function () {
    events.onNext('slow');

    setTimeout(function () {
      events.onNext('down');

      equal('slow down', received.join(' '));
      start();
    }, 120);
  }, 120);
});

asyncTest('results can be ambiguous timing', function () {
  var results = 0;
  var fst = Observable.timer(400).map(-1);
  var snd = Observable.timer(500).map(1);

  fst.amb(snd).subscribe(function (x) { results = x; });

  setTimeout(function () {
    equal(results, -1);
    start();
  }, 600);
});
