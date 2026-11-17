// Three demonstrations of the mechanism. Each one runs only while it is on screen and
// holds its final state when the visitor asks for reduced motion.
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var running = new Map();

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

  // 01 — the budget: songs arrive newest-first; the oldest leaves when the ceiling is hit.
  function budget(figure) {
    figure.classList.add('budget-demo');
    var counter = head(figure, 'On the phone', '0 MB');
    var line = make('div', 'budgetline');
    line.appendChild(make('i'));
    line.appendChild(make('span', '', 'budget'));
    var slots = make('div', 'slots');
    figure.appendChild(slots);
    figure.appendChild(line);

    var cap = 7, size = 64, used = 0, seq = 0;

    function add() {
      used += size;
      var slot = make('div', 'slot fresh');
      slot.appendChild(make('div', 'mark'));
      slot.appendChild(make('div', 'name'));
      slot.appendChild(make('span', 'size', size + ' MB'));
      slot.querySelector('.name').style.width = (40 + ((seq * 17) % 45)) + '%';
      slots.insertBefore(slot, slots.firstChild);
      seq += 1;
      requestAnimationFrame(function () { slot.classList.remove('fresh'); });
      while (slots.children.length > cap) {
        var victim = slots.lastElementChild;
        used -= size;
        victim.classList.add('out');
        setTimeout(function (node) { if (node.parentNode) node.parentNode.removeChild(node); }, 280, victim);
      }
      used = Math.min(used, size * cap);
      counter.textContent = used + ' MB';
    }

    for (var i = 0; i < cap; i++) add();
    counter.textContent = used + ' MB';
    return { start: function () { setInterval(add, 1100); } };
  }

  // 02 — the folder: names and sizes first, then audio only for what is played.
  function folder(figure) {
    figure.classList.add('folder-demo');
    head(figure, 'Reading the folder', 'tags only');
    var cloud = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 12h7a2.5 2.5 0 0 0 .3-5 3.5 3.5 0 0 0-6.7-1A2.6 2.6 0 0 0 4.5 12Z"/></svg>';
    var rows = [];
    for (var i = 0; i < 4; i++) {
      var row = make('div', 'row');
      var badge = make('div', 'badge');
      badge.innerHTML = cloud;
      row.appendChild(badge);
      var title = make('div', 'title');
      title.style.width = (56 - i * 7) + '%';
      row.appendChild(title);
      row.appendChild(make('span', 'size', ''));
      figure.appendChild(row);
      rows.push(row);
    }

    function reset() {
      rows.forEach(function (r) { r.classList.remove('in', 'ready', 'fetching'); });
    }

    function run() {
      reset();
      rows.forEach(function (row, i) { setTimeout(function () { row.classList.add('in'); }, 220 * i); });
      var t = 220 * rows.length + 500;
      rows.forEach(function (row, i) {
        setTimeout(function () {
          row.classList.add('fetching');
          setTimeout(function () {
            row.classList.remove('fetching');
            row.classList.add('ready');
          }, 520);
        }, t + i * 900);
      });
    }

    // The first paint is the whole story in miniature: every name read, the played one fetched.
    rows.forEach(function (row) { row.classList.add('in'); });
    rows[0].classList.add('ready');
    return { start: function () { run(); setInterval(run, 6200); } };
  }

  // 03 — the passenger: approval travels one way, the next song travels back.
  function passenger(figure) {
    figure.classList.add('pass-demo');
    head(figure, 'Passenger', 'phone to phone');
    var stage = make('div', 'stage');
    var left = make('div', 'phone guest');
    left.innerHTML = '<b></b><small>your phone</small><span class="pill ask">approve?</span>';
    var link = make('div', 'link');
    link.innerHTML = '<svg viewBox="0 0 56 148" preserveAspectRatio="none" aria-hidden="true">' +
      '<path d="M2 40 C 24 40, 32 74, 54 74"/><path d="M2 108 C 24 108, 32 74, 54 74"/></svg>';
    var packet = make('div', 'packet');
    link.appendChild(packet);
    var right = make('div', 'phone host');
    right.innerHTML = '<b></b><small>back seat</small><span class="pill send">next track</span>';
    stage.appendChild(left); stage.appendChild(link); stage.appendChild(right);
    figure.appendChild(stage);
    var progress = make('div', 'progress');
    progress.appendChild(make('i'));
    figure.appendChild(progress);

    var ask = left.querySelector('.ask');
    var send = right.querySelector('.send');
    var bar = progress.firstChild;

    function travel(node, x, y, ms, then) {
      node.style.transition = 'transform ' + ms + 'ms cubic-bezier(.4,0,.2,1), opacity 180ms ease';
      node.style.opacity = '1';
      node.style.transform = 'translate(' + x + 'px, calc(-50% + ' + y + 'px))';
      setTimeout(function () { node.style.opacity = '0'; if (then) then(); }, ms + 120);
    }

    function run() {
      ask.classList.remove('show', 'ok');
      send.classList.remove('show');
      bar.style.width = '0%';
      packet.style.transition = 'none';
      packet.style.transform = 'translate(-8px, -50%)';
      packet.style.opacity = '0';

      setTimeout(function () { ask.classList.add('show'); }, 300);
      setTimeout(function () {
        travel(packet, 52, -18, 520, function () {
          ask.classList.remove('show');
          ask.classList.add('show', 'ok');
          ask.textContent = 'approved';
        });
      }, 1100);
      setTimeout(function () { send.classList.add('show'); }, 1900);
      setTimeout(function () { travel(packet, -8, 18, 560); }, 2300);
      setTimeout(function () { bar.style.width = '62%'; }, 2900);
      setTimeout(function () { bar.style.width = '100%'; }, 3900);
    }

    // At rest: approved, one song sent, the other phone already playing it.
    ask.classList.add('show', 'ok');
    ask.textContent = 'approved';
    send.classList.add('show');
    bar.style.width = '62%';
    return { start: function () { run(); setInterval(run, 5200); } };
  }

  var builders = { budget: budget, folder: folder, passenger: passenger };

  document.querySelectorAll('.demo').forEach(function (figure) {
    var build = builders[figure.dataset.demo];
    if (!build) return;
    var loop = build(figure);
    if (!reduce) loop.start();
  });
})();
