/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */

import mxPoint from "FIXME";

class mxTriangle extends mxActor {
  /**
   * Class: mxTriangle
   *
   * Implementation of the triangle shape.
   *
   * Constructor: mxTriangle
   *
   * Constructs a new triangle shape.
   */
  constructor() {
    super();
  }

  /**
   * Function: isRoundable
   *
   * Adds roundable support.
   */
  isRoundable = () => {
    return true;
  };

  /**
   * Function: redrawPath
   *
   * Draws the path for this shape.
   */
  redrawPath = (c, x, y, w, h) => {
    var arcSize = mxUtils.getValue(this.style, mxConstants.STYLE_ARCSIZE, mxConstants.LINE_ARCSIZE) / 2;
    this.addPoints(c, [new mxPoint(0, 0), new mxPoint(w, 0.5 * h), new mxPoint(0, h)], this.isRounded, arcSize, true);
  };
}

export default mxTriangle;
