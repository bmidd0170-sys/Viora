import { EventEmitter } from 'events';

// Global event emitter for publish events
export const publishEventEmitter = new EventEmitter();

// Event type for new published images
export interface PublishedImageEvent {
  id: string;
  prompt: string;
  imageUrl: string;
  hearts: number;
  createdAt: Date;
}

// Emit when a new image is published
export function emitImagePublished(image: PublishedImageEvent) {
  publishEventEmitter.emit('image:published', image);
}

// Subscribe to new image events
export function onImagePublished(callback: (image: PublishedImageEvent) => void) {
  publishEventEmitter.on('image:published', callback);
  
  // Return unsubscribe function
  return () => {
    publishEventEmitter.removeListener('image:published', callback);
  };
}
