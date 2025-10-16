# Deploy ke GitHub Pages untuk APK Generation

## Langkah-langkah:

### 1. Upload ke GitHub
1. Buat repository baru di GitHub
2. Upload semua file ke repository
3. Push ke GitHub

### 2. Enable GitHub Pages
1. Go to repository Settings
2. Scroll ke "Pages" section
3. Source: Deploy from a branch
4. Branch: main
5. Folder: / (root)

### 3. Setup GitHub Actions
Buat file `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist/spa
```

### 4. Generate APK
Setelah deploy, gunakan URL GitHub Pages di PWA Builder:
`https://username.github.io/repository-name`

## Alternatif Cepat - Surge.sh
```bash
npm install -g surge
cd dist/spa
surge
```

## Alternatif Cepat - Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

