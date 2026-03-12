# Release Process

## Voraussetzungen

- npm-Account mit Zugriff auf `@featurama/react-native`
- GitHub Repository Secret `NPM_TOKEN` muss gesetzt sein (Settings > Secrets > Actions)

## Release erstellen

1. Sicherstellen, dass alle Änderungen auf `main` gemergt sind
2. Tag erstellen und pushen:

```bash
git tag v0.6.0
git push origin v0.6.0
```

Die GitHub Action (`.github/workflows/publish.yml`) übernimmt den Rest:

- Installiert Dependencies (`npm ci`)
- Baut das Paket (`npm run prepare` → `bob build`)
- Setzt die Version aus dem Tag (`v0.6.0` → `0.6.0`)
- Published `@featurama/react-native` zu npm

## Wie es funktioniert

- **Trigger**: Nur Tags mit `v`-Prefix (`v*`) starten den Workflow
- **Version-Sync**: Die Version wird automatisch aus dem Git-Tag extrahiert — kein manuelles Update von `package.json` nötig
- **Auth**: `NPM_TOKEN` Secret wird als `NODE_AUTH_TOKEN` an npm übergeben

## NPM_TOKEN Secret anlegen

1. npm Token generieren: https://www.npmjs.com/settings → Access Tokens → Generate New Token (Automation)
2. In GitHub eintragen: Repository > Settings > Secrets and variables > Actions > New repository secret
   - Name: `NPM_TOKEN`
   - Value: der generierte Token
