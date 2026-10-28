// CART 470 — consolidated JavaScript. Source sections retained for readability.

// ==================== islandData.js ====================
// Temporary technical test data: approximate marker positions, not island boundaries.
// Small-island coordinates: Natural Resources Canada place-name records EHZKE / EHLDH.
const testIslands = [
  {
    id: 'montreal',
    name: 'Île de Montréal',
    coordinates: [-73.65, 45.52],
    labelPosition: 'left',
    labelOffset: [-4, -10],
    designGroup: 'inner',
    verificationNote: 'Existing approximate test marker position; preserved unchanged.'
  },
  {
    id: 'sainte-helene',
    name: 'Île Sainte-Hélène',
    coordinates: [-73.534202, 45.513666],
    labelPosition: 'above',
    labelOffset: [4, -8],
    designGroup: 'inner',
    sourceUrl: 'https://geonames.nrcan.gc.ca/search-place-names/unique?id=EHZKE',
    verificationNote: 'CGNDB EHZKE reference point; existing coordinates preserved.'
  },
  {
    id: 'notre-dame',
    name: 'Île Notre-Dame',
    coordinates: [-73.527388, 45.508233],
    labelPosition: 'below-left',
    labelOffset: [-4, 0],
    designGroup: 'inner',
    sourceUrl: 'https://geonames.nrcan.gc.ca/search-place-names/unique?id=EHLDH',
    verificationNote: 'CGNDB EHLDH reference point; existing coordinates preserved.'
  },
  {
    id: 'perrot', name: 'Île Perrot',
    coordinates: [-73.943416, 45.372402],
    labelPosition: 'below', designGroup: 'outer',
    sourceUrl: 'https://geonames.nrcan.gc.ca/search-place-names/unique?id=EHPKS',
    verificationNote: 'Approved CGNDB EHPKS island reference point, not the municipality.'
  },
  {
    id: 'bizard', name: 'Île Bizard',
    coordinates: [-73.89851, 45.49404],
    labelPosition: 'left', designGroup: 'outer',
    sourceUrl: 'https://toponymie.gouv.qc.ca/ct/ToposWeb/Fiche.aspx?no_seq=5905',
    verificationNote: 'Approved Québec record 5905 island reference point, not the borough.'
  },
  {
    id: 'jesus', name: 'Île Jésus',
    coordinates: [-73.7233333, 45.6105556],
    labelPosition: 'above', designGroup: 'outer',
    sourceUrl: 'https://geonames.nrcan.gc.ca/search-place-names/unique?id=EGTTB',
    verificationNote: 'Approved CGNDB EGTTB island reference point in Laval.'
  },
  {
    id: 'sainte-therese', name: 'Île Sainte-Thérèse',
    coordinates: [-73.4702778, 45.6816667],
    labelPosition: 'above', designGroup: 'outer',
    sourceUrl: 'https://geonames.nrcan.gc.ca/search-place-names/unique?id=EHZQU',
    verificationNote: 'Approved Varennes island, not the Saint-Jean-sur-Richelieu namesake.'
  },
  {
    id: 'saint-laurent', name: 'Île Saint-Laurent',
    coordinates: [-73.44916, 45.72224],
    labelPosition: 'above', designGroup: 'outer',
    sourceUrl: 'https://toponymie.gouv.qc.ca/ct/ToposWeb/Fiche.aspx?no_seq=57037',
    verificationNote: 'Approved Québec record 57037: the Repentigny island.'
  },
  {
    id: 'charron', name: 'Île Charron',
    coordinates: [-73.48306, 45.58361],
    labelPosition: 'above', designGroup: 'outer',
    sourceUrl: 'https://toponymie.gouv.qc.ca/ct/ToposWeb/Fiche.aspx?no_seq=12559',
    verificationNote: 'Approved Longueuil island reference point, not the weather station.'
  },
  {
    id: 'visitation', name: 'Île de la Visitation',
    coordinates: [-73.6611111, 45.5794444],
    labelPosition: 'left', designGroup: 'inner',
    labelOffset: [-4, 0],
    sourceUrl: 'https://geonames.nrcan.gc.ca/search-place-names/unique?id=EILVA',
    verificationNote: 'Approved CGNDB EILVA island reference point in Montréal.'
  },
  {
    id: 'soeurs',
    name: 'Île des Sœurs',
    coordinates: [-73.54723, 45.46075],
    labelPosition: 'bottom',
    designGroup: 'inner',
    sourceUrl: 'https://toponymie.gouv.qc.ca/ct/ToposWeb/Fiche.aspx?no_seq=60147',
    verificationNote: 'Approved C5.5-F island; coordinates verified against Québec record 60147.'
  },
  {
    id: 'dorval',
    name: 'Île Dorval',
    coordinates: [-73.74168, 45.43221],
    labelPosition: 'bottom',
    labelOffset: [-8, -8],
    designGroup: 'outer',
    verificationNote: 'Approved C5.5-F bridge island; coordinates supplied for C5.5-E.'
  }
];

