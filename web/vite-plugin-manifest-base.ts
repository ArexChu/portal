import { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';

export function ManifestBasePlugin(base: string): Plugin {
  return {
    name: 'vite-plugin-manifest-base',
    apply: 'build',
    closeBundle() {
      const distManifest = path.resolve(__dirname, 'dist/manifest.json');
      if (!fs.existsSync(distManifest)) {
        console.warn(`[ManifestBasePlugin] dist/manifest.json not found`);
        return;
      }

      const manifest = JSON.parse(fs.readFileSync(distManifest, 'utf-8'));

      // 修改 start_url 和 scope
      manifest.start_url = base;
      manifest.scope = base;

      // 修改 icons 路径，确保加上 base 前缀
      if (manifest.icons && Array.isArray(manifest.icons)) {
        manifest.icons = manifest.icons.map((icon: any) => {
          let src = icon.src;
          // 去掉开头 /
          src = src.replace(/^\/+/, '');
          // 加上 base 前缀
          icon.src = base + src;
          return icon;
        });
      }

      fs.writeFileSync(distManifest, JSON.stringify(manifest, null, 2), 'utf-8');
      console.log(`[ManifestBasePlugin] manifest.json updated with base "${base}"`);
    },
  };
}
