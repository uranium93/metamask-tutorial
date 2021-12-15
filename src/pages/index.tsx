import React, { useEffect } from 'react';
import { PageProps } from 'gatsby';
import ModelViewer from '@metamask/logo';
import { Helmet } from 'react-helmet';
import NavBar from '@/components/NavBar';

const Home: React.FC<PageProps> = () => {
  useEffect(() => {
    /**
     * @see https://github.com/MetaMask/logo
     */
    const viewer = ModelViewer({
      pxNotRatio: true,
      width: 500,
      height: 400,
      followMouse: false,
      slowDrift: false,
    });
    const container = document.getElementById(`metamask-fox-container`);
    container.appendChild(viewer.container);
    viewer.lookAt({
      x: 100,
      y: 100,
    });
    viewer.setFollowMouse(true);
    viewer.stopAnimation();
  }, []);
  return (
    <main className="h-full flex flex-col" id="main">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Connect Metamask Tutorial</title>
      </Helmet>
      <div className="lg:container">
        <NavBar />

        <div
          className="my-auto mx-auto flex justify-center mt-40"
          id="metamask-fox-container"
        />
      </div>
    </main>
  );
};

export default Home;
