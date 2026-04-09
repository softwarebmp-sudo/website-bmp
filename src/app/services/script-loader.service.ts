
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScriptLoaderService {
  private loadedScripts: Set<string> = new Set();

  constructor() {}

  /**
   * Carga un script de manera dinámica
   * @param src: La URL del script
   * @param attr: Atributos adicionales para el script
   * @returns Promesa que se resuelve cuando el script se carga
   */
  loadScript(src: string, attr: any = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.loadedScripts.has(src)) {
        return resolve();  // Si ya está cargado, no lo cargamos de nuevo
      }

      const script = document.createElement('script');
      script.src = src;

      // Añadir atributos adicionales
      for (const key in attr) {
        script.setAttribute(key, attr[key]);
      }

      script.onload = () => {
        this.loadedScripts.add(src);
        resolve();
      };

      script.onerror = (err) => {
        console.error(`Error al cargar el script: ${src}`, err);
        reject(err);
      };

      document.body.appendChild(script);
    });
  }

  /**
   * Carga múltiples scripts
   * @param scripts: Lista de objetos con `src` y `attr`
   * @returns Promesa que se resuelve cuando todos los scripts se cargan
   */
  loadAll(scripts: { src: string; attr: any }[]): Promise<void[]> {
    const promises = scripts.map((script) =>
      this.loadScript(script.src, script.attr)
    );
    return Promise.all(promises);
  }
}
