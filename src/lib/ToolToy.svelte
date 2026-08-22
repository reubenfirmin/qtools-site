<script>
  export let onOpen;
  let active = 'pq';

  const tools = {
    pq: {
      name: 'process query',
      prompt: '$ pq --cpu',
      question: 'What is consuming this machine right now?',
      rows: [['chrome', '28%', '5.9G'], ['postgres', '11%', '1.7G'], ['code', '7%', '982M']]
    },
    dq: {
      name: 'disk query',
      prompt: '$ dq ~/Projects',
      question: 'Where did the disk space actually go?',
      rows: [['build', '48%', '9.8G'], ['cache', '29%', '5.8G'], ['source', '17%', '3.4G']]
    }
  };
</script>

<section class="tool-toy" aria-label="Explore pq and dq">
  <div class="tool-switch" role="tablist" aria-label="qtools commands">
    <button type="button" role="tab" aria-selected={active === 'pq'} on:click={() => active = 'pq'}><b>pq</b><span>process query</span></button>
    <button type="button" role="tab" aria-selected={active === 'dq'} on:click={() => active = 'dq'}><b>dq</b><span>disk query</span></button>
  </div>
  <div class="toy-screen">
    <div class="toy-copy">
      <code>{tools[active].prompt}</code>
      <h2>{tools[active].question}</h2>
      <a href="/screenshots/" on:click={onOpen}>Open the real reports →</a>
    </div>
    <div class="toy-report" class:pq={active === 'pq'} class:dq={active === 'dq'} aria-hidden="true">
      <div class="toy-chart"><i></i><i></i><i></i></div>
      <div class="toy-rows">
        {#each tools[active].rows as row}
          <div><span></span><b>{row[0]}</b><em>{row[1]}</em><small>{row[2]}</small></div>
        {/each}
      </div>
    </div>
  </div>
</section>
