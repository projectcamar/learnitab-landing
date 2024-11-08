import React from 'react';

interface NavItemProps {
  href: string;
  children: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ href, children }) => {
  return (
    <li>
      <a href={href} className="text-purple-600 hover:text-purple-400 transition duration-300">
        {children}
      </a>
    </li>
  );
};

export default NavItem;