import { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';

export function ManifestBasePlugin(): Plugin {
  return {
    name: 'vite-plugin-manifest-base',
    apply: 'build',
    closeBundle: () => {
      const manifestPath = path.resolve(__dirname, 'public/manifest.json'); // 根据你的 manifest.json 路径修改
      if (fs.existsSync(manifestPath)) {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
        // 使用 VITE_BASE 或者从 vite.config.ts 获取 base
        const base = process.env.BASE_URL || '/';

        // 替换 start_url 和 scope
        manifest.start_url = base;
        manifest.scope = base;

        fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
        console.log(`[ManifestBasePlugin] Updated start_url and scope to "${base}"`);
      }
    }
  };
}