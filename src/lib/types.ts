
import { Timestamp } from 'firebase/firestore';

export interface Project {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
}

export interface ProjectFile {
    id: string;
    name: string;
    url: string;
    type: 'document' | 'geojson';
    status: 'uploaded' | 'processing' | 'completed' | 'failed';
    createdAt: Timestamp;
}

export interface ReviewCard {
  id: string;
  projectId: string;
  fileId: string;
  excerpt: string;
  insight: string;
  category: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Timestamp;
}
