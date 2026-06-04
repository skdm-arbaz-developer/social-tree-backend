import { Service } from '../models/index.js';

export const getServices = async (req, res) => {
  try {
    const services = await Service.findAll({ 
      where: { user_id: req.userId },
      order: [['sort_order', 'ASC'], ['id', 'ASC']]
    });
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addService = async (req, res) => {
  try {
    const { service_name, short_desc, icon } = req.body;
    const maxSort = await Service.max('sort_order', { where: { user_id: req.userId } });
    const sort_order = maxSort !== null ? maxSort + 1 : 0;

    const newService = await Service.create({
      user_id: req.userId,
      service_name,
      short_desc,
      icon,
      sort_order
    });
    res.status(201).json({ message: 'Service added successfully', data: newService });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { service_name, short_desc, icon } = req.body;
    const service = await Service.findOne({ where: { id, user_id: req.userId } });
    
    if (!service) return res.status(404).json({ message: 'Service not found' });
    
    await service.update({ service_name, short_desc, icon });
    res.status(200).json({ message: 'Service updated successfully', data: service });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findOne({ where: { id, user_id: req.userId } });
    
    if (!service) return res.status(404).json({ message: 'Service not found' });
    
    await service.destroy();
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const reorderServices = async (req, res) => {
  try {
    const { services } = req.body;
    
    if (!Array.isArray(services)) {
      return res.status(400).json({ message: 'Services must be an array' });
    }

    for (const item of services) {
      await Service.update(
        { sort_order: item.sort_order },
        { where: { id: item.id, user_id: req.userId } }
      );
    }

    res.status(200).json({ message: 'Services reordered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
