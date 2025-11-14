import { Request, Response } from 'express';
import { mockLibraryResources } from '../data/lib_resource.js';

// GET /api/library - Lấy tất cả library resources (có thể filter theo subject, type)
export const getAllLibraryResources = (req: Request, res: Response) => {
  try {
    const { subject, type } = req.query;
    
    let resources = mockLibraryResources;

    // Filter theo subject
    if (subject) {
      resources = resources.filter(r => r.subject === subject);
    }

    // Filter theo type
    if (type) {
      resources = resources.filter(r => r.type === type);
    }

    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/library/:id - Lấy library resource theo ID
export const getLibraryResourceById = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resource = mockLibraryResources.find(r => r.id === id);

    if (!resource) {
      return res.status(404).json({ message: 'Library resource not found' });
    }

    res.status(200).json(resource);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

