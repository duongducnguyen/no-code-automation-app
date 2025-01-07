import StartNode from './other/StartNode';
import OpenURLNode from './navigation/OpenURLNode';
import RefreshPageNode from './navigation/RefreshPageNode';
import StopNode from './other/StopNode';
import VariablesNode from './other/VariablesNode';
import ClickNode from './mouse/ClickNode';
import TypeTextNode from './keyboard/TypeTextNode';
import ElementExistsNode from './data/ElementExistsNode';
import GetTextNode from './data/GetTextNode';
import NewTabNode from './navigation/NewTabNode';
import ActivateTabNode from './navigation/ActivateTabNode';
import CloseTabNode from './navigation/CloseTabNode';
import GoBackNode from './navigation/GoBackNode';

import { faPlay, faStop, faGlobe, faRefresh, faCog, faHandPointer, faKeyboard, faSearch, faTimes, faSquarePlus, faArrowsLeftRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

// Node definitions with categories
export const nodeCategories = {
  Data: {
    label: "Data",
    nodes: [
      { 
        type: "elementExists", 
        label: "Element Exists", 
        color: "blue",
        icon: faSearch
      },
      { 
        type: "getText", 
        label: "Get Text", 
        color: "blue",
        icon: faTimes
      }
    ]
  },
  Keyboard: {
    label: "Keyboard",
    nodes: [
      { 
        type: "typeText", 
        label: "Type Text", 
        color: "blue",
        icon: faKeyboard
      }
    ]
  },
  Mouse: {
    label: "Mouse",
    nodes: [
      { 
        type: "click", 
        label: "Click", 
        color: "blue",
        icon: faHandPointer
      }
    ]
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
      },
      { 
        type: "newTab", 
        label: "New Tab", 
        color: "blue",
        icon: faSquarePlus
      },
      { 
        type: "activateTab", 
        label: "Activate Tab", 
        color: "blue",
        icon: faArrowsLeftRight
      },
      { 
        type: "closeTab", 
        label: "Close Tab", 
        color: "blue",
        icon: faTimes
      },
      { 
        type: "goBack", 
        label: "Go Back", 
        color: "blue",
        icon: faArrowLeft
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
  click: ClickNode,
  typeText: TypeTextNode,
  elementExists: ElementExistsNode,
  getText: GetTextNode,
  newTab: NewTabNode,
  activateTab: ActivateTabNode,
  closeTab: CloseTabNode,
  goBack: GoBackNode
};

// Flat node templates (if needed for compatibility)
export const nodeTemplates = Object.values(nodeCategories)
  .flatMap(category => category.nodes);
