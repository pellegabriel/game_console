// src/SnakeGame.js

import React, { useState, useEffect } from 'react';
import './SnakeGame.css';
import apple from './apple.png'; // Importa la imagen de la manzana

const CELL_SIZE = 20;
const WIDTH = 800;
const HEIGHT = 600;

const getRandomFood = () => {
  let min = 1;
  let maxX = (WIDTH / CELL_SIZE) - 1;
  let maxY = (HEIGHT / CELL_SIZE) - 1;
  let x = Math.floor((Math.random() * (maxX - min + 1) + min)) * CELL_SIZE;
  let y = Math.floor((Math.random() * (maxY - min + 1) + min)) * CELL_SIZE;
  return [x, y];
};

const SnakeGame = () => {
  const [snake, setSnake] = useState([
    { x: 0, y: 0 },
    { x: CELL_SIZE, y: 0 },
    { x: CELL_SIZE * 2, y: 0 },
  ]);
  const [direction, setDirection] = useState('RIGHT');
  const [food, setFood] = useState(getRandomFood());
  const [speed, setSpeed] = useState(200);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    if (isGameOver) {
      return;
    }
    const handleKeyDown = (e) => {
      switch (e.keyCode) {
        case 37:
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 38:
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 39:
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        case 40:
          if (direction !== 'UP') setDirection('DOWN');
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    const moveSnake = setInterval(() => {
      setSnake((prevSnake) => {
        let newSnake = [...prevSnake];
        let head = { ...newSnake[newSnake.length - 1] };

        switch (direction) {
          case 'LEFT':
            head.x -= CELL_SIZE;
            break;
          case 'UP':
            head.y -= CELL_SIZE;
            break;
          case 'RIGHT':
            head.x += CELL_SIZE;
            break;
          case 'DOWN':
            head.y += CELL_SIZE;
            break;
          default:
            break;
        }

        if (head.x >= WIDTH || head.x < 0 || head.y >= HEIGHT || head.y < 0) {
          setIsGameOver(true);
          return prevSnake;
        }

        for (let segment of newSnake) {
          if (segment.x === head.x && segment.y === head.y) {
            setIsGameOver(true);
            return prevSnake;
          }
        }

        newSnake.push(head);
        if (head.x === food[0] && head.y === food[1]) {
          setFood(getRandomFood());
        } else {
          newSnake.shift();
        }
        return newSnake;
      });
    }, speed);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(moveSnake);
    };
  }, [direction, food, isGameOver, speed]);

  const handleRetry = () => {
    setSnake([
      { x: 0, y: 0 },
      { x: CELL_SIZE, y: 0 },
      { x: CELL_SIZE * 2, y: 0 },
    ]);
    setDirection('RIGHT');
    setFood(getRandomFood());
    setIsGameOver(false);
    setSpeed(200);
  };

  return (
    <>
    <div>
      <div className="game-board">
        {isGameOver && <div className="game-over">Game Over</div>}
        {snake.map((segment, index) => {
          let className = 'snake-segment';
          if (index === snake.length - 1) {
            className += ' snake-head ' + direction.toLowerCase();
          }
          return (
            <div
              key={index}
              className={className}
              style={{ left: `${segment.x}px`, top: `${segment.y}px` }}
            />
          );
        })}
        <img
          src={apple}
          className="food"
          style={{ left: `${food[0]}px`, top: `${food[1]}px` }}
          alt="food"
        />
      </div>

    </div>
          {isGameOver && (
        <button className="retry-button" onClick={handleRetry}>
          Retry
        </button>
      )}</>
  );
};

export default SnakeGame;
