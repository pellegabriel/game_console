import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import './SpaceInvaders.css';
import player from './player.png';
import enemie from './enemie.png';

const SPACE_WIDTH = 300;
const SPACE_HEIGHT = 390;
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 20;
const BULLET_WIDTH = 5;
const BULLET_HEIGHT = 10;
const ENEMY_WIDTH = 40;
const ENEMY_HEIGHT = 20;
const ENEMY_ROWS = 3;
const ENEMY_COLUMNS = 5;

const SpaceInvaders = forwardRef((props, ref) => {
  const [playerPosition, setPlayerPosition] = useState(SPACE_WIDTH / 2 - PLAYER_WIDTH / 2);
  const [bullets, setBullets] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const gameRef = useRef();

  useImperativeHandle(ref, () => ({
    resetGame: () => {
      setPlayerPosition(SPACE_WIDTH / 2 - PLAYER_WIDTH / 2);
      setBullets([]);
      setScore(0);
      setIsGameOver(false);
      initializeEnemies();
    },
  }));

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isGameOver) return;
      if (e.key === 'ArrowLeft') {
        setPlayerPosition((prev) => Math.max(prev - 20, 0));
      } else if (e.key === 'ArrowRight') {
        setPlayerPosition((prev) => Math.min(prev + 20, SPACE_WIDTH - PLAYER_WIDTH));
      } else if (e.key === ' ') {
        setBullets((prev) => [
          ...prev,
          { x: playerPosition + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2, y: SPACE_HEIGHT - PLAYER_HEIGHT - BULLET_HEIGHT }
        ]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isGameOver, playerPosition]);

  const initializeEnemies = () => {
    let newEnemies = [];
    for (let row = 0; row < ENEMY_ROWS; row++) {
      for (let col = 0; col < ENEMY_COLUMNS; col++) {
        newEnemies.push({ x: col * (ENEMY_WIDTH + 25), y: row * (ENEMY_HEIGHT + 10), id: `${row}-${col}` });
      }
    }
    setEnemies(newEnemies);
  };

  useEffect(() => {
    initializeEnemies();
  }, []);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      if (isGameOver) return;

      setBullets((prev) => prev.map(bullet => ({ ...bullet, y: bullet.y - 5 })).filter(bullet => bullet.y > 0));

      setEnemies((prev) => {
        let newEnemies = prev.map(enemy => ({ ...enemy, y: enemy.y + 1 }));
        newEnemies.forEach(enemy => {
          if (enemy.y + ENEMY_HEIGHT >= SPACE_HEIGHT) {
            setIsGameOver(true);
          }
        });
        return newEnemies;
      });

      setBullets((prevBullets) => {
        let newBullets = [...prevBullets];
        let updatedEnemies = [...enemies];
        
        newBullets.forEach((bullet, bulletIndex) => {
          for (let enemyIndex = 0; enemyIndex < updatedEnemies.length; enemyIndex++) {
            let enemy = updatedEnemies[enemyIndex];
            if (
              bullet.x < enemy.x + ENEMY_WIDTH &&
              bullet.x + BULLET_WIDTH > enemy.x &&
              bullet.y < enemy.y + ENEMY_HEIGHT &&
              bullet.y + BULLET_HEIGHT > enemy.y
            ) {
              newBullets.splice(bulletIndex, 1);
              updatedEnemies.splice(enemyIndex, 1);
              setEnemies(updatedEnemies);
              setScore((prevScore) => prevScore + 1);
              break;
            }
          }
        });
        return newBullets;
      });
    }, 50);

    return () => {
      clearInterval(gameLoop);
    };
  }, [isGameOver, enemies]);

  return (
    <div className="space-invaders">
      <div className="space" ref={gameRef}>
             <img
          src={player}
          className="player"
          style={{ left: `${playerPosition}px`, width: `${PLAYER_WIDTH}px`, height: `${PLAYER_HEIGHT}px` }}
        />
        {bullets.map((bullet, index) => (
          <div
            key={index}
            className="bullet"
            style={{ left: `${bullet.x}px`, top: `${bullet.y}px`, width: `${BULLET_WIDTH}px`, height: `${BULLET_HEIGHT}px` }}
          />
        ))}
        {enemies.map((enemy) => (
          <div
            key={enemy.id}
            className="enemy"
            style={{ left: `${enemy.x}px`, top: `${enemy.y}px`, width: `${ENEMY_WIDTH}px`, height: `${ENEMY_HEIGHT}px` }}
          >            <img
              src={enemie}
              alt="enemy"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        ))}
        {isGameOver && (
          <div className="game-over">
            <p>Game Over</p>
            <button onClick={() => ref.current.resetGame()}>Retry</button>
          </div>
        )}
      </div>
      <div className="score">Score: {score}</div>
    </div>
  );
});

export default SpaceInvaders;
