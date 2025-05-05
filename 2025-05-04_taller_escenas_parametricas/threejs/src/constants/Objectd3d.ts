export type ObjectData = {
    id: string;
    type: 'box' | 'sphere' | 'cylinder';
    position: [number, number, number];
    scale: [number, number, number];
    color: string;
    rotationSpeed: [number, number, number];
  };
  

export const objects: ObjectData[] = [
    {
      id: '1',
      type: 'box',
      position: [-2, 0, 0],
      scale: [1, 1, 1],
      color: 'orange',
      rotationSpeed: [0.01, 0.01, 0],
    },
    {
      id: '2',
      type: 'sphere',
      position: [2, 0, 0],
      scale: [1, 1, 1],
      color: 'skyblue',
      rotationSpeed: [0.01, 0.02, 0],
    },
    {
      id: '3',
      type: 'cylinder',
      position: [0, 2, 0],
      scale: [1, 1, 1],
      color: 'lightgreen',
      rotationSpeed: [0.02, 0.01, 0],
    },
  ];