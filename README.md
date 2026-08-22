# qtools.sh

Minimal static site for [qtools](https://github.com/reubenfirmin/qtools). There is no build step and no
runtime configuration.

Connect this repository to a Cloudflare Pages project with the production branch set to `main`, no
build command, and the output directory set to `/`. Attach `qtools.sh` and `www.qtools.sh` to that
project. Release binaries are served separately by the `qtools-repo` Pages project at
`repo.qtools.sh`; see the main project's `packaging/RELEASE.md`.

No Cloudflare credentials belong in this repository. Release provenance is generated keylessly by
the main repository's GitHub Actions workflow.
