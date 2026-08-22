# qtools.sh

The Svelte site for [qtools](https://github.com/reubenfirmin/qtools).

```sh
npm install
npm run dev
```

`npm run check` validates the components and `npm run build` writes the static site to `dist/`.
Pushes to `main` run both checks and deploy `dist/` to the `qtools-site` Cloudflare Pages project.
The custom domains are `qtools.sh` and `www.qtools.sh`.

Release binaries are served separately by the `qtools-repo` Pages project at `repo.qtools.sh`; see
the main project's `packaging/RELEASE.md`.

No Cloudflare credentials belong in this repository. Release provenance is generated keylessly by
the main repository's GitHub Actions workflow.
