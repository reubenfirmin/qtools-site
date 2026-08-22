<script>
  import { onMount } from 'svelte';
  import CodeBlock from './lib/CodeBlock.svelte';
  import Gallery from './lib/Gallery.svelte';
  import ToolToy from './lib/ToolToy.svelte';

  let route = window.location.pathname.startsWith('/screenshots') ? 'screenshots' : 'home';
  let architecture = 'x86_64';
  $: appImage = architecture === 'x86_64' ? 'Qtools-x86_64.AppImage' : 'Qtools-aarch64.AppImage';
  $: installCode = `curl -fLO https://repo.qtools.sh/${appImage}\nchmod +x ${appImage}\n./${appImage} --install\npq --help\ndq --help`;

  function navigate(event, next) {
    event.preventDefault();
    route = next;
    const path = next === 'screenshots' ? '/screenshots/' : '/';
    history.pushState({}, '', path);
    window.scrollTo(0, 0);
  }

  onMount(() => {
    const popstate = () => route = window.location.pathname.startsWith('/screenshots') ? 'screenshots' : 'home';
    window.addEventListener('popstate', popstate);
    return () => window.removeEventListener('popstate', popstate);
  });
</script>

<svelte:head>
  <title>{route === 'screenshots' ? 'qtools screenshots' : "qtools — query what's using your machine"}</title>
</svelte:head>

<main class:gallery-page={route === 'screenshots'}>
  <header class="site-header">
    <a class="brand" href="/" on:click={(event) => navigate(event, 'home')}><img src="/favicon.svg" alt="">qtools</a>
    <nav class="tabs" aria-label="Site">
      <a href="/" on:click={(event) => navigate(event, 'home')} aria-current={route === 'home' ? 'page' : undefined}>Home</a>
      <a href="/screenshots/" on:click={(event) => navigate(event, 'screenshots')} aria-current={route === 'screenshots' ? 'page' : undefined}>Screenshots</a>
    </nav>
  </header>

  {#if route === 'home'}
    <section class="hero">
      <h1>Query what's using your machine.</h1>
      <p class="lede"><code>pq</code> explains processes, ports, and open resources. <code>dq</code> explains disk usage. Fast, visual, and built for Linux terminals.</p>
      <ToolToy onOpen={(event) => navigate(event, 'screenshots')} />
    </section>

    <section class="install-section">
      <div class="section-heading">
        <h2>Download and install</h2>
        <div class="architecture-switch" role="group" aria-label="CPU architecture">
          <button type="button" class:active={architecture === 'x86_64'} on:click={() => architecture = 'x86_64'}>x86-64</button>
          <button type="button" class:active={architecture === 'aarch64'} on:click={() => architecture = 'aarch64'}>ARM64</button>
        </div>
      </div>
      <CodeBlock code={installCode} />
      <p class="small">Downloads the AppImage, then installs <code>pq</code>, <code>dq</code>, and <code>qtools</code> to <code>~/.local/bin</code>. No root access required. <a href="https://github.com/reubenfirmin/qtools">View source</a>.</p>
    </section>
    <section><h2>Update</h2><CodeBlock code="qtools update" /><p class="small">Uses the AppImage zsync channel to download only the changed parts.</p></section>
    <section><h2>Verify provenance</h2><CodeBlock code={`gh attestation verify ${appImage} \\\n  --repo reubenfirmin/qtools`} /><p class="small">Confirms that GitHub Actions built this exact file from the qtools repository.</p></section>
    <footer><a href="https://repo.qtools.sh/SHA256SUMS">Checksums</a><a href="https://github.com/reubenfirmin/qtools/attestations">Build provenance</a><a href="https://reuben.firm.in">reuben.firm.in</a></footer>
  {:else}
    <h1>See what is using the machine.</h1>
    <Gallery />
  {/if}
</main>
