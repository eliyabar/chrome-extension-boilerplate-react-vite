export type BoundingRect = {
  top: number;
  left: number;
  height: number;
  width: number;
};
export type ImageDetails = {
  base64: string;
  dimensions: BoundingRect;
};
export type UseSnip = () => {
  startSnip: () => void;
  reset: () => void;
  imageDetails?: ImageDetails;
  isSnipping: boolean;
};
