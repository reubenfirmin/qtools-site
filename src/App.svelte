<script>
  import { onMount } from 'svelte';
  import CodeBlock from './lib/CodeBlock.svelte';
  import Gallery from './lib/Gallery.svelte';
  import ToolToy from './lib/ToolToy.svelte';

  let route = window.location.pathname.startsWith('/screenshots') ? 'screenshots' : 'home';

  function navigate(event, next) {
    event.preventDefault();
    route = next;
    const path = next === 'screenshots' ? '/screenshots' : '/';
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
      <a href="/screenshots" on:click={(event) => navigate(event, 'screenshots')} aria-current={route === 'screenshots' ? 'page' : undefined}>Screenshots</a>
    </nav>
  </header>

  {#if route === 'home'}
    <section class="hero">
      <p class="eyebrow">Linux, explained from the terminal</p>
      <h1>Query what's using your machine.</h1>
      <p class="lede"><code>pq</code> explains processes, ports, and open resources. <code>dq</code> explains disk usage. Fast, visual, and built for Linux terminals.</p>
      <ToolToy onOpen={(event) => navigate(event, 'screenshots')} />
      <div class="downloads">
        <a class="primary" href="https://repo.qtools.sh/Qtools-x86_64.AppImage">Download for x86-64</a>
        <a href="https://repo.qtools.sh/Qtools-aarch64.AppImage">ARM64</a>
        <a href="https://github.com/reubenfirmin/qtools">Source</a>
      </div>
    </section>

    <section><h2>Install for your user</h2><CodeBlock code={'chmod +x Qtools-x86_64.AppImage\n./Qtools-x86_64.AppImage --install\npq --help\ndq --help'} /><p class="small">Installs to <code>~/.local/bin</code>. No root access required.</p></section>
    <section><h2>Update</h2><CodeBlock code="qtools update" /><p class="small">Uses the AppImage zsync channel to download only the changed parts.</p></section>
    <section><h2>Verify provenance</h2><CodeBlock code={'gh attestation verify Qtools-x86_64.AppImage \\\n  --repo reubenfirmin/qtools'} /><p class="small">Confirms that GitHub Actions built this exact file from the qtools repository.</p></section>
    <footer><a href="https://repo.qtools.sh/SHA256SUMS">Checksums</a><a href="https://github.com/reubenfirmin/qtools/attestations">Build provenance</a></footer>
  {:else}
    <h1>See what is using the machine.</h1>
    <Gallery />
  {/if}
</main>
