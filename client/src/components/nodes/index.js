import StartNode from './other/StartNode';
import OpenURLNode from './navigation/OpenURLNode';
import RefreshPage from './navigation/RefreshPage';
import StopNode from './other/StopNode';
import { faPlay, faStop, faGlobe, faRefresh } from "@fortawesome/free-solid-svg-icons";

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
      }
    ]
  }
};

// Flat node types for ReactFlow
export const nodeTypes = {
  start: StartNode,
  openURL: OpenURLNode,
  refreshPage: RefreshPage,
  stop: StopNode
};

// Flat node templates (if needed for compatibility)
export const nodeTemplates = Object.values(nodeCategories)
  .flatMap(category => category.nodes);