// ==================== mapStyle.js ====================
const COLORS = {
  background: '#F8F7F0',
  water: '#8FADCC',
  vegetation: '#DCE5E9',
  residential: '#F2F0E7',
  roads: '#A9BACB'
};

const ROAD_OPACITY = [
  'interpolate', ['linear'], ['zoom'],
  9, 0.08,
  11, 0.18,
  13, 0.35,
  15, 0.50
];

const ROAD_LINE_LAYERS = [
  'tunnel_motorway_casing',
  'tunnel_motorway_inner',
  'highway_path',
  'highway_minor',
  'highway_major_casing',
  'highway_major_inner',
  'highway_major_subtle',
  'highway_motorway_casing',
  'highway_motorway_inner',
  'highway_motorway_subtle',
  'highway_motorway_bridge_casing',
  'highway_motorway_bridge_inner'
];

const HIDDEN_LAYERS = [
  'building',
  'highway_path',
  'highway_minor',
  'highway-name-path',
  'highway-name-minor',
  'highway-name-major',
  'highway-shield-non-us',
  'highway-shield-us-interstate',
  'road_shield_us',
  'airport',
  'label_other',
  'label_village',
  // Verified Positron settlement labels (source-layer: place).
  'label_town',
  'label_city',
  'label_city_capital',
  'waterway_line_label',
  'water_name_point_label',
  'water_name_line_label'
];

function applyMuseumMapStyle(map) {
  const paintChanges = [
    ['background', 'background', { 'background-color': COLORS.background }],
    ['water', 'fill', { 'fill-color': COLORS.water }],
    ['park', 'fill', { 'fill-color': COLORS.vegetation }],
    ['landcover_wood', 'fill', { 'fill-color': COLORS.vegetation }],
    ['landuse_residential', 'fill', { 'fill-color': COLORS.residential }],
    ['highway_major_inner', 'line', { 'line-color': COLORS.roads }],
    ['highway_motorway_inner', 'line', { 'line-color': COLORS.roads }]
  ];

  for (const [id, type, properties] of paintChanges) {
    const layer = map.getLayer(id);
    if (!layer || layer.type !== type) continue;

    for (const [property, value] of Object.entries(properties)) {
      map.setPaintProperty(id, property, value);
    }
  }

  for (const id of HIDDEN_LAYERS) {
    if (map.getLayer(id)) {
      map.setLayoutProperty(id, 'visibility', 'none');
    }
  }

  for (const id of ROAD_LINE_LAYERS) {
    const layer = map.getLayer(id);
    if (layer?.type === 'line' && map.getLayoutProperty(id, 'visibility') !== 'none') {
      map.setPaintProperty(id, 'line-opacity', ROAD_OPACITY);
    }
  }
}

// ==================== islandMarkers.js ====================
const visibilityStates = new WeakMap();

function getVisibilityState(map) {
  if (!visibilityStates.has(map)) {
    visibilityStates.set(map, { visibleIds: null, buttons: new Map(), fades: new Map() });
  }
  return visibilityStates.get(map);
}

