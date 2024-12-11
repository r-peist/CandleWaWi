import React from "react";
import "./Navigation.css";

function Navigation() {
  return (
    <nav className="navigation">
      <ul>
        <li><a href="/">Startseite</a></li>
        <li><a href="/about">Über uns</a></li>
        <li><a href="/contact">Kontakt</a></li>
      </ul>
    </nav>
  );
}

export default Navigation;
