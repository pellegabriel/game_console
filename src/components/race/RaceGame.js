import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import './RaceGame.css';
import car from './transport.png';

const CAR_SIZE = 35; 
const ROAD_WIDTH = 300;
const ROAD_HEIGHT = 410;
const OBSTACLE_MIN_WIDTH = 20;
const OBSTACLE_MAX_WIDTH = 40;
const OBSTACLE_MIN_HEIGHT = 50;
const OBSTACLE_MAX_HEIGHT = 100;
const OBSTACLE_MIN_SPEED = 3;
const OBSTACLE_MAX_SPEED = 50;

const getRandomObstacleX = (width) => {
  const minX = 0;
  const maxX = ROAD_WIDTH - width;
  return Math.floor(Math.random() * (maxX - minX + 1) + minX);
};

const getRandomObstacleWidth = () => {
  return Math.floor(
    Math.random() * (OBSTACLE_MAX_WIDTH - OBSTACLE_MIN_WIDTH + 1) +
      OBSTACLE_MIN_WIDTH
  );
};

const getRandomObstacleHeight = () => {
  return Math.floor(
    Math.random() * (OBSTACLE_MAX_HEIGHT - OBSTACLE_MIN_HEIGHT + 1) +
      OBSTACLE_MIN_HEIGHT
  );
};

const getRandomObstacleSpeed = () => {
  return Math.floor(
    Math.random() * (OBSTACLE_MAX_SPEED - OBSTACLE_MIN_SPEED + 1) +
      OBSTACLE_MIN_SPEED
  );
};

const RaceGame = forwardRef((props, ref) => {
  const [carPosition, setCarPosition] = useState(ROAD_WIDTH / 2 - CAR_SIZE / 2);
  const [obstacles, setObstacles] = useState([]);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  useImperativeHandle(ref, () => ({
    resetGame() {
      handleRetry();
    }
  }));

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isGameOver) return;
      switch (e.keyCode) {
        case 37: // Left arrow
          setCarPosition((prev) => Math.max(prev - CAR_SIZE, 0));
          break;
        case 39: // Right arrow
          setCarPosition((prev) =>
            Math.min(prev + CAR_SIZE, ROAD_WIDTH - CAR_SIZE)
          );
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isGameOver]);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      if (isGameOver) return;

      setObstacles((prev) => {
        const newObstacles = prev
          .map((obstacle) => ({
            ...obstacle,
            y: obstacle.y + obstacle.speed,
          }))
          .filter((obstacle) => obstacle.y < ROAD_HEIGHT);

        if (Math.random() < 0.1) {
          const width = getRandomObstacleWidth();
          const height = getRandomObstacleHeight();
          newObstacles.push({
            x: getRandomObstacleX(width),
            y: -height,
            width: width,
            height: height,
            speed: getRandomObstacleSpeed(),
          });
        }

        return newObstacles;
      });

      setScore((prev) => prev + 1);
    }, 100);

    return () => {
      clearInterval(gameLoop);
    };
  }, [isGameOver]);

  useEffect(() => {
    const checkCollision = setInterval(() => {
      if (isGameOver) return;

      for (const obstacle of obstacles) {
        if (
          obstacle.y + obstacle.height >= ROAD_HEIGHT - CAR_SIZE &&
          obstacle.x < carPosition + CAR_SIZE &&
          obstacle.x + obstacle.width > carPosition
        ) {
          setIsGameOver(true);
          break;
        }
      }
    }, 100);

    return () => {
      clearInterval(checkCollision);
    };
  }, [obstacles, carPosition, isGameOver]);

  const handleRetry = () => {
    setCarPosition(ROAD_WIDTH / 2 - CAR_SIZE / 2);
    setObstacles([]);
    setScore(0);
    setIsGameOver(false);
  };

  return (
    <div>
      <div className="road">
        <div
          className="car"
          style={{ left: `${carPosition}px`, bottom: "0px" }}
        >
          <img src={car} alt="Car" className="car-image" />
        </div>
        {obstacles.map((obstacle, index) => (
          <div
            key={index}
            className="obstacle"
            style={{
              left: `${obstacle.x}px`,
              top: `${obstacle.y}px`,
              width: `${obstacle.width}px`,
              height: `${obstacle.height}px`,
            }}
          />
        ))}
      </div>
      {isGameOver && (
        <div className="game-over">
          <p>Game Over</p>
        </div>
      )}
      <div className="score">Score: {score}</div>
    </div>
  );
});

export default RaceGame;