// null shows all markers; an array shows only those island IDs.
// Also works before marker creation, so hidden markers never flash on screen.
function setIslandMarkerVisibility(map, islandIds = null, { fadeDurationMs = 0 } = {}) {
  const state = getVisibilityState(map);
  state.visibleIds = islandIds === null ? null : new Set(islandIds);
  for (const [id, button] of state.buttons) {
    const hidden = state.visibleIds !== null && !state.visibleIds.has(id);
    const wasHidden = button.hidden;
    if (hidden || fadeDurationMs === 0) {
      const fade = state.fades.get(id);
      if (fade) {
        fade.onfinish = null;
        fade.cancel();
        state.fades.delete(id);
      }
    }
    button.hidden = hidden;
    if (wasHidden && !hidden && fadeDurationMs > 0 &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Animate the whole button so its label shares the same opacity.
      const fade = button.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: fadeDurationMs,
        easing: 'linear'
      });
      state.fades.set(id, fade);
      fade.onfinish = () => {
        if (state.fades.get(id) === fade) state.fades.delete(id);
      };
    }
  }
}

function createIslandMarkers(map, Marker, islands, onSelect = () => { }) {
  const buttons = [];
  const visibility = getVisibilityState(map);
  const selectIsland = (island, selectedButton = null) => {
    for (const button of buttons) {
      button.setAttribute('aria-pressed', String(button === selectedButton));
    }
    onSelect(island);
  };

  map.on('click', (event) => {
    if (event.originalEvent?.target?.closest('.island-marker')) return;
    selectIsland(null);
  });

  return islands.map((island) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'island-marker';
    button.dataset.labelPosition = island.labelPosition;
    button.setAttribute('aria-label', `Select ${island.name} (test island)`);
    button.setAttribute('aria-pressed', 'false');
    button.hidden = visibility.visibleIds !== null && !visibility.visibleIds.has(island.id);
    visibility.buttons.set(island.id, button);

    const label = document.createElement('span');
    label.className = 'island-marker__label';
    label.textContent = island.name;
    const [offsetX, offsetY] = island.labelOffset ?? [0, 0];
    label.style.setProperty('--island-label-offset-x', `${offsetX}px`);
    label.style.setProperty('--island-label-offset-y', `${offsetY}px`);
    button.append(label);
    buttons.push(button);

    button.addEventListener('click', (event) => {
      event.stopPropagation();
      selectIsland(island, button);
      console.log('Selected island:', island.name);
    });

    return new Marker({ element: button, anchor: 'center' })
      .setLngLat(island.coordinates)
      .addTo(map);
  });
}

// ==================== map.js ====================
async function initializeMap(container, errorMessage, initialCamera = {}, visibleIslandIds = null, extraIslands = []) {
  let highlightFailed = false;
  const showError = () => {
    errorMessage.textContent = 'The map could not load. Check your connection and reload.';
    errorMessage.hidden = false;
  };

  try {
    const { Map, AttributionControl, Marker } = await import(
      'https://unpkg.com/maplibre-gl@6.14.0/dist/maplibre-gl.mjs'
    );
    const map = new Map({
      container,
      style: 'https://tiles.openfreemap.org/styles/positron',
      center: [-73.5673, 45.5017],
      zoom: 10,
      ...initialCamera,
      interactive: true,
      attributionControl: false
    });

    setIslandMarkerVisibility(map, visibleIslandIds);
    map.addControl(new AttributionControl({ compact: false }), 'bottom-right');
    map.on('error', showError);
    map.once('style.load', () => {
      applyMuseumMapStyle(map);
      let selectedIsland = null;
      let selectHighlight = () => { };
      createIslandMarkers(map, Marker, [...testIslands, ...extraIslands], (island) => {
        selectedIsland = island;
        selectHighlight(island);
      });
    });
    map.on('load', () => {
      if (highlightFailed) return;
      errorMessage.textContent = '';
      errorMessage.hidden = true;
    });
    return map;
  } catch {
    showError();
    return null;
  }
}

// ==================== connectionLines.js ====================
const controllers = new WeakMap();
const SOURCE_ID = 'intro-connections';
const LAYER_ID = 'intro-connection-lines';

