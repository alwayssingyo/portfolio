export const load = ({ url }) => {
  return {
    title:
      url.pathname === "/"
        ? "Sung Seung Yeon"
        : `${url.pathname.slice(1)} | Sung Seung Yeon`,
  };
};
