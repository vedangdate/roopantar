import { createScene } from './scene';
import { setupUI } from './ui';

const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
if (!canvas) throw new Error('renderCanvas not found');

const bundle = createScene(canvas);
setupUI(bundle);

// Expose for debugging.
(window as any).__roopantar = bundle;
