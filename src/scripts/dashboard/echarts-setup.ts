/**
 * Tree-shaken ECharts setup for the dashboard.
 *
 * Registers only the components needed: radar + bar charts with SVG renderer.
 * This module is a side-effect registration — import it once to activate ECharts.
 *
 * NOT testable in vitest (needs DOM for SVGRenderer). Consumed by island scripts.
 */

import * as echarts from 'echarts/core';

// Charts
import { RadarChart, BarChart, MapChart } from 'echarts/charts';

// Components
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  RadarComponent,
  LegendComponent,
  AriaComponent,
  GeoComponent,
  VisualMapContinuousComponent,
} from 'echarts/components';

// Renderer
import { SVGRenderer } from 'echarts/renderers';

// Register all required components
echarts.use([
  RadarChart,
  BarChart,
  MapChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  RadarComponent,
  LegendComponent,
  AriaComponent,
  GeoComponent,
  VisualMapContinuousComponent,
  SVGRenderer,
]);

export { echarts };
