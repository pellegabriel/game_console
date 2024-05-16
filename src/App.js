import React, { useRef, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import SnakeGame from "./components/snake/SnakeGame";
import RaceGame from "./components/race/RaceGame";
import SpaceInvaders from "./components/space/SpaceInvaders";

import "./App.css";
import wheel from "./wheel.png";
import snake from "./snake.png";
import space from "./space.png";

function App() {
  const snakeGameRef = useRef(null);
  const raceGameRef = useRef(null);
  const spaceInvadersRef = useRef(null);

  const handleRetry = () => {
    const currentPath = window.location.pathname;
    if (currentPath === "/") {
      snakeGameRef.current.resetGame();
    } else if (currentPath === "/race") {
      raceGameRef.current.resetGame();
    } else if (currentPath === "/space") {
      spaceInvadersRef.current.resetGame();
    }
  };

  return (
    <Router>
      <div className="App">
        <div className="game-boy">
          <div className="screen">
            <Routes>
              <Route path="/" element={<SnakeGame ref={snakeGameRef} />} />
              <Route path="/race" element={<RaceGame ref={raceGameRef} />} />
              <Route
                path="/space"
                element={<SpaceInvaders ref={spaceInvadersRef} />}
              />
            </Routes>
          </div>
          <button className="retry-button" onClick={handleRetry}>
            Retry
          </button>
          <Controls />
        </div>
      </div>
    </Router>
  );
}

const Controls = () => {
  const [pressedKey, setPressedKey] = useState(null);
  const navigate = useNavigate();

  const handleButtonA = () => {
    navigate("/");
  };

  const handleButtonB = () => {
    navigate("/race");
  };

  const handleButtonC = () => {
    navigate("/space");
  };
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case "ArrowUp":
          setPressedKey("up");
          break;
        case "ArrowDown":
          setPressedKey("down");
          break;
        case "ArrowLeft":
          setPressedKey("left");
          break;
        case "ArrowRight":
          setPressedKey("right");
          break;
        default:
          break;
      }
    };

    const handleKeyUp = () => {
      setPressedKey(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div className="controls">
      <div className="dpad">
        <div className={`dpad-up ${pressedKey === "up" ? "active" : ""}`}></div>
        <div
          className={`dpad-left ${
            pressedKey === "left" ? "active" : ""
          }`}></div>
        <div
          className={`dpad-right ${
            pressedKey === "right" ? "active" : ""
          }`}></div>
        <div
          className={`dpad-down ${
            pressedKey === "down" ? "active" : ""
          }`}></div>
      </div>
      <div className="buttons">
        <div className="button a" onClick={handleButtonA}>
          <img src={snake} alt="snake" className="image" />
        </div>
        <div className="button b" onClick={handleButtonB}>
          <img src={wheel} alt="car" className="image" />
        </div>
        <div className="button c" onClick={handleButtonC}>
          <img src={space} alt="car" className="image" />
        </div>
      </div>
    </div>
  );
};

export default App;
