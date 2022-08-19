import {ModdleElement} from '../types/bpmn.types';
import {Point, Rectangle} from './types';

const ORIENTATION_THRESHOLD: {[key: string]: number} = {
  'h:h': 20,
  'v:v': 20,
  'h:v': -10,
  'v:h': -10,
};

const TWO = 2;

const ALIGNED_THRESHOLD = TWO;

export function is(
  type: string | ModdleElement,
  expected: string | ModdleElement,
) {
  return type === expected;
}

export function connectRectangles(
  source: Rectangle,
  target: Rectangle,
): Point[] | undefined {
  const preferredLayout = 'h:h';

  const threshold = ORIENTATION_THRESHOLD[preferredLayout] || 0;

  const orientation = getOrientation(source, target, threshold);

  const directions = getDirections(orientation, preferredLayout);
  let start = getMid(source);
  let end = getMid(target);

  // overlapping elements
  if (!directions) {
    return;
  }

  if (directions === 'h:h') {
    if (['top-right', 'right', 'bottom-right'].includes(orientation)) {
      start = {original: start, x: source.x, y: start.y};
      end = {original: end, x: target.x + target.width, y: end.y};
    } else if (['top-left', 'left', 'bottom-left'].includes(orientation)) {
      start = {original: start, x: source.x + source.width, y: start.y};
      end = {original: end, x: target.x, y: end.y};
    } else {
      // do nothing
    }
  }

  if (directions === 'v:v') {
    if (['top-left', 'top', 'top-right'].includes(orientation)) {
      start = {original: start, x: start['x'], y: source.y + source.height};
      end = {original: end, x: end['x'], y: target.y};
    } else if (['bottom-left', 'bottom', 'bottom-right']) {
      start = {original: start, x: start['x'], y: source.y};
      end = {original: end, x: end['x'], y: target.y + target.height};
    } else {
      // do nothing
    }
  }

  return connectPoints(start, end, directions);
}

export function connectPoints(a: Point, b: Point, directions: string) {
  let points: Point[] = [];

  if (!pointsAligned(a, b)) {
    points = getBendpoints(a, b, directions);
  }

  points.unshift(a);
  points.push(b);

  return points;
}

export function getBendpoints(a: Point, b: Point, directions: string) {
  directions = directions || 'h:h';

  let xmid, ymid;

  // one point, next to a
  if (directions === 'h:v') {
    return [{x: b.x, y: a.y}];
  }
  // one point, above a
  else if (directions === 'v:h') {
    return [{x: a.x, y: b.y}];
  }
  // vertical edge xmid
  else if (directions === 'h:h') {
    xmid = Math.round((b.x - a.x) / TWO + a.x);

    return [
      {x: xmid, y: a.y},
      {x: xmid, y: b.y},
    ];
  }
  // horizontal edge ymid
  else if (directions === 'v:v') {
    ymid = Math.round((b.y - a.y) / TWO + a.y);

    return [
      {x: a.x, y: ymid},
      {x: b.x, y: ymid},
    ];
  } else {
    throw new Error(
      `unknown directions: <${directions}>: directions must be specified as {a direction}:{b direction} (direction in h|v)`,
    );
  }
}

export function getMid(bounds: Rectangle): Point {
  return roundPoint({
    x: bounds.x + (bounds.width || 0) / TWO,
    y: bounds.y + (bounds.height || 0) / TWO,
  });
}

export function pointsAligned(a: Point, b: Point) {
  if (Math.abs(a.x - b.x) <= ALIGNED_THRESHOLD) {
    return 'h';
  }

  if (Math.abs(a.y - b.y) <= ALIGNED_THRESHOLD) {
    return 'v';
  }

  return false;
}

export function getDirections(orientation: string, defaultLayout: string) {
  switch (orientation) {
    case 'intersect':
      return null;

    case 'top':
    case 'bottom':
      return 'v:v';

    case 'left':
    case 'right':
      return 'h:h';

    default:
      return defaultLayout;
  }
}

export function roundPoint(point: Point) {
  return {
    x: Math.round(point.x),
    y: Math.round(point.y),
  };
}

export function getOrientation(
  rect: Rectangle,
  reference: Rectangle,
  padding: number,
) {
  const rectOrientation = asTRBL(rect),
    referenceOrientation = asTRBL(reference);

  const top = rectOrientation.bottom + padding <= referenceOrientation.top,
    right = rectOrientation.left - padding >= referenceOrientation.right,
    bottom = rectOrientation.top - padding >= referenceOrientation.bottom,
    left = rectOrientation.right + padding <= referenceOrientation.left;

  let vertical;
  if (top) {
    vertical = 'top';
  } else if (bottom) {
    vertical = 'bottom';
  } else {
    vertical = null;
  }
  let horizontal;
  if (left) {
    horizontal = 'left';
  } else if (right) {
    horizontal = 'right';
  } else {
    horizontal = null;
  }

  if (horizontal && vertical) {
    return `${vertical}-${horizontal}`;
  } else {
    return horizontal || vertical || 'intersect';
  }
}

export function asTRBL(bounds: Rectangle) {
  return {
    top: bounds.y,
    right: bounds.x + (bounds.width || 0),
    bottom: bounds.y + (bounds.height || 0),
    left: bounds.x,
  };
}

export function getStartEvent(flowElements: ModdleElement[]) {
  return flowElements.filter(function (e) {
    return e.$type === 'bpmn:StartEvent';
  })[0];
}

export function getOutgoingConnection(
  source: ModdleElement,
  flowElements: ModdleElement[],
) {
  return flowElements.filter(function (e) {
    return (
      e.$type === 'bpmn:SequenceFlow' && e.get('sourceRef').id === source.id
    );
  });
}