function buildPropagationSchedule(edges, config) {
  const adjacency = new Map();
  edges.forEach(({ pair: [from, to] }, index) => {
    for (const [node, neighbor] of [[from, to], [to, from]]) {
      if (!adjacency.has(node)) adjacency.set(node, []);
      adjacency.get(node).push({ neighbor, index });
    }
  });
  const depths = new Map([[config.rootId, 0]]);
  const queue = [config.rootId];
  const tree = new Map();
  for (let i = 0; i < queue.length; i += 1) {
    const node = queue[i];
    for (const { neighbor, index } of adjacency.get(node) ?? []) {
      if (depths.has(neighbor)) continue;
      const depth = depths.get(node);
      depths.set(neighbor, depth + 1);
      queue.push(neighbor);
      tree.set(index, { index, depth, reverse: edges[index].pair[0] !== node });
    }
  }

  const schedule = new Map();
  function addWave(entries, startMs, durationMs) {
    const stagger = Math.min(config.staggerMs, durationMs / Math.max(1, entries.length * 2));
    entries.forEach((entry, index) => schedule.set(entry.index, {
      ...entry,
      startMs: startMs + index * stagger,
      durationMs: durationMs - Math.max(0, entries.length - 1) * stagger
    }));
  }

  const branches = [...tree.values()];
  addWave(branches.filter((edge) => edge.depth === 0), 0, config.startMs);
  const maxDepth = Math.max(0, ...branches.map((edge) => edge.depth));
  for (let depth = 1; depth <= maxDepth; depth += 1) {
    const waveMs = config.spreadMs / maxDepth;
    addWave(branches.filter((edge) => edge.depth === depth),
      config.startMs + (depth - 1) * waveMs, waveMs);
  }
  // Cycle-closing edges finish the network after the outward branches arrive.
  addWave(edges.flatMap((edge, index) => tree.has(index) ? [] : [{ index, reverse: false }]),
    config.startMs + config.spreadMs, config.connectMs);
  return {
    edges: schedule,
    totalMs: config.startMs + config.spreadMs + config.connectMs + config.settleMs
  };
}

function createConnectionLines(map, config) {
  if (controllers.has(map)) return controllers.get(map);
  const coordinates = new Map([...testIslands, ...(config.extraIslands ?? [])]
    .map((island) => [island.id, island.coordinates]));
  // Conceptual test connections only; these do not represent geographic boundaries.
  const edges = config.groups
    ? Object.entries(config.groups).flatMap(([group, pairs]) => pairs.map((pair) => ({ pair, group })))
    : config.pairs.map((pair) => ({ pair }));
  const segments = edges.map(({ pair: [from, to], group }) => {
    if (!coordinates.has(from) || !coordinates.has(to)) {
      throw new Error(`Unknown island ID in connection: ${from} -> ${to}`);
    }
    return { start: coordinates.get(from), end: coordinates.get(to), group };
  });
  const timeline = config.propagation ? buildPropagationSchedule(edges, config.propagation) : null;
  let data = { type: 'FeatureCollection', features: [] };
  let timer;
  let frame;
  let generation = 0;
  let disposed = false;
  let styleReady = map.isStyleLoaded();

  const groupPaint = (property) => [
    'match', ['get', 'group'],
    ...Object.entries(config.styles).flatMap(([group, style]) => [group, style[property]]),
    config.styles.cross[property]
  ];

  function render() {
    if (disposed || !styleReady) return;
    if (!map.getSource(SOURCE_ID)) map.addSource(SOURCE_ID, { type: 'geojson', data });
    else map.getSource(SOURCE_ID).setData(data);
    if (!map.getLayer(LAYER_ID)) {
      map.addLayer({
        id: LAYER_ID,
        type: 'line',
        source: SOURCE_ID,
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': config.groups ? groupPaint('color') : config.color,
          'line-width': config.groups ? groupPaint('width') : config.width,
          ...(config.groups ? {
            'line-opacity': groupPaint('opacity')
          } : {})
        }
      });
    }
  }

  function update(progress, schedule = null) {
    data = {
      type: 'FeatureCollection',
      features: segments.flatMap((segment, index) => {
        const timing = schedule?.get(index);
        const { group } = segment;
        const [start, end] = timing?.reverse
          ? [segment.end, segment.start] : [segment.start, segment.end];
        const amount = Math.min(1, Math.max(0, timing
          ? (progress - timing.startMs) / timing.durationMs : progress - index));
        if (amount === 0) return [];
        return [{
          type: 'Feature',
          properties: group ? { group } : {},
          geometry: {
            type: 'LineString',
            coordinates: [start, amount === 1 ? end : start.map((value, axis) => value + (end[axis] - value) * amount)]
          }
        }];
      })
    };
    render();
  }

  function cancel() {
    generation += 1;
    clearTimeout(timer);
    cancelAnimationFrame(frame);
  }

  function showFinal() {
    cancel();
    update(segments.length);
  }

  function play(onComplete) {
    cancel();
    const currentGeneration = generation;
    update(0);
    timer = setTimeout(() => {
      let startTime;
      function tick(time) {
        if (disposed || generation !== currentGeneration) return;
        startTime ??= time;
        const elapsed = time - startTime;
        const progress = timeline ? elapsed
          : config.durationMs > 0 ? elapsed / config.durationMs : segments.length;
        update(progress, timeline?.edges);
        if (timeline ? elapsed >= timeline.totalMs : progress >= segments.length) onComplete();
        else frame = requestAnimationFrame(tick);
      }
      if (!disposed && generation === currentGeneration) frame = requestAnimationFrame(tick);
    }, config.delayMs ?? 0);
  }

  function dispose() {
    disposed = true;
    cancel();
    map.off('style.load', onStyleLoad);
    map.off('remove', dispose);
  }

  // Also supports Skip before the style is ready: render the latest final data on load.
  function onStyleLoad() {
    styleReady = true;
    render();
  }
  map.on('style.load', onStyleLoad);
  map.once('remove', dispose);
  const controller = { play, showFinal, dispose };
  controllers.set(map, controller);
  return controller;
}

