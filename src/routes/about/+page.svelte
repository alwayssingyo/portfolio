<script lang="ts">
  import "$lib/assets/styles/page.scss";

  let flipped = false;

  function toggleCard() {
    flipped = !flipped;
  }
</script>

<div class="page">
  <h1>about</h1>
  <div>설명 들어가실게요~</div>

  <div class="card-container">
    <div
      class="card"
      class:flipped
      role="button"
      tabindex="0"
      aria-pressed={flipped}
      on:click={toggleCard}
      on:keydown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleCard();
        }
      }}
    >
      <div class="front">
        <div class="link">
          <a
            href="https://github.com/alwayssingyo"
            target="_blank"
            rel="noopener noreferrer"
            on:click|stopPropagation
          >
            github
          </a>
          <a href="mailto:alwayssingyo@gmail.com" on:click|stopPropagation
            >alwayssingyo@gmail.com</a
          >
        </div>
        <div class="name">SUNG SEUNG YEON</div>
      </div>
      <div class="back">
        <div class="text">From code<br />To experience.</div>
      </div>
    </div>
  </div>
</div>
