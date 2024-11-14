<header>
  <h1><a href="/">Sung SeungYeon</a></h1>
  <nav>
    <ul>
      <li><a href="/work">work</a></li>
      <li><a href="/about">about</a></li>
    </ul>
  </nav>
</header>

<style lang="scss">
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 24px;
    z-index: 10;
  }

  h1 {
      font-size: 20px;
      font-weight: 600;
      line-height: 1;
    a {
      font-size: 20px;
      font-weight: 600;
      line-height: 1;
      color: #000000bd;
    }
  }

  nav {
    ul {
      display: flex;
      li {
        + li {
          margin-left: 10px;
        }
        a {
          font-size: 20px;
          font-weight: 400;
          line-height: 1;
          color: #000000bd;
        }
      }
    }
  }
</style>