// ==================== introConfig.js ====================
// Presentation subset only; keep all geographic source data and camera-fit inputs intact.
const introIslandIds = testIslands
  .filter((island) => island.id !== 'notre-dame')
  .map((island) => island.id);

// Shared conceptual network; preview remains static.
const networkPreviewConfig = {
  label: 'Conceptual visual prototype — connections are not verified geographic relationships or the archipelago boundary.',
  groups: {
    outer: [
      ['perrot', 'bizard'],
      ['bizard', 'jesus'],
      ['jesus', 'sainte-therese'],
      ['sainte-therese', 'saint-laurent'],
      ['saint-laurent', 'charron'],
      ['perrot', 'dorval'],
      ['dorval', 'soeurs']
    ],
    inner: [
      ['montreal', 'visitation'],
      ['montreal', 'sainte-helene'],
      ['visitation', 'sainte-helene'],
      ['montreal', 'soeurs'],
      ['soeurs', 'sainte-helene']
    ],
    cross: [
      ['bizard', 'visitation'],
      ['jesus', 'visitation'],
      ['charron', 'sainte-helene'],
      ['bizard', 'montreal']
    ]
  },
  styles: {
    outer: { color: '#285E68', width: 3.5, opacity: 0.90 },
    inner: { color: '#C27851', width: 2.5, opacity: 0.85 },
    cross: { color: '#829994', width: 1.8, opacity: 0.65 }
  }
};

const introConfig = {
  startCamera: {
    center: [...testIslands.find((island) => island.id === 'montreal').coordinates],
    zoom: 12
  },
  // Balance the left-side island label and circular marker around screen center.
  startCameraOffset: [56, 0],
  endCamera: { center: [-73.5673, 45.5017], zoom: 9 },
  finalCameraFit: {
    // Pixel allowance for circular markers, right-side labels, and attribution.
    padding: { top: 52, bottom: 64, left: 32, right: 190 },
    maxZoom: 11,
    targetHeightFraction: 0.65,
    labelEdgePadding: 16,
    minContentSize: 64
  },
  delayMs: 1000,
  durationMs: 5000,
  markerFadeMs: 500,
  markerReveals: [
    { id: 'sainte-helene', zoom: 11 }
  ],
  overlay: {
    // Set the agreed destination URL here when the next experience is ready.
    destination: null
  },
  connections: {
    groups: networkPreviewConfig.groups,
    styles: networkPreviewConfig.styles,
    propagation: {
      rootId: 'montreal',
      startMs: 750,
      spreadMs: 1900,
      connectMs: 1000,
      // Keep the completed network clear before C4 starts its backdrop/text sequence.
      settleMs: 1100,
      staggerMs: 60
    }
  }
};

