<script>
  import { tick } from 'svelte';

  const slides = [
    { image: 'pq-overview.png', command: 'pq -n 10', caption: 'CPU, memory, swap, and process count together', title: 'System pulse', notes: ['Resolved process clusters, not raw executable names.', 'Color carries each cluster from chart to table.'], alt: 'pq CPU and memory overview with a multiring chart and aligned process table' },
    { image: 'pq-swap.png', command: 'pq --swap -n 10', caption: 'find what has been pushed out of RAM', title: 'Memory versus swap', notes: ['The paired rings expose processes whose resident and swapped footprints differ.', 'Rows are ranked by actual swap use.'], alt: 'pq swap report with paired memory and swap rings and ranked consumers' },
    { image: 'pq-network.png', command: 'pq --net -n 8', caption: 'attribute traffic, peers, and exposed listeners', title: 'Talking versus serving', notes: ['Outer ring: established connections. Inner ring: listening sockets.', 'World-facing listeners are called out in red.'], alt: 'pq two-ring network overview showing established connections and listeners including keylogger dot sh' },
    { image: 'pq-io.png', command: 'pq --io -n 10', caption: 'live process throughput', title: 'Live throughput', notes: ['Samples kernel-accounted reads and writes over the selected interval.', 'Sort independently by total, read, or write rate.'], alt: 'pq process IO report with throughput chart and read and write rates' },
    { image: 'pq-tree.png', command: 'pq --tree chrome --cpu', caption: 'understand process families', title: 'Hierarchy with context', notes: ['Matching descendants stay attached to their parents.', 'Siblings sort by the active metric without flattening the tree.'], alt: 'pq process tree filtered to Chrome with aligned CPU memory swap PID and parent PID columns' },
    { image: 'dq-project.png', command: 'dq --exclude target --exclude .git --top 8 …/qtools', caption: 'account for a real project checkout', title: 'Project disk accounting', notes: ['Allocated blocks are the default, with hard links deduplicated.', 'Traversal and exclusions happen before every view.'], alt: 'dq allocated-space report for the qtools project with target and git excluded' },
    { image: 'pq-json.png', command: 'pq --json | head -36', caption: 'inspect or pipe the report', title: 'Machines get the same facts', notes: ['Typed fields, sample metadata, and cluster membership are preserved.', 'Pretty JSON and compact JSONL use the same query pipeline.'], alt: 'pq JSON output showing sample metadata and typed process cluster fields' }
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
  <div class="gallery-toolbar">
    <button type="button" on:click={() => show(current - 1)} disabled={current === 0} aria-label="Previous screenshot">← Previous</button>
    <button type="button" on:click={() => show(current + 1)} disabled={current === slides.length - 1} aria-label="Next screenshot">Next →</button>
    <span class="gallery-count" aria-live="polite">{current + 1} / {slides.length}</span>
  </div>
  <div class="slides" role="region" aria-label="Screenshot viewer">
    <figure>
      <div class="slide-stage">
        <img src={`/assets/screenshots/${slide.image}`} alt={slide.alt}>
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
