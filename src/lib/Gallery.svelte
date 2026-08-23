<script>
  import { tick } from 'svelte';

  const screenshotVersion = import.meta.env.VITE_SCREENSHOT_VERSION;

  const slides = [
    { image: 'pq-overview.png', command: 'pq -n 10', caption: 'see CPU and memory by process group', title: 'What is busy?', notes: ['Each row is a process group, not a pile of individual PIDs.', 'The same colour identifies it in the rings and the table.'], alt: 'pq CPU and memory overview with a multiring chart and aligned process table' },
    { image: 'pq-swap.png', command: 'pq --swap -n 10', caption: 'find which processes are using swap', title: 'Who is using swap?', notes: ['The outer ring shows memory; the inner ring shows swap.', 'The table is ordered by swapped bytes.'], alt: 'pq swap report with paired memory and swap rings and ranked consumers' },
    { image: 'pq-network.png', command: 'pq --net -n 8', caption: 'match connections and listeners to processes', title: 'Who is talking?', notes: ['The outer ring is active connections; the inner ring is listening sockets.', 'Red ports are listening on more than localhost.'], alt: 'pq two-ring network overview showing established connections and listeners including keylogger dot sh' },
    { image: 'pq-io.png', command: 'pq --io -n 10', caption: 'see which processes are reading and writing', title: 'Who is doing I/O?', notes: ['Three short-lived demo writers make the comparison visible here.', 'The table shows the rate measured over 400 ms, not a lifetime total.'], alt: 'pq process IO report with three demo workloads and their write rates' },
    { image: 'pq-tree.png', command: 'pq --tree chrome --cpu', caption: 'keep parent and child processes together', title: 'How did it start?', notes: ['The tree keeps parent and child relationships visible.', 'With --cpu, siblings are sorted without flattening the tree.'], alt: 'pq process tree filtered to Chrome with aligned CPU memory swap PID and parent PID columns' },
    { image: 'dq-project.png', command: 'dq --all --top 8 ~/code/oss/qtools', caption: 'find the largest parts of a project checkout', title: 'Where did the space go?', notes: ['This checkout is mostly compiler output under target.', '--all shows the largest nested directories, not only the first level.'], alt: 'dq allocated-space report showing the largest directories in the qtools project' },
    { image: 'pq-json.png', command: 'pq --json | head -36', caption: 'use the same process query from a script', title: 'Need the data?', notes: ['--json returns the report data without the terminal chart.', 'CPU, memory, swap, and process members remain separate fields.'], alt: 'pq JSON output showing sample metadata and process cluster fields' }
  ];

  let current = 0;
  $: slide = slides[current];

  async function show(index) {
    const scrollPosition = window.scrollY;
    current = Math.max(0, Math.min(slides.length - 1, index));
    await tick();
    window.scrollTo(0, scrollPosition);
  }

  function keydown(event) {
    if (event.key === 'ArrowLeft') { event.preventDefault(); show(current - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); show(current + 1); }
  }

</script>

<svelte:window on:keydown={keydown} />

<section class="gallery" aria-label="Terminal report gallery">
  <div class="slides" role="region" aria-label="Screenshot viewer">
    <figure>
      <div class="slide-stage">
        <img src={`/assets/screenshots/${slide.image}?v=${screenshotVersion}`} alt={slide.alt}>
        <div class="gallery-controls">
          <button type="button" on:click={() => show(current - 1)} disabled={current === 0} aria-label="Previous screenshot">←</button>
          <span aria-live="polite">{current + 1} / {slides.length}</span>
          <button type="button" on:click={() => show(current + 1)} disabled={current === slides.length - 1} aria-label="Next screenshot">→</button>
        </div>
        <aside class="feature-frame">
          <strong>{slide.title}</strong>
          {#each slide.notes as note}<span>{note}</span>{/each}
        </aside>
      </div>
      <figcaption><code>{slide.command}</code> — {slide.caption}</figcaption>
    </figure>
  </div>
  <nav class="gallery-dots" aria-label="Choose screenshot">
    {#each slides as slide, index}
      <button type="button" class:active={index === current} on:click={() => show(index)} aria-label={`Show ${slide.title}`} aria-current={index === current ? 'true' : undefined}></button>
    {/each}
  </nav>
</section>
