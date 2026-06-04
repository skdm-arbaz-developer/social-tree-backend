import { SocialMedia } from '../models/index.js';

export const getSocialLinks = async (req, res) => {
  try {
    const links = await SocialMedia.findAll({ 
      where: { user_id: req.userId },
      order: [['sort_order', 'ASC'], ['id', 'ASC']]
    });
    res.status(200).json(links);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSocialLink = async (req, res) => {
  try {
    const { platform, url, label } = req.body;
    
    let icon_url = null;
    if (req.file) {
      icon_url = `/uploads/${req.file.filename}`;
    }

    const maxSort = await SocialMedia.max('sort_order', { where: { user_id: req.userId } });
    const sort_order = maxSort !== null ? maxSort + 1 : 0;

    const link = await SocialMedia.create({
      user_id: req.userId,
      platform,
      url,
      icon_url,
      label,
      sort_order
    });

    res.status(201).json(link);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSocialLink = async (req, res) => {
  try {
    const { id } = req.params;
    const { platform, url, label } = req.body;

    const link = await SocialMedia.findOne({ where: { id, user_id: req.userId } });
    if (!link) return res.status(404).json({ message: 'Link not found' });

    if (platform) link.platform = platform;
    if (url) link.url = url;
    if (label !== undefined) link.label = label;
    
    if (req.file) {
      link.icon_url = `/uploads/${req.file.filename}`;
    }

    await link.save();
    res.status(200).json(link);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSocialLink = async (req, res) => {
  try {
    const { id } = req.params;
    const link = await SocialMedia.findOne({ where: { id, user_id: req.userId } });
    
    if (!link) return res.status(404).json({ message: 'Link not found' });

    await link.destroy();
    res.status(200).json({ message: 'Link deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const reorderSocialLinks = async (req, res) => {
  try {
    const { links } = req.body;
    
    if (!Array.isArray(links)) {
      return res.status(400).json({ message: 'Links must be an array' });
    }

    for (const item of links) {
      await SocialMedia.update(
        { sort_order: item.sort_order },
        { where: { id: item.id, user_id: req.userId } }
      );
    }

    res.status(200).json({ message: 'Links reordered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