// ==================== introOverlay.js ====================
const overlays = new WeakMap();

function createIntroOverlay(element, config) {
  if (overlays.has(element)) return overlays.get(element);
  const exploreButton = element.querySelector('.intro-overlay__explore');
  const message = element.querySelector('.intro-overlay__message');
  let shown = false;

  element.addEventListener('click', (event) => event.stopPropagation());
  exploreButton.addEventListener('click', () => {
    if (config.destination) {
      window.location.assign(config.destination);
    } else {
      message.textContent = '';
    }
  });

  const controller = {
    show() {
      if (shown) return;
      shown = true;
      element.hidden = false;
      exploreButton.focus({ preventScroll: true });
    }
  };
  overlays.set(element, controller);
  return controller;
}

// ==================== introController.js ====================
const intros = new WeakMap();
const previews = new WeakSet();

function startNetworkPreview(map, config, networkConfig) {
  if (previews.has(map)) return;
  previews.add(map);
  setIslandMarkerVisibility(map, introIslandIds);
  const lines = createConnectionLines(map, networkConfig);
  let isReady = false;
  const refit = () => {
    if (isReady) map.jumpTo(calculateFinalIntroCamera(map, config));
  };
  const ready = () => {
    isReady = true;
    refit();
    lines.showFinal();
  };
  if (map.isStyleLoaded()) ready();
  else map.once('style.load', ready);
  map.on('resize', refit);
  map.once('remove', () => {
    map.off('style.load', ready);
    map.off('resize', refit);
  });
}

function measureMarkerExtents(map) {
  const extents = new Map();
  for (const marker of map.getContainer().querySelectorAll('.island-marker')) {
    const name = marker.querySelector('.island-marker__label').textContent;
    const island = testIslands.find((entry) => entry.name === name);
    if (!island) continue;
    // Measure even unrevealed markers without making them visible or selectable.
    const clone = marker.cloneNode(true);
    clone.hidden = false;
    Object.assign(clone.style, {
      position: 'fixed', left: '-10000px', top: '0',
      visibility: 'hidden', transform: 'none', animation: 'none', pointerEvents: 'none'
    });
    document.body.append(clone);
    const circle = clone.getBoundingClientRect();
    const label = clone.querySelector('.island-marker__label').getBoundingClientRect();
    const x = circle.left + circle.width / 2;
    const y = circle.top + circle.height / 2;
    extents.set(island.id, {
      left: Math.min(circle.left, label.left) - x,
      right: Math.max(circle.right, label.right) - x,
      top: Math.min(circle.top, label.top) - y,
      bottom: Math.max(circle.bottom, label.bottom) - y
    });
    clone.remove();
  }
  return extents;
}

function mercatorPoint([longitude, latitude]) {
  return {
    x: (longitude + 180) / 360,
    y: 0.5 - Math.log(Math.tan(Math.PI / 4 + latitude * Math.PI / 360)) / (2 * Math.PI)
  };
}

