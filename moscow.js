(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const quote = 'Взрослый человек — не предел нашего развития. На высшей его ступени опять стоит ребенок, но уже независимый, со свободным умом.';
  const panoramaPath = 'assets/panoramas/moscow-street-360.webp';

  const artworks = {
    workshop: {
      id: '01', title: 'Мастерская на Рубинштейна', file: 'assets/artworks/moscow/originals/work-01-original.jpg', thumb: 'assets/artworks/moscow/moscow-01-workshop.webp',
      shape: 'portrait', description: 'Фактурная работа в витрине мастерской.'
    },
    arch: {
      id: '02', title: 'Арочная ниша', file: 'assets/artworks/moscow/originals/work-02-original.jpg', thumb: 'assets/artworks/moscow/moscow-02-arch.webp',
      shape: 'portrait', description: 'Портрет, помещённый в арочную нишу старого дома.'
    },
    bookshop: {
      id: '03', title: 'Антикварная книжная лавка', file: 'assets/artworks/moscow/originals/work-03-original.jpg', thumb: 'assets/artworks/moscow/moscow-03-bookshop.webp',
      shape: 'portrait', description: 'Работа с классической сценой в витрине книжной лавки.'
    },
    typography: {
      id: '04', title: 'Типография', file: 'assets/artworks/moscow/originals/work-04-original.webp', thumb: 'assets/artworks/moscow/moscow-04-typography.webp',
      shape: 'portrait', description: 'Коллаж в оконной витрине старой типографии.'
    },
    entrance: {
      id: '05', title: 'Старый московский подъезд', file: 'assets/artworks/moscow/originals/work-05-video-poster-original.png', thumb: 'assets/artworks/moscow/moscow-05-mailboxes-poster.webp',
      video: 'assets/videos/moscow-mailboxes-art.mp4', shape: 'video',
      description: 'Видеоработа с почтовыми ящиками. Нажмите «play», чтобы посмотреть фрагмент.'
    }
  };

  const sceneOrder = ['moscowWorkshop', 'moscowArch', 'moscowBookshop', 'moscowPrintshop', 'moscowEntrance'];
  const sceneInfo = {
    moscowWorkshop: { number: '01 / 05', kicker: '01 · МАСТЕРСКАЯ НА РУБИНШТЕЙНА', title: 'Начало московской прогулки', routeTitle: 'Мастерская на Рубинштейна', routeNote: 'Первая фактурная работа в большой витрине' },
    moscowArch: { number: '02 / 05', kicker: '02 · АРОЧНАЯ НИША', title: 'Портрет в глубине старой стены', routeTitle: 'Арочная ниша', routeNote: 'Портрет в арочной нише' },
    moscowBookshop: { number: '03 / 05', kicker: '03 · АНТИКВАРНАЯ КНИЖНАЯ ЛАВКА', title: 'Классическая сцена и слова художницы', routeTitle: 'Антикварная книжная лавка', routeNote: 'Классическая сцена и цитата' },
    moscowPrintshop: { number: '04 / 05', kicker: '04 · ТИПОГРАФИЯ', title: 'Коллаж за стеклом старой типографии', routeTitle: 'Типография', routeNote: 'Оранжевый коллаж в оконной витрине' },
    moscowEntrance: { number: '05 / 05', kicker: '05 · СТАРЫЙ МОСКОВСКИЙ ПОДЪЕЗД', title: 'Видеоработа у почтовых ящиков', routeTitle: 'Старый московский подъезд', routeNote: 'Видеоработа с почтовыми ящиками' }
  };

  let viewer = null;
  let currentScene = 'moscowWorkshop';
  let entered = false;
  let artworkReturnFocus = null;

  function openArtwork(item) {
    artworkReturnFocus = document.activeElement;
    const wrap = $('modalMediaWrap');
    const image = $('modalImage');
    const video = $('modalVideo');

    video.pause();
    video.removeAttribute('src');
    video.load();
    wrap.classList.remove('is-video');

    if (item.video) {
      video.style.display = '';
      image.removeAttribute('src');
      video.src = item.video;
      video.poster = item.thumb || item.file;
      wrap.classList.add('is-video');
    } else {
      video.style.display = 'none';
      image.src = item.file;
      video.style.display = '';
    }

    $('modalTitle').textContent = item.title;
    $('modalDescription').textContent = item.description;
    $('artModal').classList.add('is-open');
    $('artModal').setAttribute('aria-hidden', 'false');
    $('closeArt').focus();
  }

  function closeArtwork() {
    $('artModal').classList.remove('is-open');
    $('artModal').setAttribute('aria-hidden', 'true');
    const video = $('modalVideo');
    video.pause();
    video.removeAttribute('src');
    video.load();
    $('modalImage').removeAttribute('src');
    $('modalMediaWrap').classList.remove('is-video');
    if (artworkReturnFocus && typeof artworkReturnFocus.focus === 'function') artworkReturnFocus.focus();
  }

  function makeArtworkHotspot(item) {
    return {
      type: 'info',
      text: `Открыть работу ${item.id}: ${item.title}`,
      cssClass: item.video ? 'video-hotspot-host' : `art-hotspot-${item.shape}`,
      createTooltipFunc: function (hotSpotDiv) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = item.video ? 'video-hotspot-frame' : 'art-hotspot-frame';
        button.setAttribute('aria-label', `Открыть ${item.title}`);
        button.title = item.video ? 'Посмотреть видеоработу' : 'Открыть оригинал';
        const image = document.createElement('img');
        image.src = item.thumb || item.file;
        image.alt = item.title;
        image.draggable = false;
        image.loading = 'lazy';
        const label = document.createElement('span');
        label.textContent = item.video ? 'ALENA RUBINSHTEIN · VIDEO' : 'ALENA RUBINSHTEIN · ORIGINAL';
        button.append(image, label);
        button.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          openArtwork(item);
        });
        hotSpotDiv.appendChild(button);
      }
    };
  }

  function makeSignHotspot(kind, main, sub) {
    return {
      type: 'info', text: main,
      cssClass: kind === 'address' ? 'address-hotspot-host' : 'sign-hotspot-host',
      createTooltipFunc: function (hotSpotDiv) {
        const sign = document.createElement('div');
        sign.className = kind === 'address' ? 'street-sign address-sign' : 'street-sign';
        const title = document.createElement('span');
        title.textContent = main;
        sign.appendChild(title);
        if (sub) {
          const small = document.createElement('small');
          small.textContent = sub;
          sign.appendChild(small);
        }
        hotSpotDiv.appendChild(sign);
      }
    };
  }

  function makeQuoteHotspot() {
    return {
      type: 'info', text: quote, cssClass: 'quote-wall-host',
      createTooltipFunc: function (hotSpotDiv) {
        const panel = document.createElement('div');
        panel.className = 'quote-board quote-board-wall';
        const label = document.createElement('span');
        label.className = 'quote-kicker';
        label.textContent = 'МЫСЛЬ ХУДОЖНИЦЫ';
        const text = document.createElement('p');
        text.textContent = quote;
        const signature = document.createElement('small');
        signature.textContent = 'ALENA RUBINSHTEIN';
        panel.append(label, text, signature);
        hotSpotDiv.appendChild(panel);
      }
    };
  }

  function makeNavHotspot(label, target, direction) {
    return {
      type: 'info', text: label, cssClass: 'nav-hotspot-host',
      createTooltipFunc: function (hotSpotDiv) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'pano-nav-hotspot';
        button.textContent = direction === 'back' ? '←' : '→';
        button.setAttribute('aria-label', label);
        button.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          goToScene(target);
        });
        hotSpotDiv.appendChild(button);
      }
    };
  }

  // This first Moscow build uses one continuous 360° street environment with five focus bookmarks.
  // Each dedicated 360° stop can replace this shared source later without changing the artwork data.
  const scenes = {
    moscowWorkshop: {
      title: sceneInfo.moscowWorkshop.title, panorama: panoramaPath, yaw: 112, pitch: 2, hfov: 80,
      hotSpots: [
        Object.assign(makeSignHotspot('address', 'УЛИЦА РУБИНШТЕЙНА, 42', 'МОСКВА'), { pitch: 17, yaw: 95 }),
        Object.assign(makeSignHotspot('plaque', 'ГАЛЕРЕЯ АЛЁНЫ РУБИНШТЕЙН', 'МАСТЕРСКАЯ · ОРИГИНАЛЬНЫЕ РАБОТЫ'), { pitch: 21, yaw: 119 }),
        Object.assign(makeArtworkHotspot(artworks.workshop), { pitch: 5, yaw: 111 }),
        Object.assign(makeQuoteHotspot(), { pitch: -15, yaw: -122 }),
        Object.assign(makeNavHotspot('Перейти к арочной нише', 'moscowArch', 'forward'), { pitch: -20, yaw: 35 })
      ]
    },
    moscowArch: {
      title: sceneInfo.moscowArch.title, panorama: panoramaPath, yaw: 78, pitch: 0, hfov: 78,
      hotSpots: [
        Object.assign(makeArtworkHotspot(artworks.arch), { pitch: 8, yaw: 78 }),
        Object.assign(makeNavHotspot('Вернуться к мастерской', 'moscowWorkshop', 'back'), { pitch: -20, yaw: -115 }),
        Object.assign(makeNavHotspot('Перейти к книжной лавке', 'moscowBookshop', 'forward'), { pitch: -20, yaw: 145 })
      ]
    },
    moscowBookshop: {
      title: sceneInfo.moscowBookshop.title, panorama: panoramaPath, yaw: 148, pitch: 0, hfov: 78,
      hotSpots: [
        Object.assign(makeArtworkHotspot(artworks.bookshop), { pitch: 8, yaw: 148 }),
        Object.assign(makeQuoteHotspot(), { pitch: -18, yaw: 115 }),
        Object.assign(makeNavHotspot('Вернуться к арочной нише', 'moscowArch', 'back'), { pitch: -20, yaw: -70 }),
        Object.assign(makeNavHotspot('Перейти к типографии', 'moscowPrintshop', 'forward'), { pitch: -20, yaw: 35 })
      ]
    },
    moscowPrintshop: {
      title: sceneInfo.moscowPrintshop.title, panorama: panoramaPath, yaw: -145, pitch: 0, hfov: 78,
      hotSpots: [
        Object.assign(makeArtworkHotspot(artworks.typography), { pitch: 7, yaw: -145 }),
        Object.assign(makeNavHotspot('Вернуться к книжной лавке', 'moscowBookshop', 'back'), { pitch: -20, yaw: 35 }),
        Object.assign(makeNavHotspot('Перейти к старому подъезду', 'moscowEntrance', 'forward'), { pitch: -20, yaw: -20 })
      ]
    },
    moscowEntrance: {
      title: sceneInfo.moscowEntrance.title, panorama: panoramaPath, yaw: 170, pitch: -1, hfov: 78,
      hotSpots: [
        Object.assign(makeArtworkHotspot(artworks.entrance), { pitch: 5, yaw: 170 }),
        Object.assign(makeNavHotspot('Вернуться к типографии', 'moscowPrintshop', 'back'), { pitch: -20, yaw: -55 })
      ]
    }
  };

  function sceneIndex(sceneId) { return sceneOrder.indexOf(sceneId); }

  function updateSceneUI(sceneId) {
    currentScene = sceneId;
    const info = sceneInfo[sceneId];
    const index = sceneIndex(sceneId);
    $('progressText').textContent = info.number;
    $('progressFill').style.width = `${((index + 1) / sceneOrder.length) * 100}%`;
    $('captionKicker').textContent = info.kicker;
    $('captionTitle').textContent = info.title;
    $('prevButton').disabled = index === 0;
    $('nextButton').disabled = index === sceneOrder.length - 1;
    document.querySelectorAll('.route-step').forEach((button) => {
      const active = button.dataset.scene === sceneId;
      button.classList.toggle('is-current', active);
      if (active) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
  }

  function closeRoutePanel() {
    $('routePanel').classList.remove('is-open');
    $('routePanel').setAttribute('aria-hidden', 'true');
  }

  function enterWalk() {
    entered = true;
    $('introCard').classList.add('is-hidden');
    $('gestureHint').classList.add('is-visible');
  }

  function goToScene(sceneId) {
    if (!viewer || !scenes[sceneId]) return;
    const target = scenes[sceneId];
    viewer.loadScene(sceneId, target.pitch, target.yaw, target.hfov || 80);
    updateSceneUI(sceneId);
    closeRoutePanel();
    if (!entered) enterWalk();
  }

  function moveScene(delta) {
    const index = sceneIndex(currentScene);
    const next = Math.max(0, Math.min(sceneOrder.length - 1, index + delta));
    if (next !== index) goToScene(sceneOrder[next]);
  }

  function setupControls() {
    $('enterButton').addEventListener('click', enterWalk);
    $('prevButton').addEventListener('click', () => moveScene(-1));
    $('nextButton').addEventListener('click', () => moveScene(1));
    $('mapButton').addEventListener('click', () => {
      $('routePanel').classList.add('is-open');
      $('routePanel').setAttribute('aria-hidden', 'false');
    });
    $('closeRoute').addEventListener('click', closeRoutePanel);
    $('routePanel').addEventListener('click', (event) => { if (event.target === $('routePanel')) closeRoutePanel(); });
    document.querySelectorAll('.route-step').forEach((button) => button.addEventListener('click', () => goToScene(button.dataset.scene)));
    $('closeArt').addEventListener('click', closeArtwork);
    $('modalBackdrop').addEventListener('click', closeArtwork);
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') { closeArtwork(); closeRoutePanel(); }
      else if (event.key === 'ArrowRight' && !event.repeat && !$('artModal').classList.contains('is-open')) moveScene(1);
      else if (event.key === 'ArrowLeft' && !event.repeat && !$('artModal').classList.contains('is-open')) moveScene(-1);
    });
  }

  function showLoadError(message) {
    const loading = $('loadingScreen');
    loading.textContent = '';
    const mark = document.createElement('div'); mark.className = 'loading-mark'; mark.textContent = 'AR';
    const title = document.createElement('div'); title.className = 'loading-title'; title.textContent = 'THE STREET IS QUIET FOR A MOMENT';
    const subtitle = document.createElement('div'); subtitle.className = 'loading-subtitle'; subtitle.textContent = message;
    const retry = document.createElement('button'); retry.className = 'primary-button'; retry.textContent = 'Попробовать ещё раз';
    retry.addEventListener('click', () => window.location.reload());
    loading.append(mark, title, subtitle, retry);
  }

  function init() {
    setupControls();
    if (!window.pannellum) {
      showLoadError('Не удалось загрузить панорамный просмотрщик. Проверьте подключение к интернету.');
      return;
    }
    try {
      const pannellumScenes = {};
      sceneOrder.forEach((id) => {
        const scene = scenes[id];
        pannellumScenes[id] = {
          type: 'equirectangular', panorama: scene.panorama, autoLoad: true,
          pitch: scene.pitch, yaw: scene.yaw, hfov: scene.hfov || 80,
          minHfov: 55, maxHfov: 98, hotSpots: scene.hotSpots
        };
      });
      viewer = window.pannellum.viewer('panorama', {
        default: {
          firstScene: 'moscowWorkshop', sceneFadeDuration: 750, autoLoad: true,
          showControls: false, showFullscreenCtrl: false, showZoomCtrl: false,
          mouseZoom: false, keyboardZoom: false, draggable: true,
          compass: false, hfov: 80, minHfov: 55, maxHfov: 98,
          friction: 0.14, orientationOnByDefault: false, hotSpotDebug: false
        },
        scenes: pannellumScenes
      });
      viewer.on('load', function () {
        $('loadingScreen').classList.add('is-hidden');
        updateSceneUI(currentScene);
      });
      viewer.on('scenechange', updateSceneUI);
      viewer.on('error', function () { showLoadError('Не удалось загрузить панорамный вид.'); });
    } catch (error) {
      console.error(error);
      showLoadError('Не удалось запустить панорамную прогулку.');
    }
  }

  window.addEventListener('DOMContentLoaded', init);
})();
