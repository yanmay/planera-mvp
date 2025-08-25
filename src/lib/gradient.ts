/*
  Lightweight animated gradient for the hero canvas.
  Uses CSS custom properties for colors so theme can control palette.
*/

export class Gradient {
  private ctx: CanvasRenderingContext2D | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private animationFrameId: number | null = null;
  private startTime = 0;

  initGradient(selector: string): void {
    const canvas = document.querySelector<HTMLCanvasElement>(selector);
    if (!canvas) return;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    if (!this.ctx) return;

    const resize = () => {
      if (!this.canvas) return;
      const parent = this.canvas.parentElement;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = parent ? parent.clientWidth : window.innerWidth;
      const height = parent ? parent.clientHeight : window.innerHeight;
      this.canvas.width = Math.floor(width * dpr);
      this.canvas.height = Math.floor(height * dpr);
      this.canvas.style.width = `${width}px`;
      this.canvas.style.height = `${height}px`;
      if (this.ctx) this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const getColor = (name: string, fallback: string) => {
      const styles = getComputedStyle(document.documentElement);
      const val = styles.getPropertyValue(name).trim();
      return val || fallback;
    };

    const color1 = getColor("--gradient-color-1", "#0f172a");
    const color2 = getColor("--gradient-color-2", "#1e293b");
    const color3 = getColor("--gradient-color-3", "#312e81");
    const color4 = getColor("--gradient-color-4", "#1e1b4b");

    const animate = (t: number) => {
      if (!this.ctx || !this.canvas) return;
      if (!this.startTime) this.startTime = t;
      const time = (t - this.startTime) / 1000;

      const { width, height } = this.canvas;
      this.ctx.clearRect(0, 0, width, height);

      // Orb 1
      const x1 = width * (0.5 + 0.25 * Math.cos(time * 0.3));
      const y1 = height * (0.5 + 0.25 * Math.sin(time * 0.4));
      const g1 = this.ctx.createRadialGradient(x1, y1, 0, x1, y1, Math.max(width, height) * 0.6);
      g1.addColorStop(0, color3 + "cc");
      g1.addColorStop(1, color1 + "00");
      this.ctx.fillStyle = g1;
      this.ctx.fillRect(0, 0, width, height);

      // Orb 2
      const x2 = width * (0.5 + 0.3 * Math.cos(time * 0.5 + Math.PI / 3));
      const y2 = height * (0.5 + 0.3 * Math.sin(time * 0.6 + Math.PI / 4));
      const g2 = this.ctx.createRadialGradient(x2, y2, 0, x2, y2, Math.max(width, height) * 0.6);
      g2.addColorStop(0, color4 + "cc");
      g2.addColorStop(1, color2 + "00");
      this.ctx.fillStyle = g2;
      this.ctx.fillRect(0, 0, width, height);

      this.animationFrameId = requestAnimationFrame(animate);
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  destroy(): void {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = null;
    this.ctx = null;
    this.canvas = null;
  }
}

export const initGradient = (selector: string): void => {
  const g = new Gradient();
  g.initGradient(selector);
};


