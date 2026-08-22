<script>
  export let code;
  let copied = false;
  let timer;

  async function copy() {
    await navigator.clipboard.writeText(code);
    copied = true;
    clearTimeout(timer);
    timer = setTimeout(() => copied = false, 1600);
  }
</script>

<div class="code-block">
  <pre><code>{code}</code></pre>
  <button type="button" on:click={copy} aria-label={copied ? 'Copied' : 'Copy command'} title={copied ? 'Copied' : 'Copy'}>
    {#if copied}
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>
    {:else}
      <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></svg>
    {/if}
    <span>{copied ? 'Copied' : 'Copy'}</span>
  </button>
</div>
