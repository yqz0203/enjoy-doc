var preRoute = '';
function handleHashChange() {
  var hash = window.location.hash;
  var route = hash.slice(1).split('#')[0];
  $('#route-' + preRoute).removeClass('active');
  preRoute = route;
  $('#route-' + route).addClass('active');

  NProgress.start();
  $.ajax({
    url: '/doc?' + $.param({ route: route }),
  }).then(function (data) {
    $('html,body').scrollTop(0);
    var md = data;
    var $docArea = $('#doc-area');
    var $doc = $(markdownit({ html: true }).render(md));

    $doc.find('img').each(function () {
      var $this = $(this);
      var src = $this.attr('src');
      if (src && /^http/gi.test(src)) {
        return;
      }
      $this.prop('src', '/imgproxy?src=' + encodeURIComponent($this.attr('src')) + '&route=' + route);
    });

    $docArea.empty().append($doc);
    Prism.highlightAllUnder($docArea[0]);
    closeNav();
  }).catch(function (error) {
    alert('获取文档失败，code:' + error.status);
  }).always(function () {
    NProgress.done();
  });
}

window.onhashchange = handleHashChange;
handleHashChange();

var socket = io('http://localhost:' + window.__PORT__);
socket.on('reconnect', function () {
  window.location.reload();
});


$('#hamberger').on('click', function () {
  var $this = $(this);
  if (!$this.hasClass('open')) {
    openNav();
  } else {
    closeNav();
  }
})

function openNav() {
  $('#hamberger').addClass('open')
  $('#site-nav').addClass('open');
}

function closeNav() {
  $('#hamberger').removeClass('open')
  $('#site-nav').removeClass('open');
}