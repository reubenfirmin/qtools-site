<script>
  import { onMount } from 'svelte';
  import CodeBlock from './lib/CodeBlock.svelte';
  import Gallery from './lib/Gallery.svelte';
  import ToolToy from './lib/ToolToy.svelte';
  import Rtfm from './lib/Rtfm.svelte';

  const routeFromPath = () => window.location.pathname.startsWith('/screenshots') ? 'screenshots' : window.location.pathname.startsWith('/rtfm') ? 'rtfm' : 'home';
  let route = routeFromPath();
  let architecture = 'x86_64';
  $: appImage = architecture === 'x86_64' ? 'Qtools-x86_64.AppImage' : 'Qtools-aarch64.AppImage';
  $: installCode = `curl -fLO https://repo.qtools.sh/${appImage}\nchmod +x ${appImage}\n./${appImage} --install\npq --help\ndq --help`;

  function navigate(event, next) {
    event.preventDefault();
    route = next;
    const path = next === 'screenshots' ? '/screenshots/' : next === 'rtfm' ? '/rtfm/' : '/';
    history.pushState({}, '', path);
    window.scrollTo(0, 0);
  }

  onMount(() => {
    const popstate = () => route = routeFromPath();
    window.addEventListener('popstate', popstate);
    return () => window.removeEventListener('popstate', popstate);
  });
</script>

<svelte:head>
  <title>{route === 'screenshots' ? 'qtools screenshots' : route === 'rtfm' ? 'qtools command reference' : "qtools — query what's using your machine"}</title>
</svelte:head>

<main>
  <header class="site-header">
    <a class="brand" href="/" on:click={(event) => navigate(event, 'home')}><img src="/favicon.svg" alt="">qtools</a>
    <nav class="tabs" aria-label="Site">
      <a href="/" on:click={(event) => navigate(event, 'home')} aria-current={route === 'home' ? 'page' : undefined}>Home</a>
      <a href="/screenshots/" on:click={(event) => navigate(event, 'screenshots')} aria-current={route === 'screenshots' ? 'page' : undefined}>Screenshots</a>
      <a href="/rtfm/" on:click={(event) => navigate(event, 'rtfm')} aria-current={route === 'rtfm' ? 'page' : undefined}>RTFM</a>
    </nav>
  </header>

  {#if route === 'home'}
    <section class="home-intro">
      <div class="intro-copy">
        <p class="product-label">qtools for Linux</p>
        <h1>See what’s using your machine.</h1>
        <p><code>pq</code> inspects processes, ports, files, and sockets. <code>dq</code> accounts for disk usage.</p>
      </div>
      <ToolToy />
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
      <p class="small">Installs <code>pq</code>, <code>dq</code>, and <code>qtools</code> to <code>~/.local/bin</code>. No root access required.</p>
    </section>
    <section class="utility-section"><h2>Update</h2><CodeBlock code="qtools update" /><p class="small">Downloads only changed parts through zsync.</p></section>
    <section><h2>Verify provenance</h2><CodeBlock code={`gh attestation verify ${appImage} \\\n  --repo reubenfirmin/qtools`} /><p class="small">Confirms that GitHub Actions built this exact file from the qtools repository.</p></section>
    <footer><a href="https://github.com/reubenfirmin/qtools">Source</a><a href="https://repo.qtools.sh/SHA256SUMS">Checksums</a><a href="https://github.com/reubenfirmin/qtools/attestations">Attestations</a><a href="https://reuben.firm.in">reuben.firm.in</a></footer>
  {:else if route === 'screenshots'}
    <Gallery />
  {:else}
    <Rtfm />
  {/if}
</main>
