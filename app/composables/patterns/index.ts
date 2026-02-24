import type { PatternFn } from './utils'
import { ripple } from './ripple'
import { waves } from './waves'
import { plasma } from './plasma'
import { topography } from './topography'
import { rings } from './rings'
import { tunnel } from './tunnel'
import { moire } from './moire'
import { flowfield } from './flowfield'
import { spiral } from './spiral'
import { diamonds } from './diamonds'
import { checker } from './checker'
import { interference } from './interference'
import { crosshatch } from './crosshatch'
import { caustics } from './caustics'
import { fabric } from './fabric'
import { pulse } from './pulse'
import { zigzag } from './zigzag'
import { hex } from './hex'
import { starfield } from './starfield'
import { warp } from './warp'
import { vortex } from './vortex'
import { lattice } from './lattice'
import { terrain } from './terrain'

export type { PatternFn } from './utils'
export { renderPattern, randomizeSeed } from './utils'

export const patterns: Record<string, PatternFn> = {
  ripple,
  waves,
  plasma,
  topography,
  rings,
  tunnel,
  moire,
  flowfield,
  spiral,
  diamonds,
  checker,
  interference,
  crosshatch,
  caustics,
  fabric,
  pulse,
  zigzag,
  hex,
  starfield,
  warp,
  vortex,
  lattice,
  terrain,
}

export const patternNames = Object.keys(patterns)
