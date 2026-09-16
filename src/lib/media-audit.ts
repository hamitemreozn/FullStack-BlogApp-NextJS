export type StoredImageSummary = {
  key: string;
  lastModified: Date | null;
  size: number;
};

export function findUnreferencedImages(
  images: StoredImageSummary[],
  referencedKeys: Iterable<string>,
) {
  const referenced = new Set(referencedKeys);
  return images.filter((image) => !referenced.has(image.key));
}