function calculateFinalIntroCamera(map, config) {
  const longitudes = testIslands.map((island) => island.coordinates[0]);
  const latitudes = testIslands.map((island) => island.coordinates[1]);
  const bounds = [
    [Math.min(...longitudes), Math.min(...latitudes)],
    [Math.max(...longitudes), Math.max(...latitudes)]
  ];
  const { padding, maxZoom, minContentSize, targetHeightFraction, labelEdgePadding } = config.finalCameraFit;
  const container = map.getContainer();
  const width = container.clientWidth;
  const height = container.clientHeight;
  if (width <= 0 || height <= 0) return config.endCamera;
  const extents = measureMarkerExtents(map);
  const points = testIslands.map((island) => ({
    ...mercatorPoint(island.coordinates),
    extent: extents.get(island.id) ?? {
      left: -padding.left, right: padding.right,
      top: -padding.top, bottom: padding.bottom
    }
  }));
  const minX = Math.min(...points.map((point) => point.x));
  const maxX = Math.max(...points.map((point) => point.x));
  const minY = Math.min(...points.map((point) => point.y));
  const maxY = Math.max(...points.map((point) => point.y));
  // Find the largest scale that meets the height target and fits every label pair.
  let scale = Math.min(height * targetHeightFraction / (maxY - minY), 512 * 2 ** maxZoom);
  const availableWidth = Math.max(minContentSize, width - 2 * labelEdgePadding);
  const availableHeight = Math.max(minContentSize, height - 2 * labelEdgePadding);
  for (const right of points) {
    for (const left of points) {
      if (right.x > left.x) {
        scale = Math.min(scale,
          (availableWidth - right.extent.right + left.extent.left) / (right.x - left.x));
      }
      if (right.y > left.y) {
        scale = Math.min(scale,
          (availableHeight - right.extent.bottom + left.extent.top) / (right.y - left.y));
      }
    }
  }
  scale = Math.max(1, scale);
  const contentCenterX = (Math.min(...points.map((point) => point.x * scale + point.extent.left)) +
    Math.max(...points.map((point) => point.x * scale + point.extent.right))) / 2;
  const contentCenterY = (Math.min(...points.map((point) => point.y * scale + point.extent.top)) +
    Math.max(...points.map((point) => point.y * scale + point.extent.bottom))) / 2;
  // Convert the measured content envelope back into padding for MapLibre's bounds fit.
  const horizontalSpace = width - (maxX - minX) * scale;
  const verticalSpace = height - (maxY - minY) * scale;
  const left = horizontalSpace / 2 + (minX + maxX) * scale / 2 - contentCenterX;
  const top = verticalSpace / 2 + (minY + maxY) * scale / 2 - contentCenterY;
  const camera = map.cameraForBounds(bounds, {
    padding: {
      left: Math.max(0, left), right: Math.max(0, horizontalSpace - left),
      top: Math.max(0, top), bottom: Math.max(0, verticalSpace - top)
    },
    maxZoom,
    bearing: 0
  });
  // Retain the previous destination only if MapLibre cannot fit (e.g. zero size).
  return camera ? { center: camera.center, zoom: camera.zoom, bearing: camera.bearing } : config.endCamera;
}

