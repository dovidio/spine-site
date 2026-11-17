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

  // 01 — the budget. Songs arrive newest-first; the oldest is evicted, and it says so.
  function budget(figure) {
    figure.classList.add('budget-demo');
    var counter = head(figure, 'Phone storage', '448 MB of 448 MB');
    var slots = make('div', 'slots');
    figure.appendChild(slots);
    var line = make('div', 'budgetline', 'budget');
    figure.appendChild(line);
    caption(figure, 'Every play adds a song. When the budget is full, the oldest one leaves.');

    var cap = 7, size = 64, seq = 0, onPhone = [];

    function add() {
      var slot = make('div', 'slot fresh');
      slot.appendChild(make('div', 'mark'));
      var text = make('div', 'slotText');
      var name = make('div', 'name');
      name.style.width = (34 + ((seq * 19) % 50)) + '%';
      text.appendChild(name);
      text.appendChild(make('div', 'state', seq === 0 ? 'playing' : 'on the phone'));
      slot.appendChild(text);
      slot.appendChild(make('span', 'size', size + ' MB'));
      slots.insertBefore(slot, slots.firstChild);
      requestAnimationFrame(function () { slot.classList.remove('fresh'); });
      seq += 1;

      // the song that was newest stops being newest; the new one is the one playing
      if (onPhone[0]) {
        onPhone[0].classList.remove('playing');
        onPhone[0].querySelector('.state').textContent = 'on the phone';
      }
      slot.classList.add('playing');
      onPhone.unshift(slot);

      if (onPhone.length > cap) {
        var victim = onPhone.pop();
        victim.classList.add('out');
        victim.querySelector('.state').textContent = 'evicted';
        victim.querySelector('.size').textContent = '';
        victim.querySelector('.name').style.width = '18%';
        setTimeout(function (node) { if (node.parentNode) node.parentNode.removeChild(node); }, 420, victim);
      }
      counter.textContent = (onPhone.length * size) + ' MB of 448 MB';
    }

    for (var i = 0; i < cap; i++) add();
    var timer = null;
    return {
      start: function () { if (!timer) timer = setInterval(add, 1400); },
      stop: function () { clearInterval(timer); timer = null; }
    };
  }

  // 02 — the folder. Names and sizes arrive first; audio only for the one being played.
  function folder(figure) {
    figure.classList.add('folder-demo');
    var status = head(figure, 'Your folder', 'reading names');
    caption(figure, 'Spine reads names, sizes and tags. A song is fetched only when you play it.');

    var titles = ['Opening Cut', 'Second Wind', 'Long Division', 'Half Light'];
    var rows = titles.map(function (title) {
      var row = make('div', 'row');
      var badge = make('div', 'badge');
      badge.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 12h7a2.5 2.5 0 0 0 .3-5 3.5 3.5 0 0 0-6.7-1A2.6 2.6 0 0 0 4.5 12Z"/></svg>';
      row.appendChild(badge);
      row.appendChild(make('span', 'title', title));
      row.appendChild(make('span', 'state', ''));
      figure.appendChild(row);
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

  // 03 — the passenger. Their phone presses next; the song changes on yours.
  function passenger(figure) {
    figure.classList.add('pass-demo');
    head(figure, 'Passenger', 'direct, no server');
    caption(figure, 'Their phone changes the song on yours. Nothing passes through a server.');

    var stage = make('div', 'stage');
    var you = make('div', 'phone');
    you.innerHTML =
      '<small>Your phone</small>' +
      '<div class="now"><b class="t1"></b><b class="t2"></b></div>' +
      '<span class="pill ok">playing</span>';
    var link = make('div', 'link');
    link.innerHTML =
      '<svg viewBox="0 0 56 120" preserveAspectRatio="none" aria-hidden="true">' +
      '<path d="M2 34 C 26 34, 30 60, 54 60"/>' +
      '<path d="M2 86 C 26 86, 30 60, 54 60"/></svg>';
    var chip = make('div', 'chip', 'next ›');
    link.appendChild(chip);
    var them = make('div', 'phone right');
    them.innerHTML =
      '<small>Back seat</small>' +
      '<div class="now"><b class="t1 dim"></b><b class="t2 dim"></b></div>' +
      '<span class="pill press">press next</span>';
    stage.appendChild(you); stage.appendChild(link); stage.appendChild(them);
    figure.appendChild(stage);

    var press = them.querySelector('.press');
    var playing = you.querySelector('.pill');
    var chipEl = chip;
    var t1 = you.querySelector('.t1'), t2 = you.querySelector('.t2');

    function run() {
      press.classList.remove('show', 'active');
      playing.textContent = 'playing';
      chipEl.style.transition = 'none';
      chipEl.style.transform = 'translate(0px, -50%)';
      chipEl.style.opacity = '0';
      t1.style.width = '44px';
      t2.style.width = '30px';

      setTimeout(function () { press.classList.add('show'); }, 400);
      setTimeout(function () { press.classList.add('active'); press.textContent = 'pressed'; }, 1500);
      setTimeout(function () {
        chipEl.style.transition = 'transform 900ms cubic-bezier(.4,0,.2,1), opacity 200ms ease';
        chipEl.style.opacity = '1';
        chipEl.style.transform = 'translate(56px, -50%)';
      }, 1800);
      setTimeout(function () {
        chipEl.style.opacity = '0';
        t1.style.width = '58px';
        t2.style.width = '38px';
        playing.textContent = 'next song';
        press.textContent = 'press next';
        press.classList.remove('active');
      }, 2900);
    }

    press.classList.add('show');
    var timer = null;
    return {
      start: function () { if (timer) return; run(); timer = setInterval(run, 5200); },
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
