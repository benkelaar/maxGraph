import CellState from '../cell/datatypes/CellState';
import { htmlEntities } from '../../util/StringUtils';
import Resources from '../../util/Resources';
import Shape from '../geometry/shape/Shape';
import Cell from '../cell/datatypes/Cell';
import { autoImplement } from '../../util/Utils';

import type Graph from '../Graph';
import type GraphFolding from '../folding/GraphFolding';

type PartialGraph = Pick<
  Graph,
  'getSelectionCellsHandler' | 'convertValueToString' | 'getTooltipHandler'
>;
type PartialFolding = Pick<GraphFolding, 'getCollapseExpandResource'>;
type PartialClass = PartialGraph & PartialFolding;

class GraphTooltip extends autoImplement<PartialClass>() {
  /**
   * Returns the string or DOM node that represents the tooltip for the given
   * state, node and coordinate pair. This implementation checks if the given
   * node is a folding icon or overlay and returns the respective tooltip. If
   * this does not result in a tooltip, the handler for the cell is retrieved
   * from {@link selectionCellsHandler} and the optional getTooltipForNode method is
   * called. If no special tooltip exists here then {@link getTooltipForCell} is used
   * with the cell in the given state as the argument to return a tooltip for the
   * given state.
   *
   * @param state {@link mxCellState} whose tooltip should be returned.
   * @param node DOM node that is currently under the mouse.
   * @param x X-coordinate of the mouse.
   * @param y Y-coordinate of the mouse.
   */
  getTooltip(state: CellState, node: HTMLElement | SVGElement, x: number, y: number) {
    let tip: HTMLElement | string | null = null;

    // Checks if the mouse is over the folding icon
    if (
      state.control &&
      (node === state.control.node || node.parentNode === state.control.node)
    ) {
      tip = this.getCollapseExpandResource();
      tip = htmlEntities(Resources.get(tip) || tip, true).replace(/\\n/g, '<br>');
    }

    if (!tip && state.overlays) {
      state.overlays.visit((id: string, shape: Shape) => {
        // LATER: Exit loop if tip is not null
        if (!tip && (node === shape.node || node.parentNode === shape.node)) {
          tip = shape.overlay ? shape.overlay.toString() ?? null : null;
        }
      });
    }

    if (!tip) {
      const handler = this.getSelectionCellsHandler().getHandler(state.cell);
      if (handler && typeof handler.getTooltipForNode === 'function') {
        tip = handler.getTooltipForNode(node);
      }
    }

    if (!tip) {
      tip = this.getTooltipForCell(state.cell);
    }

    return tip;
  }

  /**
   * Returns the string or DOM node to be used as the tooltip for the given
   * cell. This implementation uses the cells getTooltip function if it
   * exists, or else it returns {@link convertValueToString} for the cell.
   *
   * @example
   *
   * ```javascript
   * graph.getTooltipForCell = function(cell)
   * {
   *   return 'Hello, World!';
   * }
   * ```
   *
   * Replaces all tooltips with the string Hello, World!
   *
   * @param cell {@link mxCell} whose tooltip should be returned.
   */
  getTooltipForCell(cell: Cell) {
    let tip = null;

    if (cell && 'getTooltip' in cell) {
      // @ts-ignore getTooltip() must exists.
      tip = cell.getTooltip();
    } else {
      tip = this.convertValueToString(cell);
    }

    return tip;
  }

  /*****************************************************************************
   * Group: Graph behaviour
   *****************************************************************************/

  /**
   * Specifies if tooltips should be enabled. This implementation updates
   * {@link TooltipHandler.enabled} in {@link tooltipHandler}.
   *
   * @param enabled Boolean indicating if tooltips should be enabled.
   */
  setTooltips(enabled: boolean) {
    this.getTooltipHandler().setEnabled(enabled);
  }
}

export default GraphTooltip;
