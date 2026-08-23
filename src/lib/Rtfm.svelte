<script>
  import { onMount } from 'svelte';

  const docs = {
    pq: {
      label: 'process query',
      intro: 'Inspect processes, resources, open files, sockets, and process trees.',
      topics: [
        ['process', 'Processes', 'CPU, memory, swap, and process trees', `pq                         # CPU report
pq --memory                # sort by resident memory
pq --swap                  # sort by swap
pq --tree                  # parent/child table
pq -v chrome               # expand matching clusters
pq -n 30 --interval 1000   # sample for one second`],
        ['io', 'Process I/O', 'Read and write activity by process', `pq --io                    # combined I/O rate
pq --read                  # sort by reads
pq --write postgres        # writes matching postgres
pq --port 5432 --io        # I/O for a port owner`],
        ['files', 'Files & descriptors', 'Find deleted files, open FDs, and mount holders', `pq --deleted               # deleted files consuming space
pq --fds                   # descriptor counts
pq --mount /mnt/data       # processes holding a mount
pq --file /var/log/app.log # processes holding one path`],
        ['blocked', 'Blocked tasks', 'Find processes stuck in kernel waits', `pq --blocked
pq --blocked -v
pq --user postgres --blocked`],
        ['pss', 'Proportional memory', 'Inspect accurate shared-memory attribution', `pq --pss chrome
pq --pid 1234 --pss
pq --port 5432 --pss`],
        ['oom', 'OOM preference', 'See which processes the kernel prefers to kill', `pq --oom
pq postgres --oom
pq --pid 1820 --oom -v`],
        ['limits', 'Resource limits', 'Find processes approaching finite limits', `pq --limits
pq postgres --limits
pq --pid 1820 --limits -v`],
        ['unix', 'Unix sockets', 'Find owners of Unix-domain sockets', `pq --unix
pq --unix /run/docker.sock
pq --user root --unix`],
        ['net', 'Network', 'Inspect listeners, connections, ports, and peers', `pq --net
pq --listen
pq --port 8080
pq --remote-port 443
pq --net --tcp --state established
pq --public`],
        ['filters', 'Filters', 'Combine identity, user, PID, CPU, and memory filters', `pq chrome
pq --user postgres
pq --pid 1234
pq --min-cpu 10
pq --user rafael --min-memory 2GiB`],
        ['kill', 'Safe termination', 'Preview, confirm, and stop matching process trees', `pq --kill gradle
pq --kill chrome --dry-run
pq --port 8080 --kill
pq --kill gradle --yes --grace 8`],
        ['output', 'Output', 'Produce JSON or plain, pipe-friendly output', `pq --json
pq --jsonl
pq --net --json | jq .clusters
pq --no-color | less`]
      ]
    },
    dq: {
      label: 'disk query',
      intro: 'Account for disk space by directory, file, owner, or modification age.',
      topics: [
        ['views', 'Views', 'Switch between directories, files, owners, and age', `dq DIR                     # directory groups
dq --files DIR             # largest files recursively
dq --owners DIR            # allocated bytes by owner
dq --age DIR               # modification-age buckets`],
        ['filters', 'Filters', 'Select by path pattern, age, and size', `dq --exclude node_modules --exclude '*.cache' .
dq --exclude-from .dqignore .
dq --files --older-than 90d --min-size 1G /var`],
        ['scan', 'Accounting & traversal', 'Control measurement and filesystem boundaries', `dq --allocated             # filesystem blocks (default)
dq --apparent              # logical file lengths
dq --one-file-system       # do not cross mounts (default)
dq --cross-filesystems
dq --threads 80`],
        ['output', 'Output', 'Control grouping, detail, errors, and JSON', `dq --top 30
dq --depth 2
dq --min-percent 0.5
dq --all --errors
dq --json
dq --jsonl`]
      ]
    }
  };

  let command = 'pq';
  let topic = 'process';
  $: selected = docs[command].topics.find((item) => item[0] === topic) || docs[command].topics[0];

  function readHash() {
    const match = window.location.hash.match(/^#(pq|dq)-(.+)$/);
    if (match && docs[match[1]].topics.some((item) => item[0] === match[2])) {
      command = match[1];
      topic = match[2];
    }
  }

  onMount(() => {
    readHash();
    window.addEventListener('hashchange', readHash);
    return () => window.removeEventListener('hashchange', readHash);
  });

  function selectCommand(next) {
    command = next;
    topic = docs[next].topics[0][0];
    history.replaceState({}, '', `/rtfm/#${command}-${topic}`);
  }

  function selectTopic(next) {
    topic = next;
    history.replaceState({}, '', `/rtfm/#${command}-${next}`);
  }
</script>

<section class="docs-hero">
  <p class="eyebrow">COMMAND REFERENCE</p>
  <h1>Read the friendly manual.</h1>
  <p class="lede">Everything qtools can query, filter, and report—organized around the questions you want to answer.</p>
</section>

<div class="command-picker" role="tablist" aria-label="Command">
  {#each Object.entries(docs) as [key, doc]}
    <button role="tab" aria-selected={command === key} on:click={() => selectCommand(key)}><code>{key}</code><span>{doc.label}</span></button>
  {/each}
</div>

<div class="docs-layout">
  <aside aria-label={`${command} topics`}>
    <p>{docs[command].intro}</p>
    <nav>
      {#each docs[command].topics as item}
        <a href={`#${command}-${item[0]}`} class:active={topic === item[0]} on:click={(event) => { event.preventDefault(); selectTopic(item[0]); }}>
          <span>{item[1]}</span><small>{item[2]}</small>
        </a>
      {/each}
    </nav>
  </aside>

  <article id={`${command}-${selected[0]}`}>
    <div class="doc-kicker"><code>{command} help {selected[0]}</code></div>
    <h2>{selected[1]}</h2>
    <p>{selected[2]}.</p>
    <pre><code>{selected[3]}</code></pre>
    {#if command === 'pq' && topic === 'kill'}
      <div class="callout">Safety first: <code>pq --kill</code> previews and confirms before sending TERM, waits four seconds, then sends KILL only to survivors. It excludes PID 1, itself, and your invoking shell.</div>
    {:else if command === 'pq' && topic === 'pss'}
      <div class="callout">PSS reads <code>/proc/PID/smaps_rollup</code>. It is more accurate for shared memory, but more expensive and permission-sensitive than the default RSS report.</div>
    {:else if command === 'dq' && topic === 'scan'}
      <div class="callout">Hard links are counted once by device and inode. Symbolic links are not followed.</div>
    {/if}
    <p class="terminal-tip">Run <code>{command} --help</code> for orientation or <code>{command} help {selected[0]}</code> for this topic in your terminal.</p>
  </article>
</div>
