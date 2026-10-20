/* Mr. Bribri — interações do site. Sem dependências. */
(function () {
  'use strict';

  var WHATSAPP = '5511999207281'; // número no formato internacional, só dígitos

  // Menu no celular
  var botao = document.querySelector('.menu-botao');
  var menu = document.getElementById('menu');
  if (botao && menu) {
    botao.addEventListener('click', function () {
      var aberto = menu.getAttribute('data-aberto') === 'true';
      menu.setAttribute('data-aberto', aberto ? 'false' : 'true');
      botao.setAttribute('aria-expanded', aberto ? 'false' : 'true');
      botao.setAttribute('aria-label', aberto ? 'Abrir menu' : 'Fechar menu');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.setAttribute('data-aberto', 'false');
        botao.setAttribute('aria-expanded', 'false');
        botao.setAttribute('aria-label', 'Abrir menu');
      });
    });
  }

  // Seção atual no menu
  var links = Array.prototype.slice.call(document.querySelectorAll('.menu a[href^="#"]'));
  var secoes = links.map(function (a) { return document.querySelector(a.getAttribute('href')); }).filter(Boolean);
  if ('IntersectionObserver' in window && secoes.length) {
    var atual = null;
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) {
          atual = e.target.id;
          links.forEach(function (a) {
            var ativo = a.getAttribute('href') === '#' + atual;
            if (ativo) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    secoes.forEach(function (s) { obs.observe(s); });
  }

  // Formulário → mensagem pronta no WhatsApp (funciona em qualquer hospedagem estática)
  var form = document.getElementById('form-contato');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var v = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
      if (!v('nome')) { document.getElementById('nome').focus(); return; }
      var linhas = [
        'Olá! Vim pelo site da Mr. Bribri.',
        'Nome: ' + v('nome'),
        v('empresa') ? 'Empresa/evento: ' + v('empresa') : '',
        v('telefone') ? 'Telefone: ' + v('telefone') : '',
        'Interesse: ' + v('interesse'),
        v('mensagem') ? 'Mensagem: ' + v('mensagem') : ''
      ].filter(Boolean);
      var url = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(linhas.join('\n'));
      window.open(url, '_blank', 'noopener');
    });
  }

  // Ano do rodapé
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = String(new Date().getFullYear());
})();
