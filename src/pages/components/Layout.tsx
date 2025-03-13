// src/components/Layout.tsx
import React, { FC, ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app-container">
      <header>
        <h1>Dystopian NFT Music Game</h1>
      </header>
      <main>{children}</main>
      <footer>
        <p>© 2025 Dystopian Narratives. All rights reserved.</p>
      </footer>
      <style jsx>{`
        .app-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
      `}</style>
    </div>
  );
};

export default Layout;