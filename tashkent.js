(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const panoramaPath = 'assets/panoramas/tashkent-mahalla-360.webp';
  const finalQuote = 'Послушай, Сова, — спросил я, — а как же тогда ты пишешь название первого дня недели?\n— «Пернедельник», разумеется.\n— Сова, ты заблуждаешься, — сказал я. — Сейчас как раз первый день недели, но он не называется «пернедельником».\n— А как же, в таком случае?\n— Он называется «Сегодня»! — пискнул Пятачок.\n— Мой любимый день, — сказал Пух.';

  const artworks = {
    garden: {
      id: '01', title: 'Работа 01 · Птица и красный лист',
      file: 'assets/artworks/tashkent/originals/tashkent-01-source.jpg',
      thumb: 'assets/artworks/tashkent/tashkent-01.webp',
      description: 'Овальная композиция с лицом, птицей и красным листом. Оригинал художницы.'
    },
    mosaic: {
      id: '02', title: 'Работа 02 · Фигура в мозаике',
      file: 'assets/artworks/tashkent/originals/tashkent-02-source.jpg',
      thumb: 'assets/artworks/tashkent/tashkent-02.webp',
      description: 'Яркая фигура в сложном мозаичном переплетении. Оригинал художницы.'
    },
    tree: {
      id: '03', title: 'Работа 03 · Дерево и корни',
      file: 'assets/artworks/tashkent/originals/tashkent-03-source.jpg',
      thumb: 'assets/artworks/tashkent/tashkent-03.webp',
      description: 'Древо, корни, птицы и маленькая фигура у основания. Оригинал художницы.'
    },
    doubles: {
      id: '04', title: 'Работа 04 · Двойники',
      file: 'assets/artworks/tashkent/originals/tashkent-04-source.jpg',
      thumb: 'assets/artworks/tashkent/tashkent-04.webp',
      description: 'Две зеркальные фигуры в красных плащах на синем фоне. Оригинал художницы.'
    },
    stars: {
      id: '05', title: 'Работа 05 · Солнце, луна и звёзды',
      file: 'assets/artworks/tashkent/originals/tashkent-05-source.jpg',
      thumb: 'assets/artworks/tashkent/tashkent-05.webp',
      description: 'Ночная композиция с небесными фигурами, глазом-солнцем и луной. Оригинал художницы.'
    }
  };

  const sceneOrder = ['tashkentGardenGate', 'tashkentMosaic', 'tashkentTree', 'tashkentStory', 'tashkentToday'];
  const sceneInfo = {
    tashkentGardenGate: { number: '01 / 05', kicker: '01 · ДВОР С РЕЗНЫМ ВХОДОМ', title: 'Птица, красный лист и тихий сад' },
    tashkentMosaic: { number: '02 / 05', kicker: '02 · АЙВАН И МОЗАИКА', title: 'Фигура внутри цветного узора' },
    tashkentTree: { number: '03 / 05', kicker: '03 · САД У СТАРОГО ДЕРЕВА', title: 'Корни, память и продолжение жизни' },
    tashkentStory: { number: '04 / 05', kicker: '04 · МАСТЕРСКАЯ ИСТОРИЙ', title: 'Два героя в красных плащах' },
    tashkentToday: { number: '05 / 05', kicker: '05 · ЗВЁЗДНЫЙ САД · СЕГОДНЯ', title: 'Мой любимый день' }
  };

  let viewer = null;
  let currentScene = 'tashkentGardenGate';
  let entered = false;
  let artworkReturnFocus = null;

  function openArtwork(item) {
    artworkReturnFocus = document.activeElement;
    const image = $('modalImage');
    image.src = item.file;
    image.alt = item.title;
    $('modalTitle').textContent = item.title;
    $('modalDescription').textContent = item.description;
    $('artModal').classList.add('is-open');
    $('artModal').setAttribute('aria-hidden', 'false');
    $('closeArt').focus();
  }

  function closeArtwork() {
    $('artModal').classList.remove('is-open');
    $('artModal').setAttribute('aria-hidden', 'true');
    $('modalImage').removeAttribute('src');
    if (artworkReturnFocus && typeof artworkReturnFocus.focus === 'function') artworkReturnFocus.focus();
  }

  function makeArtworkHotspot(item) {
    return {
      type: 'info', text: `Открыть оригинал: ${item.title}`, cssClass: 'tashkent-art-host',
      createTooltipFunc: function (hotSpotDiv) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'tashkent-art-hotspot';
        button.setAttribute('aria-label', `Открыть ${item.title}`);
        button.title = 'Открыть оригинальную работу';
        const image = document.createElement('img');
        image.src = item.thumb;
        image.alt = item.title;
        image.draggable = false;
        image.loading = 'lazy';
        button.appendChild(image);
        button.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          openArtwork(item);
        });
        hotSpotDiv.appendChild(button);
      }
    };
  }

  function makeAddressHotspot() {
    return {
      type: 'info', text: 'RUBINSHTEYN KO‘CHASI, 42', cssClass: 'tashkent-address-host',
      createTooltipFunc: function (hotSpotDiv) {
        const sign = document.createElement('div');
        sign.className = 'tashkent-street-sign';
        const title = document.createElement('span');
        title.textContent = 'RUBINSHTEYN KO‘CHASI, 42';
        const small = document.createElement('small');
        small.textContent = 'ТАШКЕНТ · ХУДОЖЕСТВЕННЫЙ АДРЕС';
        sign.append(title, small);
        hotSpotDiv.appendChild(sign);
      }
    };
  }

  function makeQuoteHotspot() {
    return {
      type: 'info', text: finalQuote, cssClass: 'tashkent-quote-host',
      createTooltipFunc: function (hotSpotDiv) {
        const board = document.createElement('div');
        board.className = 'tashkent-quote-board';
        const kicker = document.createElement('span');
        kicker.className = 'quote-kicker';
        kicker.textContent = 'ФИНАЛЬНАЯ ЦИТАТА · «СЕГОДНЯ»';
        const text = document.createElement('p');
        text.textContent = finalQuote;
        const signature = document.createElement('small');
        signature.textContent = 'ALENA RUBINSHTEIN · THE LAST STOP';
        board.append(kicker, text, signature);
        hotSpotDiv.appendChild(board);
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

  // Пять остановок ведут по разным сторонам одного общего 360°-двора махалли.
  // Все пять оригиналов остаются в панорамном пространстве доступными для нажатия.
  const artworkHotspots = () => [
    Object.assign(makeArtworkHotspot(artworks.garden), { pitch: 14, yaw: 96 }),
    Object.assign(makeArtworkHotspot(artworks.mosaic), { pitch: 14, yaw: 42 }),
    Object.assign(makeArtworkHotspot(artworks.tree), { pitch: 14, yaw: -63 }),
    Object.assign(makeArtworkHotspot(artworks.doubles), { pitch: 13, yaw: -132 }),
    Object.assign(makeArtworkHotspot(artworks.stars), { pitch: 15, yaw: 158 })
  ];

  const scenes = {
    tashkentGardenGate: {
      title: sceneInfo.tashkentGardenGate.title, panorama: panoramaPath, yaw: 96, pitch: 2, hfov: 78,
      hotSpots: [Object.assign(makeAddressHotspot(), { pitch: 28, yaw: 80 }), ...artworkHotspots()]
    },
    tashkentMosaic: {
      title: sceneInfo.tashkentMosaic.title, panorama: panoramaPath, yaw: 42, pitch: 1, hfov: 78,
      hotSpots: artworkHotspots()
    },
    tashkentTree: {
      title: sceneInfo.tashkentTree.title, panorama: panoramaPath, yaw: -63, pitch: 0, hfov: 78,
      hotSpots: artworkHotspots()
    },
    tashkentStory: {
      title: sceneInfo.tashkentStory.title, panorama: panoramaPath, yaw: -132, pitch: 0, hfov: 78,
      hotSpots: artworkHotspots()
    },
    tashkentToday: {
      title: sceneInfo.tashkentToday.title, panorama: panoramaPath, yaw: 158, pitch: 1, hfov: 78,
      hotSpots: [
        ...artworkHotspots(),
        Object.assign(makeQuoteHotspot(), { pitch: -4, yaw: 120 })
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
    const title = document.createElement('div'); title.className = 'loading-title'; title.textContent = 'СЕГОДНЯ — ХОРОШИЙ ДЕНЬ ДЛЯ ПРОГУЛКИ';
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
          pitch: scene.pitch, yaw: scene.yaw, hfov: scene.hfov || 78,
          minHfov: 52, maxHfov: 98, hotSpots: scene.hotSpots
        };
      });
      viewer = window.pannellum.viewer('panorama', {
        default: {
          firstScene: 'tashkentGardenGate', sceneFadeDuration: 750, autoLoad: true,
          showControls: false, showFullscreenCtrl: false, showZoomCtrl: false,
          mouseZoom: false, keyboardZoom: false, draggable: true,
          compass: false, hfov: 78, minHfov: 52, maxHfov: 98,
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
