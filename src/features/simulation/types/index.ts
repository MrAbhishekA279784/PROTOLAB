export interface Wire {
  id: string;
  startComp: string;
  startPin: string;
  endComp: string;
  endPin: string;
  color: string;
}

export interface Pin {
  id: string;
  x: number;
  y: number;
}

export interface ComponentInstance {
  id: string;
  type: string;
  x: number;
  y: number;
  rotation?: number;
}
