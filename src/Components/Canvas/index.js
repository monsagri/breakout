import React, { Component } from "react";

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canvas: {
        height: 600,
        width: 800
      },
      coordinates: {
        ball: { x: 250, y: 350, radius: 10 },
        paddle: {
          height: 10,
          width: 75,
          x: (800 - 75) / 2
        }
      },
      movement: {
        ball: { left: 1, top: 1, speedX: 2, speedY: 2 },
        paddle: { left: 1, top: 1, speedX: 5, speedY: 0 }
      },
      controls: {}
    };
    this.keyDownHandler = this.keyDownHandler.bind(this);
    this.keyUpHandler = this.keyUpHandler.bind(this);
  }

  componentDidMount() {
    // get canvas variable
    const canvas = this.refs.canvas;
    // ctx is a new drawing element
    const ctx = canvas.getContext("2d");
    this.setState({ ctx });

    const drawLoop = setInterval(() => this.handleGame(ctx), 10);
    this.setState({ drawLoop });
    document.addEventListener("keydown", this.keyDownHandler, false);
    document.addEventListener("keyup", this.keyUpHandler, false);
  }

  keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight")
      return this.setState({
        controls: { ...this.state.controls, move: true },
        movement: {
          ...this.state.movement,
          paddle: { ...this.state.movement.paddle, left: 1 }
        }
      });
    if (e.key === "Left" || e.key === "ArrowLeft")
      return this.setState({
        controls: { ...this.state.controls, move: true },
        movement: {
          ...this.state.movement,
          paddle: { ...this.state.movement.paddle, left: -1 }
        }
      });
  }

  keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight")
      return this.setState({
        controls: { ...this.state.controls, move: false }
      });
    if (e.key === "Left" || e.key === "ArrowLeft")
      return this.setState({
        controls: { ...this.state.controls, move: false }
      });
  }

  handleGame(ctx) {
    const {
      canvas: { height, width }
    } = this.state;
    ctx.clearRect(0, 0, width, height);
    this.drawGame(ctx);
  }

  drawGame(ctx) {
    ctx.font = "40px Courier";
    ctx.fillText("WELCOME TO BREAKOUT", 50, 75);
    this.makePaddle(ctx);
    this.drawBall(ctx);
    this.handleMovement("ball");
    if (this.state.controls.move) this.handleMovement("paddle");
  }

  handleCollisions({ sprite, x, y, radius }) {
    const {
      canvas,
      coordinates: { paddle },
      movement: {
        [sprite]: { left, top, speedX, speedY }
      }
    } = this.state;

    let dX = left * speedX;
    let dY = top * speedY;
    
    //  Check for walls (pull into own function later)
    if (y + dY < radius) {
      dY = -dY;
      this.setState({
        movement: {
          ...this.state.movement,
          [sprite]: { ...this.state.movement[sprite], top: top * -1 }
        }
      });
    }
    if (x + dX > canvas.width - radius || x + dX < radius) {
      dX = -dX;
      this.setState({
        movement: {
          ...this.state.movement,
          [sprite]: { ...this.state.movement[sprite], left: left * -1 }
        }
      });
    }

    // check for paddle collision
    if (y + dY > canvas.height - radius - paddle.height) {
      if (x > paddle.x && x < paddle.x + paddle.width) {
        dY = -dY;
        this.setState({
          movement: {
            ...this.state.movement,
            ball: {
              ...this.state.movement.ball,
              top: this.state.movement.ball.top * -1
            }
          }
        });
      }
    }
    // check for GameOver
    if (y + dY > canvas.height - radius) {
      window.alert("GAME OVER");
      document.location.reload();
      clearInterval(this.state.drawLoop);
    }

    return { dX, dY };
  }

  handleMovement(sprite) {
    const {
      coordinates: {
        [sprite]: { x, y, radius = 0 }
      }
    } = this.state;

    let { dX, dY } = this.handleCollisions({
      sprite,
      x,
      y,
      radius
    });
    this.setState({
      coordinates: {
        ...this.state.coordinates,
        [sprite]: {
          ...this.state.coordinates[sprite],
          ...{ x: x + dX, y: y + dY }
        }
      }
    });
  }

  makePaddle(ctx) {
    const {
      canvas,
      coordinates: {
        paddle: { x, height, width }
      }
    } = this.state;
    ctx.beginPath();
    ctx.rect(x, canvas.height - height - 10, width, height);
    ctx.fillStyle = "#000000";
    ctx.fill();
    ctx.closePath();
  }

  drawBall(ctx) {
    const {
      coordinates: {
        ball: { x, y, radius }
      }
    } = this.state;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.closePath();
  }

  render() {
    const {
      canvas: { height, width }
    } = this.state;
    return (
      <div>
        <canvas
          ref="canvas"
          width={width}
          height={height}
          style={{ border: "1px solid black", marginLeft: "1rem" }}
        />
      </div>
    );
  }
}

export { Canvas };
