import React, { Component } from "react";

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // get canvas variable
    const canvas = this.refs.canvas;
    // ctx is a new drawing element
    const ctx = canvas.getContext("2d");
    this.setState({ ctx });

    this.buildGame(ctx);
  }

  buildGame(ctx) {
    ctx.font = "40px Courier";
    ctx.fillText("WELCOME TO BREAKOUT", 50, 75);
    this.makePaddle(ctx);
    this.makeBall(ctx);
  }

  makePaddle(ctx) {
    ctx.beginPath();
    ctx.rect(200, 380, 150, 10);
    ctx.fillStyle = "#000000";
    ctx.fill();
    ctx.closePath();
  }

  makeBall(ctx) {
    ctx.beginPath();
    ctx.arc(270, 350, 15, 0, Math.PI * 2, false);
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.closePath();
  }

  render() {
    return (
      <div>
        <canvas
          ref="canvas"
          width={640}
          height={425}
          style={{ border: "1px solid black", marginLeft: "1rem" }}
        />
      </div>
    );
  }
}

export { Canvas };
