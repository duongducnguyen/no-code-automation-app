import StartNode from './other/StartNode';
import OpenURLNode from './navigation/OpenURLNode';
import RefreshPageNode from './navigation/RefreshPageNode';
import StopNode from './other/StopNode';
import VariablesNode from './other/VariablesNode';

import { faPlay, faStop, faGlobe, faRefresh, faCog } from "@fortawesome/free-solid-svg-icons";

// Node definitions with categories
export const nodeCategories = {
  Data: {
    label: "Data",
    nodes: []
  },
  Keyboard: {
    label: "Keyboard",
    nodes: []
  },
  Mouse: {
    label: "Mouse",
    nodes: []
  },
  Navigation: {
    label: "Navigation",
    nodes: [
      { 
        type: "openURL", 
        label: "Open URL", 
        color: "blue",
        icon: faGlobe
      },
      { 
        type: "refreshPage", 
        label: "Refresh Page", 
        color: "blue",
        icon: faRefresh
      }
    ]
  },
  Other: {
    label: "Other",
    nodes: [
      { 
        type: "start", 
        label: "Start", 
        color: "green",
        icon: faPlay
      },
      { 
        type: "stop", 
        label: "Stop", 
        color: "red",
        icon: faStop
      },
      { 
        type: "variables", 
        label: "Variables", 
        color: "yellow",
        icon: faCog
      }

    ]
  }
};

// Flat node types for ReactFlow
export const nodeTypes = {
  start: StartNode,
  openURL: OpenURLNode,
  refreshPage: RefreshPageNode,
  stop: StopNode,
  variables: VariablesNode,
};

// Flat node templates (if needed for compatibility)
export const nodeTemplates = Object.values(nodeCategories)
  .flatMap(category => category.nodes);
