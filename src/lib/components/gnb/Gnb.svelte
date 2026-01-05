<header>
  <h1><a href="/">Sung SeungYeon</a></h1>
  <nav>
    <ul>
      <li><a href="/works">works</a></li>
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
    padding: 80px;
    z-index: 10;
  }

  h1 {
    font-size: 18px;
    font-weight: 600;
    line-height: 1;
    flex-shrink: 0;
    a {
      font-size: 20px;
      font-weight: 600;
      line-height: 1;
      color: #000000bd;
      transition: 0.5s;
      &:hover {
        letter-spacing: 1px;
      }
    }
  }

  nav {
    width: 50%;
    ul {
      display: flex;
      justify-content: flex-end;
      li {
        + li {
          margin-left: 10px;
        }
        &:last-of-type {
          margin-left: 40%;
        }
        a {
          font-size: 18px;
          font-weight: 400;
          line-height: 1;
          color: #000000bd;
          transition: 0.5s;
          &:hover {
            opacity: 0.6;
          }
        }
      }
    }
  }

  @include tablet {
    header {
      padding: 80px 40px;
    }
  }

  @include mobile {
    header {
      align-items: flex-start;
      padding: 20px;
    }

    nav {
      width: auto;
      ul {
        display: block;
        text-align: right;
        li {
          + li {
            margin-left: 0;
            margin-top: 8px;
          }
          &:last-of-type {
            margin-left: 0;
          }
        }
      }
    }
  }
</style>
