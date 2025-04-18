import React from 'react'
import { Link } from 'react-router-dom';
import { FaDesktop, FaGlobe } from 'react-icons/fa6';

export default function Home() {
  return (
    <div className='game-catogries'>
      <div className="game-item">
        <div className="game-icon-wrap">
            <FaDesktop />
        </div>

        <h2 className="game-item-title">Local Multiplayer</h2>
        <Link to="local-multiplayer" className="game-link">Play Now</Link>
      </div>
      <div className="game-item">
        <div className="game-icon-wrap">
            <FaGlobe />
        </div>

        <h2 className="game-item-title">Online Multiplayer</h2>
        <Link to="om-start" className="game-link">Play Now</Link>
      </div>
    </div>
  )
}