function startIntro(map, skipButton, config) {
  if (intros.has(map)) return intros.get(map);

  let state = 'waiting';
  let timer;
  let cameraEndTime;
  const revealedIds = new Set(['montreal']);
  const connectionLines = createConnectionLines(map, config.connections);
  const overlay = createIntroOverlay(document.querySelector('#intro-overlay'), config.overlay);
  const container = map.getContainer();
  let finalCamera;
  let finalCameraSize;
  const getFinalCamera = () => {
    const size = `${container.clientWidth}x${container.clientHeight}`;
    if (!finalCamera || size !== finalCameraSize) {
      finalCamera = calculateFinalIntroCamera(map, config);
      finalCameraSize = size;
    }
    return finalCamera;
  };
  const wasInert = container.inert;
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const handlers = [
    'boxZoom', 'doubleClickZoom', 'dragPan', 'dragRotate',
    'keyboard', 'scrollZoom', 'touchZoomRotate', 'touchPitch'
  ].map((name) => map[name]).filter(Boolean);
  const enabledHandlers = handlers.filter((handler) => handler.isEnabled());

  const restore = () => {
    container.inert = wasInert;
    for (const handler of enabledHandlers) handler.enable();
    if (document.activeElement === skipButton) map.getCanvas().focus();
    skipButton.hidden = true;
    skipButton.removeEventListener('click', complete);
    motionPreference.removeEventListener('change', onMotionChange);
    map.off('load', ready);
    map.off('moveend', cameraComplete);
    map.off('zoom', revealMarkers);
  };

  function complete() {
    if (state === 'completed' || state === 'disposed') return;
    state = 'completed';
    clearTimeout(timer);
    map.off('moveend', cameraComplete);
    map.stop();
    map.jumpTo(getFinalCamera());
    setIslandMarkerVisibility(map, introIslandIds);
    connectionLines.showFinal();
    restore();
    overlay.show();
  }

  function cameraComplete() {
    if (state !== 'animating') return;
    state = 'connections';
    map.off('zoom', revealMarkers);
    setIslandMarkerVisibility(map, introIslandIds);
    connectionLines.play(complete);
  }

  function dispose() {
    state = 'disposed';
    clearTimeout(timer);
    connectionLines.dispose();
    setIslandMarkerVisibility(map, introIslandIds);
    restore();
    map.off('resize', refit);
    map.off('style.load', refitAfterStyle);
    map.off('remove', dispose);
  }

  function refit() {
    finalCamera = undefined;
    if (state === 'animating') {
      const remainingMs = Math.max(0, cameraEndTime - performance.now());
      map.off('moveend', cameraComplete);
      map.stop();
      map.once('moveend', cameraComplete);
      map.easeTo({ ...getFinalCamera(), duration: remainingMs });
    } else if (state === 'connections' || state === 'completed') {
      map.jumpTo(getFinalCamera());
    }
  }

  function refitAfterStyle() {
    if (state === 'completed') refit();
  }

  function onMotionChange(event) {
    if (event.matches) complete();
  }

  function revealMarkers() {
    if (state !== 'animating') return;
    let changed = false;
    const bounds = map.getBounds();
    for (const island of testIslands) {
      if (!introIslandIds.includes(island.id)) continue;
      const reveal = config.markerReveals?.find((entry) => entry.id === island.id);
      const thresholdReached = !reveal || map.getZoom() <= reveal.zoom;
      if (!revealedIds.has(island.id) && thresholdReached && bounds.contains(island.coordinates)) {
        revealedIds.add(island.id);
        changed = true;
      }
    }
    if (changed) {
      setIslandMarkerVisibility(map, [...revealedIds], { fadeDurationMs: config.markerFadeMs });
    }
  }

  function ready() {
    if (state !== 'waiting') return;
    if (motionPreference.matches) {
      complete();
      return;
    }
    state = 'delaying';
    timer = setTimeout(() => {
      timer = undefined;
      if (state !== 'delaying') return;
      state = 'animating';
      map.on('zoom', revealMarkers);
      revealMarkers();
      map.once('moveend', cameraComplete);
      cameraEndTime = performance.now() + config.durationMs;
      map.easeTo({ ...getFinalCamera(), duration: config.durationMs });
    }, config.delayMs);
  }

  const controller = { skip: complete, get state() { return state; } };
  intros.set(map, controller);
  for (const handler of enabledHandlers) handler.disable();
  // Inert also blocks keyboard activation of markers added while tiles load.
  container.inert = true;
  skipButton.hidden = false;
  skipButton.addEventListener('click', complete);
  motionPreference.addEventListener('change', onMotionChange);
  map.once('remove', dispose);
  map.on('resize', refit);
  map.once('style.load', refitAfterStyle);
  map.easeTo({ ...config.startCamera, offset: config.startCameraOffset, duration: 0 });
  if (map.loaded()) ready();
  else map.once('load', ready);
  return controller;
}

// ==================== main.js ====================
const statusToggle = document.querySelector('#status-toggle');
const statusMessage = document.querySelector('#javascript-status');

statusToggle.addEventListener('click', () => {
  const isVisible = statusToggle.getAttribute('aria-pressed') === 'true';
  statusToggle.setAttribute('aria-pressed', String(!isVisible));
  statusMessage.textContent = isVisible ? '' : 'JavaScript is working.';
});



const networkPreview = new URLSearchParams(window.location.search).get('networkPreview') === '1';
if (networkPreview) document.querySelector('.prototype-header p').textContent = networkPreviewConfig.label;

const map = await initializeMap(
  document.querySelector('#map'),
  document.querySelector('#map-error'),
  introConfig.startCamera,
  networkPreview ? introIslandIds : ['montreal']
);
if (map) {
  if (networkPreview) startNetworkPreview(map, introConfig, networkPreviewConfig);
  else startIntro(map, document.querySelector('#skip-intro'), introConfig);
}
