import React from "react";
import Head from "next/head";
import Safe from "react-safe";

const InBody = ({ children }) => ReactDOM.createPortal(children, document.body);

export const DynamicScripts = ({ location, scriptUrl, inlineScript }: any) => {
  const scripts = [
    scriptUrl && <script async url={scriptUrl}></script>,
    inlineScript && <Safe.script>{inlineScript}</Safe.script>,
  ];
  // location = Where to put the script.
  // true = head, false = body
  if (location) {
    return scripts;
  } else {
    return <InBody>{scripts}</InBody>;
  }
};

export const HeadWithMetas = ({
  title,
  description,
  url,
  image,
  scripts,
  noIndex,
  children,
  canonical,
}: HeadWithMetasProps) => {
  return (
    <Head>
      <meta charSet="utf-8" />
      <title>{title}</title>
      <meta name="description" content={description} />

      <link rel="preconnect" href="https://fonts.googleapis.com"></link>
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin=""
      ></link>
      <link
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,600;0,700;1,100;1,200;1,300;1,600;1,700&family=IBM+Plex+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap"
        rel="stylesheet"
      ></link>

      {noIndex && <meta name="googlebot" content="noindex" />}

      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
      />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {url && <meta property="og:url" content={url} />}
      {image && image.file ? (
        <meta property="og:image" content={"https:" + image.file.url} />
      ) : image && image.url ? (
        <meta property="og:image" content={image.url} />
      ) : null}
      <meta property="og:type" content="website" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:site" content="@labelbox" />
      <meta name="twitter:creator" content="@labelbox" />
      {url && <meta name="twitter:url" content={url} />}
      {image && image.file ? (
        <meta property="twitter:image" content={"https:" + image.file.url} />
      ) : image && image.url ? (
        <meta property="twitter:image" content={image.url} />
      ) : null}

      {canonical && <link rel="canonical" href={url} />}

      {children}

      {scripts && scripts.map(DynamicScripts)}
    </Head>
  );
};

export default HeadWithMetas;
