// Three demonstrations of the mechanism. Each one labels what it is doing while it does
// it: a diagram that moves without words is just a light.
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function make(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text) node.textContent = text;
    return node;
  }

  function head(figure, left, rightValue) {
    var bar = make('div', 'head');
    bar.appendChild(make('span', '', left));
    var b = make('b', '', rightValue);
    bar.appendChild(b);
    figure.appendChild(bar);
    return b;
  }

  function caption(figure, text) {
    figure.appendChild(make('figcaption', 'cap', text));
  }

  // 01 — the budget. A fixed grid of rows; only their contents change, so nothing on the
  // page moves while it runs. The bottom row is marked evicted, then everything above it
  // takes the place of the row above, and a new song arrives at the top.
  function budget(figure) {
    figure.classList.add('budget-demo');
    var counter = head(figure, 'Phone storage', '448 MB of 448 MB');
    var slots = make('div', 'slots');
    figure.appendChild(slots);
    figure.appendChild(make('div', 'budgetline', 'budget'));
    caption(figure, 'Every play adds a song. When the budget is full, the oldest one leaves.');

    var cap = 7, size = 64, seq = 0;
    var rows = [];

    for (var i = 0; i < cap; i++) {
      var row = make('div', 'slot');
      row.appendChild(make('div', 'mark'));
      var text = make('div', 'slotText');
      var name = make('div', 'name');
      text.appendChild(name);
      text.appendChild(make('div', 'state', ''));
      row.appendChild(text);
      row.appendChild(make('span', 'size', size + ' MB'));
      slots.appendChild(row);
      rows.push(row);
    }

    function fill(row, width, state, sizeText, playing) {
      row.querySelector('.name').style.width = width + '%';
      row.querySelector('.state').textContent = state;
      row.querySelector('.size').textContent = sizeText;
      row.classList.toggle('playing', !!playing);
    }

    // start full: top row playing, the rest waiting
    rows.forEach(function (row, i) {
      fill(row, 34 + ((i * 19) % 50), i === 0 ? 'playing' : 'on the phone', size + ' MB', i === 0);
    });

    function copy(from, to) {
      // only the top row is playing; everything below it is on the phone
      fill(to,
        parseFloat(from.querySelector('.name').style.width),
        from.querySelector('.state').textContent === 'playing' ? 'on the phone' : from.querySelector('.state').textContent,
        from.querySelector('.size').textContent,
        false);
    }

    function tick() {
      var last = rows[rows.length - 1];
      last.classList.add('evicting');
      fill(last, 18, 'evicted', '', false);

      setTimeout(function () {
        for (var i = rows.length - 1; i > 0; i--) copy(rows[i - 1], rows[i]);
        seq += 1;
        fill(rows[0], 34 + ((seq * 19) % 50), 'playing', size + ' MB', true);
        rows[0].classList.add('enter');
        setTimeout(function () { rows[0].classList.remove('enter'); }, 320);
        last.classList.remove('evicting');
        counter.textContent = (cap * size) + ' MB of 448 MB';
      }, 420);
    }

    var timer = null;
    return {
      start: function () { if (!timer) timer = setInterval(tick, 1500); },
      stop: function () { clearInterval(timer); timer = null; }
    };
  }

  // 02 — the folder. Names and sizes arrive first; audio only for the one being played.
  function folder(figure) {
    figure.classList.add('folder-demo');
    var status = head(figure, 'Your folder', 'reading names');
    caption(figure, 'Spine reads names, sizes and tags. A song is fetched only when you play it.');

    var titles = ['Opening Cut', 'Second Wind', 'Long Division', 'Half Light'];
    var list = make('div', 'rows');
    figure.appendChild(list);
    var rows = titles.map(function (title) {
      var row = make('div', 'row');
      var badge = make('div', 'badge');
      badge.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 12h7a2.5 2.5 0 0 0 .3-5 3.5 3.5 0 0 0-6.7-1A2.6 2.6 0 0 0 4.5 12Z"/></svg>';
      row.appendChild(badge);
      row.appendChild(make('span', 'title', title));
      row.appendChild(make('span', 'state', ''));
      list.appendChild(row);
      return row;
    });

    function reset() {
      status.textContent = 'reading names';
      rows.forEach(function (row, i) {
        row.classList.remove('ready', 'fetching', 'in');
        row.querySelector('.state').textContent = '';
      });
    }

    function run() {
      reset();
      rows.forEach(function (row, i) {
        setTimeout(function () {
          row.classList.add('in');
          row.querySelector('.state').textContent = 'not downloaded';
        }, 260 * i);
      });
      var afterRead = 260 * rows.length + 700;
      setTimeout(function () {
        status.textContent = 'playing 1';
        var row = rows[0];
        row.classList.add('fetching');
        row.querySelector('.state').textContent = 'fetching';
        setTimeout(function () {
          row.classList.remove('fetching');
          row.classList.add('ready');
          row.querySelector('.state').textContent = 'on the phone';
        }, 900);
      }, afterRead);
    }

    // the still frame is the whole idea: everything read, the played one fetched
    rows.forEach(function (row) { row.classList.add('in'); });
    rows.forEach(function (row) { row.querySelector('.state').textContent = 'not downloaded'; });
    rows[0].classList.add('ready');
    rows[0].querySelector('.state').textContent = 'on the phone';
    status.textContent = 'playing 1';

    var timer = null;
    return {
      start: function () { if (timer) return; run(); timer = setInterval(run, 7200); },
      stop: function () { clearInterval(timer); timer = null; }
    };
  }

  // 03 — the passenger. Two phones, and a signal going back and forth between them.
  // Nothing to press: the point is the link, not a tutorial.
  function passenger(figure) {
    figure.classList.add('pass-demo');
    head(figure, 'Passenger', 'direct, no server');
    caption(figure, 'Their phone changes the song on yours. Nothing passes through a server.');

    var stage = make('div', 'stage');
    var you = make('div', 'phone');
    you.innerHTML = '<small>Your phone</small>' +
      '<div class="bars"><b></b><b></b></div><div class="bars dim"><b></b><b></b></div>';
    var link = make('div', 'link');
    link.innerHTML = '<svg viewBox="0 0 64 120" preserveAspectRatio="none" aria-hidden="true">' +
      '<path d="M2 60 C 22 60, 42 60, 62 60"/></svg>';
    var pulse = make('div', 'pulse');
    link.appendChild(pulse);
    var them = make('div', 'phone right');
    them.innerHTML = '<small>Back seat</small>' +
      '<div class="bars"><b></b><b></b></div><div class="bars dim"><b></b><b></b></div>';
    stage.appendChild(you); stage.appendChild(link); stage.appendChild(them);
    figure.appendChild(stage);

    var theirBars = them.querySelector('.bars');

    function run() {
      pulse.style.transition = 'none';
      pulse.style.transform = 'translateX(0px)';
      pulse.style.opacity = '0';

      setTimeout(function () {
        pulse.style.transition = 'transform 1100ms cubic-bezier(.45,0,.55,1), opacity 200ms ease';
        pulse.style.opacity = '1';
        pulse.style.transform = 'translateX(54px)';
      }, 200);

      setTimeout(function () { theirBars.classList.add('lit'); }, 1200);
      setTimeout(function () {
        pulse.style.transition = 'transform 1100ms cubic-bezier(.45,0,.55,1), opacity 200ms ease';
        pulse.style.transform = 'translateX(0px)';
      }, 1900);
      setTimeout(function () { pulse.style.opacity = '0'; theirBars.classList.remove('lit'); }, 2950);
    }

    run();
    var timer = null;
    return {
      start: function () { if (timer) return; run(); timer = setInterval(run, 3600); },
      stop: function () { clearInterval(timer); timer = null; }
    };
  }

  var builders = { budget: budget, folder: folder, passenger: passenger };
  var loops = [];

  document.querySelectorAll('.demo').forEach(function (figure) {
    var build = builders[figure.dataset.demo];
    if (!build) return;
    loops.push({ figure: figure, loop: build(figure) });
  });

  if (reduce) return;   // the stills carry the idea on their own

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      loops.forEach(function (pair) {
        if (pair.figure !== entry.target) return;
        if (entry.isIntersecting) pair.loop.start();
        else pair.loop.stop();
      });
    });
  }, { rootMargin: '80px' });

  loops.forEach(function (pair) { observer.observe(pair.figure); });
})();
